from fastapi import APIRouter, Depends

from app.models.onboarding import OnboardingRequest, OnboardingResponse
from app.services.onboarding_service import OnboardingService, get_onboarding_service
from app.dependencies.authentication import get_current_user_id

router = APIRouter(prefix="/onboarding", tags=["Onboarding"])


@router.post("/", response_model=OnboardingResponse, status_code=201)
async def complete_onboarding(
    data: OnboardingRequest,
    user_id: str = Depends(get_current_user_id),
    onboarding_service: OnboardingService = Depends(get_onboarding_service),
):
    """Composite endpoint that handles the full onboarding flow in one request:
    1. Updates user profile (first_name, last_name, phone)
    2. Creates the business with all provided fields
    3. Associates the selected plan with the user
    """
    return onboarding_service.complete_onboarding(user_id, data)
