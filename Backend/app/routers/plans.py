from fastapi import APIRouter, Depends

from app.models.plan import PlanStream
from app.services.plan_service import PlanService, get_plan_service

router = APIRouter(prefix="/plans", tags=["Plans"])


@router.get("/", response_model=list[PlanStream])
async def list_plans(
    plan_service: PlanService = Depends(get_plan_service),
):
    """Returns the plan catalog. No authentication required."""
    return plan_service.list_plans()
