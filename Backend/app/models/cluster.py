from datetime import datetime
from typing import Any
from pydantic import BaseModel

from app.models.enumerations import ClusterType


class Cluster(BaseModel):
    id: str
    business_id: str
    type: ClusterType
    k: int
    cluster_index: int
    label: str | None = None
    rationale: str | None = None
    samples: list[Any] = []
    average_engagement: float | None = None
    post_count: int | None = None
    trend_score: float | None = None
    metrics: dict[str, Any] = {}
    created_at: datetime | None = None
    updated_at: datetime | None = None


class PostClusterAssignment(BaseModel):
    id: str
    post_id: str
    image_cluster_id: str | None = None
    caption_cluster_id: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None
