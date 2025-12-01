import logging
import sys
from app.config import settings


def setup_logging():
    """Configure application logging"""
    log_level = getattr(logging, settings.log_level.upper(), logging.INFO)
    
    # Configure root logger
    logging.basicConfig(
        level=log_level,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(sys.stdout)
        ]
    )


def get_logger(name: str) -> logging.Logger:
    """Get logger instance for module"""
    return logging.getLogger(name)


class ContextFilter(logging.Filter):
    """Filter to add context information to log records"""
    
    def filter(self, record):
        # Add context from request state if available
        if not hasattr(record, 'user_id'):
            record.user_id = None
        if not hasattr(record, 'request_id'):
            record.request_id = None
        return True
