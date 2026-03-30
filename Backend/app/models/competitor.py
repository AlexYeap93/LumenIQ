from datetime import datetime
from typing import Any
from pydantic import BaseModel


class CompetitorBase(BaseModel):
    username: str
    profile_url: str | None = None


class CompetitorCreate(CompetitorBase):
    pass


class CompetitorUpdate(BaseModel):
    username: str | None = None
    profile_url: str | None = None
    is_active: bool | None = None


class Competitor(CompetitorBase):
    id: str
    business_id: str
    follower_count: int | None = None
    post_count: int | None = None
    is_active: bool = True
    quality_flags: dict[str, Any] = {}
    discovered_from_run_id: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None


class CompetitorPost(BaseModel):
    id: str
    business_id: str
    competitor_id: str
    platform: str = "instagram"
    external_post_id: str | None = None
    permalink: str | None = None
    caption: str | None = None
    posted_at: datetime | None = None
    media_type: str | None = None
    media: list[Any] = []
    hashtags: list[str] = []
    likes: int = 0
    comments: int = 0
    engagement_rate: float | None = None
    weighted_interactions: float | None = None
    is_selected: bool = False
    selection_meta: dict[str, Any] = {}
    created_at: datetime | None = None
    updated_at: datetime | None = None


class CompetitorDiscoveryCandidate(BaseModel):
    id: str
    run_id: str
    candidate_username: str
    source: dict[str, Any] = {}
    classifier: dict[str, Any] = {}
    accepted: bool = False
    created_at: datetime | None = None
    updated_at: datetime | None = None
