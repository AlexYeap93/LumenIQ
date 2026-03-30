from fastapi import APIRouter, Depends

from app.models.user import UserProfile, UserProfileUpdate
from app.services.user_service import UserService, get_user_service
from app.dependencies.authentication import get_current_user_id

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserProfile)
async def get_current_user_profile(
    user_id: str = Depends(get_current_user_id),
    user_service: UserService = Depends(get_user_service),
):
    return user_service.get_profile(user_id)


@router.patch("/me", response_model=UserProfile)
async def update_current_user_profile(
    updates: UserProfileUpdate,
    user_id: str = Depends(get_current_user_id),
    user_service: UserService = Depends(get_user_service),
):
    return user_service.update_profile(user_id, updates)
