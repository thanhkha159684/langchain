from fastapi import APIRouter, Depends
from app.models.user import User
from app.dependencies import get_current_user
from app.schemas.auth import UserResponse

router = APIRouter(prefix="/api/users", tags=["Users"])


@router.get("/me", response_model=UserResponse, summary="Get Current User Profile")
async def get_user_profile(current_user: User = Depends(get_current_user)):
    """
    Get current authenticated user's profile.
    
    Requires authentication via Bearer token.
    """
    return UserResponse(
        id=current_user.id,
        username=current_user.username,
        email=current_user.email,
        is_active=current_user.is_active,
        created_at=current_user.created_at.isoformat() if current_user.created_at else ""
    )
