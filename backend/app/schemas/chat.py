"""
Chat schemas for request/response validation
"""

from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime
from enum import Enum


class MessageRole(str, Enum):
    """Message role enum"""
    USER = "user"
    ASSISTANT = "assistant"


class ChatSessionCreate(BaseModel):
    """Schema for creating a new chat session"""
    title: Optional[str] = Field(default="New Conversation", max_length=255)
    
    @validator('title')
    def validate_title(cls, v):
        if v:
            v = v.strip()
            if not v:
                return "New Conversation"
        return v or "New Conversation"


class ChatSessionUpdate(BaseModel):
    """Schema for updating a chat session"""
    title: str = Field(..., min_length=1, max_length=255)
    
    @validator('title')
    def validate_title(cls, v):
        v = v.strip()
        if not v:
            raise ValueError("Title cannot be empty")
        return v


class ChatSessionResponse(BaseModel):
    """Schema for chat session response"""
    id: int
    user_id: int
    title: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class MessageCreate(BaseModel):
    """Schema for creating a new message"""
    content: str = Field(..., min_length=1, max_length=10000)
    
    @validator('content')
    def validate_content(cls, v):
        v = v.strip()
        if not v:
            raise ValueError("Message content cannot be empty")
        if len(v) > 10000:
            raise ValueError("Message content exceeds maximum length of 10,000 characters")
        return v


class MessageResponse(BaseModel):
    """Schema for message response"""
    id: int
    session_id: int
    role: MessageRole
    content: str
    created_at: datetime
    
    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class ChatMessagePair(BaseModel):
    """Schema for user message + AI response pair"""
    user_message: MessageResponse
    assistant_message: MessageResponse


class ChatSessionWithMessages(BaseModel):
    """Schema for chat session with full message history"""
    id: int
    user_id: int
    title: str
    created_at: datetime
    updated_at: datetime
    messages: List[MessageResponse]
    
    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class ChatSessionList(BaseModel):
    """Schema for paginated list of chat sessions"""
    sessions: List[ChatSessionResponse]
    total: int
    limit: int
    offset: int
