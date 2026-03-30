from fastapi import APIRouter, Depends, Query

from app.models.content import TrendSummary
from app.models.cluster import Cluster, PostClusterAssignment
from app.services.trend_service import TrendService, get_trend_service
from app.dependencies.authentication import get_current_user_id

router = APIRouter(prefix="/businesses/{business_id}/trends", tags=["Trends & Clusters"])


@router.get("/summaries", response_model=list[TrendSummary])
async def list_trend_summaries(
    business_id: str,
    limit: int = Query(default=20, le=50),
    user_id: str = Depends(get_current_user_id),
    trend_service: TrendService = Depends(get_trend_service),
):
    return trend_service.list_trend_summaries(business_id, limit)


@router.get("/summaries/{summary_id}", response_model=TrendSummary)
async def get_trend_summary(
    business_id: str,
    summary_id: str,
    user_id: str = Depends(get_current_user_id),
    trend_service: TrendService = Depends(get_trend_service),
):
    return trend_service.get_trend_summary(summary_id)


@router.get("/clusters", response_model=list[Cluster])
async def list_clusters(
    business_id: str,
    cluster_type: str | None = Query(default=None),
    user_id: str = Depends(get_current_user_id),
    trend_service: TrendService = Depends(get_trend_service),
):
    return trend_service.list_clusters(business_id, cluster_type)


@router.get("/clusters/{cluster_id}", response_model=Cluster)
async def get_cluster(
    business_id: str,
    cluster_id: str,
    user_id: str = Depends(get_current_user_id),
    trend_service: TrendService = Depends(get_trend_service),
):
    return trend_service.get_cluster(cluster_id)


@router.get("/posts/{post_id}/cluster-assignments", response_model=list[PostClusterAssignment])
async def list_post_cluster_assignments(
    business_id: str,
    post_id: str,
    user_id: str = Depends(get_current_user_id),
    trend_service: TrendService = Depends(get_trend_service),
):
    return trend_service.list_post_cluster_assignments(post_id)
