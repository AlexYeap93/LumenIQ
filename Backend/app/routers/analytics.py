from fastapi import APIRouter, Depends, Query

from app.models.analytics import (
    KpiItem,
    AudienceDataPoint,
    EngagementDataPoint,
    PlatformItem,
    TopPost,
    ActivityItem,
)
from app.services.analytics_service import AnalyticsService, get_analytics_service
from app.dependencies.authentication import get_current_user_id

router = APIRouter(prefix="/businesses/{business_id}/analytics", tags=["Analytics"])


@router.get("/kpis", response_model=list[KpiItem])
async def get_kpis(
    business_id: str,
    range: str = Query(default="7D", alias="range", pattern="^(7D|30D|90D)$"),
    user_id: str = Depends(get_current_user_id),
    analytics_service: AnalyticsService = Depends(get_analytics_service),
):
    return analytics_service.get_kpis(business_id, range)


@router.get("/audience", response_model=list[AudienceDataPoint])
async def get_audience(
    business_id: str,
    range: str = Query(default="7D", alias="range", pattern="^(7D|30D|90D)$"),
    user_id: str = Depends(get_current_user_id),
    analytics_service: AnalyticsService = Depends(get_analytics_service),
):
    return analytics_service.get_audience(business_id, range)


@router.get("/engagement", response_model=list[EngagementDataPoint])
async def get_engagement(
    business_id: str,
    range: str = Query(default="7D", alias="range", pattern="^(7D|30D|90D)$"),
    user_id: str = Depends(get_current_user_id),
    analytics_service: AnalyticsService = Depends(get_analytics_service),
):
    return analytics_service.get_engagement(business_id, range)


@router.get("/platforms", response_model=list[PlatformItem])
async def get_platforms(
    business_id: str,
    user_id: str = Depends(get_current_user_id),
    analytics_service: AnalyticsService = Depends(get_analytics_service),
):
    return analytics_service.get_platforms(business_id)


@router.get("/top-posts", response_model=list[TopPost])
async def get_top_posts(
    business_id: str,
    range: str = Query(default="7D", alias="range", pattern="^(7D|30D|90D)$"),
    user_id: str = Depends(get_current_user_id),
    analytics_service: AnalyticsService = Depends(get_analytics_service),
):
    return analytics_service.get_top_posts(business_id, range)


@router.get("/activity", response_model=list[ActivityItem])
async def get_activity(
    business_id: str,
    limit: int = Query(default=10, le=50),
    user_id: str = Depends(get_current_user_id),
    analytics_service: AnalyticsService = Depends(get_analytics_service),
):
    return analytics_service.get_activity(business_id, limit)
