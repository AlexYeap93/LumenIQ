from fastapi import APIRouter, Depends, Query

from app.models.content import (
    ContentIdea,
    ContentIdeaCreate,
    ContentIdeaUpdate,
    IdeaFeedback,
    IdeaFeedbackCreate,
)
from app.services.content_service import ContentService, get_content_service
from app.dependencies.authentication import get_current_user_id

router = APIRouter(prefix="/businesses/{business_id}/content-ideas", tags=["Content Ideas"])


@router.get("/", response_model=list[ContentIdea])
async def list_content_ideas(
    business_id: str,
    status: str | None = Query(default=None),
    limit: int = Query(default=50, le=100),
    offset: int = Query(default=0, ge=0),
    user_id: str = Depends(get_current_user_id),
    content_service: ContentService = Depends(get_content_service),
):
    return content_service.list_content_ideas(business_id, status, limit, offset)


@router.get("/{idea_id}", response_model=ContentIdea)
async def get_content_idea(
    business_id: str,
    idea_id: str,
    user_id: str = Depends(get_current_user_id),
    content_service: ContentService = Depends(get_content_service),
):
    return content_service.get_content_idea(idea_id)


@router.post("/", response_model=ContentIdea, status_code=201)
async def create_content_idea(
    business_id: str,
    idea_data: ContentIdeaCreate,
    user_id: str = Depends(get_current_user_id),
    content_service: ContentService = Depends(get_content_service),
):
    return content_service.create_content_idea(business_id, idea_data)


@router.patch("/{idea_id}", response_model=ContentIdea)
async def update_content_idea(
    business_id: str,
    idea_id: str,
    updates: ContentIdeaUpdate,
    user_id: str = Depends(get_current_user_id),
    content_service: ContentService = Depends(get_content_service),
):
    return content_service.update_content_idea(idea_id, updates)


@router.delete("/{idea_id}", status_code=204)
async def delete_content_idea(
    business_id: str,
    idea_id: str,
    user_id: str = Depends(get_current_user_id),
    content_service: ContentService = Depends(get_content_service),
):
    content_service.delete_content_idea(idea_id)


@router.post("/{idea_id}/feedback", response_model=IdeaFeedback, status_code=201)
async def submit_idea_feedback(
    business_id: str,
    idea_id: str,
    feedback_data: IdeaFeedbackCreate,
    user_id: str = Depends(get_current_user_id),
    content_service: ContentService = Depends(get_content_service),
):
    return content_service.submit_feedback(idea_id, user_id, feedback_data)


@router.get("/{idea_id}/feedback", response_model=list[IdeaFeedback])
async def list_idea_feedback(
    business_id: str,
    idea_id: str,
    user_id: str = Depends(get_current_user_id),
    content_service: ContentService = Depends(get_content_service),
):
    return content_service.list_feedback_for_idea(idea_id)
