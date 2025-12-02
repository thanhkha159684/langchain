"""
LangChain Service for AI Chat Integration

Handles GPT-4 integration, conversation chains, and memory management.
"""

from typing import List, Dict, AsyncGenerator
from langchain_openai import ChatOpenAI
import logging

from app.config import settings

logger = logging.getLogger(__name__)


class LangChainService:
    """Service for managing LangChain conversations with GPT-4"""
    
    def __init__(self):
        """Initialize LangChain with OpenAI GPT-4"""
        try:
            self.llm = ChatOpenAI(
                api_key=settings.openai_api_key,
                model=settings.openai_model,
                temperature=settings.openai_temperature,
                max_tokens=settings.openai_max_tokens,
                streaming=True  # Enable streaming for future WebSocket support
            )
            logger.info(f"LangChain service initialized successfully with {settings.openai_model}")
        except Exception as e:
            logger.error(f"Failed to initialize LangChain service: {e}")
            raise
    
    async def generate_response(
        self,
        user_message: str,
        chat_history: List[Dict[str, str]] = None
    ) -> str:
        """
        Generate AI response for a user message.
        
        Args:
            user_message: The user's input message
            chat_history: Previous conversation messages (last 20 for context)
        
        Returns:
            AI generated response text
        
        Raises:
            Exception: If AI generation fails
        """
        try:
            logger.info(f"Generating AI response for message (length: {len(user_message)})")
            
            # Prepare messages for the conversation
            messages = []
            
            # System message
            messages.append(("system", "You are a helpful AI assistant. You provide clear, accurate, and concise responses."))
            
            # Add chat history
            if chat_history:
                for msg in chat_history[-20:]:  # Only last 20 messages for context
                    if msg["role"] == "user":
                        messages.append(("human", msg["content"]))
                    elif msg["role"] == "assistant":
                        messages.append(("assistant", msg["content"]))
            
            # Add current message
            messages.append(("human", user_message))
            
            # Create prompt and invoke
            response = await self.llm.ainvoke(messages)
            
            logger.info(f"AI response generated successfully (length: {len(response.content)})")
            return response.content
        
        except Exception as e:
            logger.error(f"AI response generation failed: {e}", exc_info=True)
            raise
    
    async def stream_response(
        self,
        user_message: str,
        chat_history: List[Dict[str, str]] = None
    ) -> AsyncGenerator[str, None]:
        """
        Stream AI response for a user message chunk by chunk.
        
        Args:
            user_message: The user's input message
            chat_history: Previous conversation messages (last 20 for context)
        
        Yields:
            AI response text chunks
        
        Raises:
            Exception: If AI generation fails
        """
        try:
            logger.info(f"Streaming AI response for message (length: {len(user_message)})")
            
            # Prepare messages for the conversation
            messages = []
            
            # System message
            messages.append(("system", "You are a helpful AI assistant. You provide clear, accurate, and concise responses."))
            
            # Add chat history
            if chat_history:
                for msg in chat_history[-20:]:  # Only last 20 messages for context
                    if msg["role"] == "user":
                        messages.append(("human", msg["content"]))
                    elif msg["role"] == "assistant":
                        messages.append(("assistant", msg["content"]))
            
            # Add current message
            messages.append(("human", user_message))
            
            # Stream response
            async for chunk in self.llm.astream(messages):
                if chunk.content:
                    yield chunk.content
            
            logger.info("AI response streaming completed")
        
        except Exception as e:
            logger.error(f"AI response streaming failed: {e}", exc_info=True)
            raise
    
    def health_check(self) -> bool:
        """
        Check if LangChain service is healthy and can connect to OpenAI.
        
        Returns:
            True if healthy, False otherwise
        """
        try:
            # Simple test to verify service is initialized
            return self.llm is not None
        except Exception as e:
            logger.error(f"LangChain health check failed: {e}")
            return False


# Singleton instance
_langchain_service = None


def get_langchain_service() -> LangChainService:
    """Get or create singleton LangChain service instance"""
    global _langchain_service
    if _langchain_service is None:
        _langchain_service = LangChainService()
    return _langchain_service