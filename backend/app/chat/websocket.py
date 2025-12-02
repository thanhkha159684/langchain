"""
WebSocket endpoint for real-time chat streaming
"""

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any
import json
import logging

from app.database.session import get_db
from app.models.user import User
from app.services import chat_service
from app.services.langchain_service import get_langchain_service
from app.auth.jwt_handler import decode_access_token
from jose import JWTError

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/chat", tags=["websocket"])


async def get_current_user_ws(token: str, db: AsyncSession) -> User:
    """Validate WebSocket token and get current user"""
    try:
        token_data = decode_access_token(token)
        
        if token_data is None or token_data.user_id is None:
            raise ValueError("Invalid token payload")
        
        user_id = token_data.user_id
        
        from sqlalchemy import select
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        
        if user is None:
            raise ValueError("User not found")
        
        return user
    except (JWTError, ValueError) as e:
        logger.error(f"WebSocket authentication failed: {e}")
        raise


@router.websocket("/ws/{session_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    session_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    WebSocket endpoint for streaming AI responses
    
    Query parameters:
    - token: JWT access token for authentication
    
    Message format (client -> server):
    {
        "type": "message",
        "content": "user message text"
    }
    
    Message format (server -> client):
    {
        "type": "chunk",
        "content": "partial AI response"
    }
    or
    {
        "type": "done",
        "message_id": 123
    }
    or
    {
        "type": "error",
        "message": "error description",
        "code": "ERROR_CODE"
    }
    """
    
    await websocket.accept()
    logger.info(f"WebSocket connection established for session {session_id}")
    
    try:
        # Authenticate user - get token from query params
        query_params = dict(websocket.query_params)
        token = query_params.get('token')
        
        if not token:
            await websocket.send_json({
                "type": "error",
                "message": "Authentication token is required",
                "code": "UNAUTHORIZED"
            })
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return
        
        try:
            current_user = await get_current_user_ws(token, db)
            logger.info(f"WebSocket authenticated for user {current_user.id}")
        except Exception as e:
            logger.error(f"WebSocket authentication error: {e}")
            await websocket.send_json({
                "type": "error",
                "message": "Authentication failed",
                "code": "UNAUTHORIZED"
            })
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return
        
        # Verify session ownership
        session = await chat_service.get_session_by_id(db, session_id, current_user)
        if not session:
            await websocket.send_json({
                "type": "error",
                "message": "Session not found or access denied",
                "code": "NOT_FOUND"
            })
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return
        
        # Message loop
        while True:
            # Receive message from client
            data = await websocket.receive_json()
            
            if data.get("type") != "message":
                await websocket.send_json({
                    "type": "error",
                    "message": "Invalid message type",
                    "code": "INVALID_MESSAGE_TYPE"
                })
                continue
            
            content = data.get("content", "").strip()
            if not content:
                await websocket.send_json({
                    "type": "error",
                    "message": "Message content is required",
                    "code": "EMPTY_MESSAGE"
                })
                continue
            
            if len(content) > 10000:
                await websocket.send_json({
                    "type": "error",
                    "message": "Message exceeds maximum length of 10,000 characters",
                    "code": "MESSAGE_TOO_LONG"
                })
                continue
            
            try:
                # Save user message
                user_message = await chat_service.create_message(
                    db, session_id, "user", content
                )
                await db.commit()
                
                # Send user message confirmation
                await websocket.send_json({
                    "type": "user_message",
                    "message": {
                        "id": user_message.id,
                        "role": "user",
                        "content": user_message.content,
                        "created_at": user_message.created_at.isoformat()
                    }
                })
                
                # Load conversation history
                history_messages = await chat_service.get_session_messages(
                    db, session_id, limit=20
                )
                chat_history = [
                    {"role": msg.role, "content": msg.content}
                    for msg in history_messages
                    if msg.id != user_message.id
                ]
                
                # Stream AI response
                langchain_service = get_langchain_service()
                
                full_response = ""
                async for chunk in langchain_service.stream_response(content, chat_history):
                    full_response += chunk
                    await websocket.send_json({
                        "type": "chunk",
                        "content": chunk
                    })
                
                # Save AI message
                assistant_message = await chat_service.create_message(
                    db, session_id, "assistant", full_response
                )
                await chat_service.update_session_timestamp(db, session)
                await db.commit()
                
                # Send completion signal
                await websocket.send_json({
                    "type": "done",
                    "message_id": assistant_message.id,
                    "message": {
                        "id": assistant_message.id,
                        "role": "assistant",
                        "content": assistant_message.content,
                        "created_at": assistant_message.created_at.isoformat()
                    }
                })
                
                logger.info(f"Streamed response for session {session_id}")
                
            except Exception as e:
                logger.error(f"Error processing WebSocket message: {e}", exc_info=True)
                await websocket.send_json({
                    "type": "error",
                    "message": "Failed to process message. Please try again.",
                    "code": "PROCESSING_ERROR"
                })
                
    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected for session {session_id}")
    except Exception as e:
        logger.error(f"WebSocket error: {e}", exc_info=True)
        try:
            await websocket.send_json({
                "type": "error",
                "message": "Internal server error",
                "code": "INTERNAL_ERROR"
            })
        except:
            pass
    finally:
        try:
            await websocket.close()
        except:
            pass
        logger.info(f"WebSocket connection closed for session {session_id}")
