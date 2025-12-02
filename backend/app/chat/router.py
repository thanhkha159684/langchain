"""
Chat endpoints for session and message management
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.database.session import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.chat import (
    ChatSessionCreate,
    ChatSessionUpdate,
    ChatSessionResponse,
    ChatSessionWithMessages,
    ChatSessionList,
    MessageCreate,
    ChatMessagePair,
    MessageResponse
)
from app.services import chat_service
from app.services.langchain_service import get_langchain_service
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/sessions", response_model=ChatSessionResponse, status_code=status.HTTP_201_CREATED)
async def create_session(
    session_data: ChatSessionCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new chat session"""
    try:
        session = await chat_service.create_chat_session(db, current_user, session_data)
        return session
    except Exception as e:
        logger.error(f"Failed to create session: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "message": "Failed to create chat session",
                "code": "INTERNAL_ERROR"
            }
        )


@router.get("/sessions", response_model=ChatSessionList)
async def get_sessions(
    limit: int = 20,
    offset: int = 0,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all chat sessions for current user"""
    try:
        sessions, total = await chat_service.get_user_sessions(db, current_user, limit, offset)
        return ChatSessionList(
            sessions=sessions,
            total=total,
            limit=limit,
            offset=offset
        )
    except Exception as e:
        logger.error(f"Failed to get sessions: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "message": "Failed to retrieve chat sessions",
                "code": "INTERNAL_ERROR"
            }
        )


@router.get("/sessions/{session_id}", response_model=ChatSessionWithMessages)
async def get_session(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a chat session with all messages"""
    try:
        session = await chat_service.get_session_with_messages(db, session_id, current_user)
        
        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={
                    "message": "Chat session not found",
                    "code": "NOT_FOUND"
                }
            )
        
        return session
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get session: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "message": "Failed to retrieve chat session",
                "code": "INTERNAL_ERROR"
            }
        )


@router.patch("/sessions/{session_id}", response_model=ChatSessionResponse)
async def update_session(
    session_id: int,
    update_data: ChatSessionUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a chat session"""
    try:
        session = await chat_service.get_session_by_id(db, session_id, current_user)
        
        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={
                    "message": "Chat session not found",
                    "code": "NOT_FOUND"
                }
            )
        
        updated_session = await chat_service.update_chat_session(db, session, update_data)
        return updated_session
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update session: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "message": "Failed to update chat session",
                "code": "INTERNAL_ERROR"
            }
        )


@router.delete("/sessions/{session_id}", status_code=status.HTTP_200_OK)
async def delete_session(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a chat session"""
    try:
        session = await chat_service.get_session_by_id(db, session_id, current_user)
        
        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={
                    "message": "Chat session not found",
                    "code": "NOT_FOUND"
                }
            )
        
        await chat_service.delete_chat_session(db, session)
        return {"message": "Session deleted successfully"}
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete session: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "message": "Failed to delete chat session",
                "code": "INTERNAL_ERROR"
            }
        )


@router.post("/sessions/{session_id}/messages", response_model=ChatMessagePair)
async def send_message(
    session_id: int,
    message_data: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Send a message and get AI response"""
    try:
        # Verify session ownership
        session = await chat_service.get_session_by_id(db, session_id, current_user)
        
        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={
                    "message": "Chat session not found",
                    "code": "NOT_FOUND"
                }
            )
        
        # Save user message
        user_message = await chat_service.create_message(
            db, session_id, "user", message_data.content
        )
        
        try:
            # Load conversation history (last 20 messages for context)
            history_messages = await chat_service.get_session_messages(db, session_id, limit=20)
            
            # Format history for LangChain (exclude the just-added user message)
            chat_history = [
                {"role": msg.role, "content": msg.content}
                for msg in history_messages
                if msg.id != user_message.id
            ]
            
            # Generate AI response
            langchain_service = get_langchain_service()
            ai_response = await langchain_service.generate_response(
                message_data.content,
                chat_history
            )
            
            # Save AI message
            assistant_message = await chat_service.create_message(
                db, session_id, "assistant", ai_response
            )
            
            # Update session timestamp
            await chat_service.update_session_timestamp(db, session)
            
            # Commit all changes
            await db.commit()
            await db.refresh(user_message)
            await db.refresh(assistant_message)
            
            logger.info(f"Successfully processed message in session {session_id}")
            
            return ChatMessagePair(
                user_message=user_message,
                assistant_message=assistant_message
            )
        
        except Exception as ai_error:
            # Even if AI fails, keep the user message
            await db.commit()
            await db.refresh(user_message)
            
            logger.error(f"AI generation failed: {ai_error}", exc_info=True)
            
            # Check for specific OpenAI errors
            error_message = str(ai_error)
            if "rate_limit" in error_message.lower():
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail={
                        "message": "Too many requests. Please wait a moment and try again.",
                        "code": "AI_RATE_LIMIT"
                    }
                )
            else:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail={
                        "message": "AI service temporarily unavailable. Please try again.",
                        "code": "AI_API_ERROR"
                    }
                )
    
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        logger.error(f"Failed to process message: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "message": "Failed to process message",
                "code": "INTERNAL_ERROR"
            }
        )
