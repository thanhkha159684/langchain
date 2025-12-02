from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database.session import get_db
from app.schemas.auth import UserRegister, UserLogin, UserResponse, Token
from app.models.user import User
from app.auth.password import verify_password, get_password_hash
from app.auth.jwt_handler import create_access_token
from app.utils.logger import get_logger
from datetime import timedelta

router = APIRouter(prefix="/api/auth", tags=["Authentication"])
logger = get_logger(__name__)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register New User",
    description="Create a new user account with username, email, and password"
)
async def register_user(
    user_data: UserRegister,
    db: AsyncSession = Depends(get_db)
):
    """
    Register a new user account.
    
    ## Request Body
    - **username**: 3-50 characters, alphanumeric + underscore
    - **email**: Valid email address (RFC 5322)
    - **password**: Minimum 8 characters with uppercase, lowercase, and digit
    
    ## Responses
    - **201 Created**: User successfully created
    - **400 Bad Request**: Validation error
    - **409 Conflict**: Username or email already exists
    """
    logger.info(f"Registration attempt for username: {user_data.username}")
    
    # Check if username already exists
    result = await db.execute(
        select(User).where(User.username == user_data.username)
    )
    if result.scalar_one_or_none():
        logger.warning(f"Registration failed: Username {user_data.username} already exists")
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username already registered"
        )
    
    # Check if email already exists
    result = await db.execute(
        select(User).where(User.email == user_data.email)
    )
    if result.scalar_one_or_none():
        logger.warning(f"Registration failed: Email {user_data.email} already exists")
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed_password,
        is_active=True
    )
    
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    logger.info(f"User registered successfully: {new_user.username} (ID: {new_user.id})")
    
    return UserResponse(
        id=new_user.id,
        username=new_user.username,
        email=new_user.email,
        is_active=new_user.is_active,
        created_at=new_user.created_at.isoformat() if new_user.created_at else ""
    )


@router.post(
    "/login",
    response_model=Token,
    summary="User Login",
    description="Authenticate user and generate JWT access token"
)
async def login_user(
    credentials: UserLogin,
    db: AsyncSession = Depends(get_db)
):
    """
    Authenticate user and return JWT token.
    
    ## Request Body
    - **username**: Username or email
    - **password**: User password
    
    ## Responses
    - **200 OK**: Login successful, returns access token
    - **401 Unauthorized**: Invalid credentials
    """
    logger.info(f"Login attempt for user: {credentials.username}")
    
    # Try to find user by username or email
    result = await db.execute(
        select(User).where(
            (User.username == credentials.username) | (User.email == credentials.username)
        )
    )
    user = result.scalar_one_or_none()
    
    # Verify user exists and password is correct
    if not user or not verify_password(credentials.password, user.hashed_password):
        logger.warning(f"Login failed for user: {credentials.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user is active
    if not user.is_active:
        logger.warning(f"Login failed: User {user.username} is inactive")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
    
    # Create access token
    access_token = create_access_token(
        data={"sub": str(user.id), "username": user.username}
    )
    
    logger.info(f"Login successful for user: {user.username} (ID: {user.id})")
    
    return Token(access_token=access_token, token_type="bearer")
