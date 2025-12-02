from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base import Base
import enum


class MessageRole(str, enum.Enum):
    """Enum for message roles"""
    USER = "user"
    ASSISTANT = "assistant"


class Message(Base):
    """Message model for storing chat messages"""
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("chat_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    role = Column(Enum(MessageRole), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationship
    session = relationship("ChatSession", back_populates="messages")
