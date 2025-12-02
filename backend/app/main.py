from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.utils.logger import setup_logging, get_logger
from app.auth.router import router as auth_router
import uuid
import time

# Setup logging
setup_logging()
logger = get_logger(__name__)

app = FastAPI(
    title="LangChain Chatbot API",
    description="""
    AI-powered chatbot with GPT-4 integration via LangChain.
    
    ## Features
    * User authentication with JWT tokens
    * Multi-session chat management
    * Real-time AI responses via WebSocket
    * Conversation history persistence
    * OpenAI GPT-4 powered responses
    
    ## Authentication
    Most endpoints require JWT authentication. 
    Use /api/auth/login to obtain an access token.
    """,
    version="1.0.0",
)

# Configure CORS
origins = settings.allowed_origins.split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
from app.auth.user_router import router as user_router
app.include_router(user_router)


# Logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    request_id = str(uuid.uuid4())
    start_time = time.time()
    
    logger.info(
        f"Request started: {request.method} {request.url.path}",
        extra={"request_id": request_id}
    )
    
    try:
        response = await call_next(request)
        process_time = time.time() - start_time
        logger.info(
            f"Request completed: {request.method} {request.url.path} - "
            f"Status: {response.status_code} - Time: {process_time:.2f}s",
            extra={"request_id": request_id}
        )
        return response
    except Exception as e:
        logger.error(
            f"Request failed: {request.method} {request.url.path}",
            exc_info=True,
            extra={"request_id": request_id}
        )
        raise


@app.on_event("startup")
async def startup_event():
    """Application startup event"""
    logger.info("Starting LangChain Chatbot API...")
    logger.info(f"Debug mode: {settings.debug}")
    logger.info(f"Log level: {settings.log_level}")


@app.on_event("shutdown")
async def shutdown_event():
    """Application shutdown event"""
    logger.info("Shutting down LangChain Chatbot API...")


@app.get("/")
async def root():
    """Root endpoint - Welcome message"""
    return {"message": "Welcome to LangChain Chatbot API"}


@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    from datetime import datetime
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0"
    }
