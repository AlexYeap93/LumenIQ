from datetime import datetime
from typing import Any
from pydantic import BaseModel

from app.models.enumerations import IdeaStatus


class ContentIdeaBase(BaseModel):
    title: str
    concept: str | None = None
    caption: str | None = None
    hashtags: list[str] = []


class ContentIdeaCreate(ContentIdeaBase):
    trend_summary_id: str | None = None
    shot_list: list[Any] = []
    assets: dict[str, Any] = {}


class ContentIdeaUpdate(BaseModel):
    title: str | None = None
    concept: str | None = None
    caption: str | None = None
    hashtags: list[str] | None = None
    status: IdeaStatus | None = None
    shot_list: list[Any] | None = None
    assets: dict[str, Any] | None = None


class ContentIdea(ContentIdeaBase):
    id: str
    business_id: str
    trend_summary_id: str | None = None
    shot_list: list[Any] = []
    assets: dict[str, Any] = {}
    status: IdeaStatus = IdeaStatus.PENDING
    score: float | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None


class TrendSummary(BaseModel):
    id: str
    business_id: str
    stage_run_id: str | None = None
    summary: dict[str, Any]
    created_at: datetime | None = None
    updated_at: datetime | None = None


class IdeaFeedbackCreate(BaseModel):
    rating: int
    feedback: str | None = None


class IdeaFeedback(BaseModel):
    id: str
    content_idea_id: str
    user_id: str | None = None
    rating: int
    feedback: str | None = None
    created_at: datetime | None = None
