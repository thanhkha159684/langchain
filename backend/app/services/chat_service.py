"""
Chat service for managing chat sessions and messages
"""

from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from sqlalchemy.orm import selectinload
from datetime import datetime

from app.models.chat_session import ChatSession
from app.models.message import Message
from app.models.user import User
from app.schemas.chat import ChatSessionCreate, ChatSessionUpdate, MessageCreate
import logging

logger = logging.getLogger(__name__)


async def create_chat_session(
    db: AsyncSession,
    user: User,
    session_data: ChatSessionCreate
) -> ChatSession:
    """
    Create a new chat session for a user.
    
    Args:
        db: Database session
        user: Current authenticated user
        session_data: Session creation data
    
    Returns:
        Created ChatSession
    """
    try:
        new_session = ChatSession(
            user_id=user.id,
            title=session_data.title
        )
        db.add(new_session)
        await db.commit()
        await db.refresh(new_session)
        
        logger.info(f"Created chat session {new_session.id} for user {user.id}")
        return new_session
    
    except Exception as e:
        await db.rollback()
        logger.error(f"Failed to create chat session: {e}")
        raise


async def get_user_sessions(
    db: AsyncSession,
    user: User,
    limit: int = 20,
    offset: int = 0
) -> tuple[List[ChatSession], int]:
    """
    Get all chat sessions for a user with pagination.
    
    Args:
        db: Database session
        user: Current authenticated user
        limit: Maximum number of sessions to return
        offset: Number of sessions to skip
    
    Returns:
        Tuple of (list of ChatSessions, total count)
    """
    try:
        # Get total count
        count_query = select(func.count(ChatSession.id)).where(
            ChatSession.user_id == user.id
        )
        total_result = await db.execute(count_query)
        total = total_result.scalar_one()
        
        # Get sessions
        query = (
            select(ChatSession)
            .where(ChatSession.user_id == user.id)
            .order_by(desc(ChatSession.updated_at))
            .limit(limit)
            .offset(offset)
        )
        result = await db.execute(query)
        sessions = result.scalars().all()
        
        logger.info(f"Retrieved {len(sessions)} sessions for user {user.id}")
        return list(sessions), total
    
    except Exception as e:
        logger.error(f"Failed to get user sessions: {e}")
        raise


async def get_session_by_id(
    db: AsyncSession,
    session_id: int,
    user: User
) -> Optional[ChatSession]:
    """
    Get a chat session by ID if user owns it.
    
    Args:
        db: Database session
        session_id: ID of the session
        user: Current authenticated user
    
    Returns:
        ChatSession if found and owned by user, None otherwise
    """
    try:
        query = select(ChatSession).where(
            ChatSession.id == session_id,
            ChatSession.user_id == user.id
        )
        result = await db.execute(query)
        session = result.scalar_one_or_none()
        
        return session
    
    except Exception as e:
        logger.error(f"Failed to get session {session_id}: {e}")
        raise


async def get_session_with_messages(
    db: AsyncSession,
    session_id: int,
    user: User
) -> Optional[ChatSession]:
    """
    Get a chat session with all its messages.
    
    Args:
        db: Database session
        session_id: ID of the session
        user: Current authenticated user
    
    Returns:
        ChatSession with messages if found and owned by user
    """
    try:
        query = (
            select(ChatSession)
            .options(selectinload(ChatSession.messages))
            .where(
                ChatSession.id == session_id,
                ChatSession.user_id == user.id
            )
        )
        result = await db.execute(query)
        session = result.scalar_one_or_none()
        
        return session
    
    except Exception as e:
        logger.error(f"Failed to get session with messages {session_id}: {e}")
        raise


async def update_chat_session(
    db: AsyncSession,
    session: ChatSession,
    update_data: ChatSessionUpdate
) -> ChatSession:
    """
    Update a chat session.
    
    Args:
        db: Database session
        session: Session to update
        update_data: Update data
    
    Returns:
        Updated ChatSession
    """
    try:
        session.title = update_data.title
        session.updated_at = datetime.utcnow()
        
        await db.commit()
        await db.refresh(session)
        
        logger.info(f"Updated chat session {session.id}")
        return session
    
    except Exception as e:
        await db.rollback()
        logger.error(f"Failed to update session {session.id}: {e}")
        raise


async def delete_chat_session(
    db: AsyncSession,
    session: ChatSession
) -> None:
    """
    Delete a chat session (cascade deletes messages).
    
    Args:
        db: Database session
        session: Session to delete
    """
    try:
        session_id = session.id
        await db.delete(session)
        await db.commit()
        
        logger.info(f"Deleted chat session {session_id}")
    
    except Exception as e:
        await db.rollback()
        logger.error(f"Failed to delete session {session.id}: {e}")
        raise


async def create_message(
    db: AsyncSession,
    session_id: int,
    role: str,
    content: str
) -> Message:
    """
    Create a new message in a chat session.
    
    Args:
        db: Database session
        session_id: ID of the chat session
        role: Message role ("user" or "assistant")
        content: Message content
    
    Returns:
        Created Message
    """
    try:
        new_message = Message(
            session_id=session_id,
            role=role,
            content=content
        )
        db.add(new_message)
        await db.flush()  # Flush to get ID but don't commit yet
        
        return new_message
    
    except Exception as e:
        logger.error(f"Failed to create message: {e}")
        raise


async def get_session_messages(
    db: AsyncSession,
    session_id: int,
    limit: Optional[int] = None
) -> List[Message]:
    """
    Get messages for a chat session.
    
    Args:
        db: Database session
        session_id: ID of the chat session
        limit: Optional limit on number of messages (most recent)
    
    Returns:
        List of Messages ordered by created_at
    """
    try:
        query = (
            select(Message)
            .where(Message.session_id == session_id)
            .order_by(Message.created_at)
        )
        
        if limit:
            # Get last N messages
            subquery = (
                select(Message.id)
                .where(Message.session_id == session_id)
                .order_by(desc(Message.created_at))
                .limit(limit)
            )
            sub_result = await db.execute(subquery)
            message_ids = [row[0] for row in sub_result]
            
            query = (
                select(Message)
                .where(Message.id.in_(message_ids))
                .order_by(Message.created_at)
            )
        
        result = await db.execute(query)
        messages = result.scalars().all()
        
        return list(messages)
    
    except Exception as e:
        logger.error(f"Failed to get session messages: {e}")
        raise


async def update_session_timestamp(
    db: AsyncSession,
    session: ChatSession
) -> None:
    """
    Update the updated_at timestamp of a session.
    
    Args:
        db: Database session
        session: Session to update
    """
    try:
        session.updated_at = datetime.utcnow()
        await db.commit()
    
    except Exception as e:
        logger.error(f"Failed to update session timestamp: {e}")
        raise
