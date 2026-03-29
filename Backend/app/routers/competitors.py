from fastapi import APIRouter, Depends, Query

from app.models.competitor import (
    Competitor,
    CompetitorCreate,
    CompetitorUpdate,
    CompetitorPost,
    CompetitorDiscoveryCandidate,
)
from app.services.competitor_service import CompetitorService, get_competitor_service
from app.dependencies.authentication import get_current_user_id

router = APIRouter(prefix="/businesses/{business_id}/competitors", tags=["Competitors"])


@router.get("/", response_model=list[Competitor])
async def list_competitors(
    business_id: str,
    user_id: str = Depends(get_current_user_id),
    competitor_service: CompetitorService = Depends(get_competitor_service),
):
    return competitor_service.list_competitors(business_id)


@router.get("/{competitor_id}", response_model=Competitor)
async def get_competitor(
    business_id: str,
    competitor_id: str,
    user_id: str = Depends(get_current_user_id),
    competitor_service: CompetitorService = Depends(get_competitor_service),
):
    return competitor_service.get_competitor(competitor_id)


@router.post("/", response_model=Competitor, status_code=201)
async def create_competitor(
    business_id: str,
    competitor_data: CompetitorCreate,
    user_id: str = Depends(get_current_user_id),
    competitor_service: CompetitorService = Depends(get_competitor_service),
):
    return competitor_service.create_competitor(business_id, competitor_data)


@router.patch("/{competitor_id}", response_model=Competitor)
async def update_competitor(
    business_id: str,
    competitor_id: str,
    updates: CompetitorUpdate,
    user_id: str = Depends(get_current_user_id),
    competitor_service: CompetitorService = Depends(get_competitor_service),
):
    return competitor_service.update_competitor(competitor_id, updates)


@router.delete("/{competitor_id}", status_code=204)
async def delete_competitor(
    business_id: str,
    competitor_id: str,
    user_id: str = Depends(get_current_user_id),
    competitor_service: CompetitorService = Depends(get_competitor_service),
):
    competitor_service.delete_competitor(competitor_id)


@router.get("/{competitor_id}/posts", response_model=list[CompetitorPost])
async def list_competitor_posts(
    business_id: str,
    competitor_id: str,
    limit: int = Query(default=50, le=100),
    offset: int = Query(default=0, ge=0),
    user_id: str = Depends(get_current_user_id),
    competitor_service: CompetitorService = Depends(get_competitor_service),
):
    return competitor_service.list_competitor_posts(business_id, competitor_id, limit, offset)


@router.get("/posts/all", response_model=list[CompetitorPost])
async def list_all_competitor_posts(
    business_id: str,
    limit: int = Query(default=50, le=100),
    offset: int = Query(default=0, ge=0),
    user_id: str = Depends(get_current_user_id),
    competitor_service: CompetitorService = Depends(get_competitor_service),
):
    return competitor_service.list_competitor_posts(business_id, limit=limit, offset=offset)


@router.get("/discovery/{run_id}/candidates", response_model=list[CompetitorDiscoveryCandidate])
async def list_discovery_candidates(
    business_id: str,
    run_id: str,
    user_id: str = Depends(get_current_user_id),
    competitor_service: CompetitorService = Depends(get_competitor_service),
):
    return competitor_service.list_discovery_candidates(run_id)


@router.post("/discovery/candidates/{candidate_id}/accept", response_model=CompetitorDiscoveryCandidate)
async def accept_discovery_candidate(
    business_id: str,
    candidate_id: str,
    user_id: str = Depends(get_current_user_id),
    competitor_service: CompetitorService = Depends(get_competitor_service),
):
    return competitor_service.accept_discovery_candidate(candidate_id)
