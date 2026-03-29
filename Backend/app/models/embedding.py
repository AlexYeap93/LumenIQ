from datetime import datetime
from pydantic import BaseModel


class PostCaptionEmbedding(BaseModel):
    id: str
    post_id: str
    embedding: list[float]
    model: str = "text-embedding-3-small"
    created_at: datetime | None = None
    updated_at: datetime | None = None


class PostImageEmbedding(BaseModel):
    id: str
    post_id: str
    embedding: list[float]
    model: str = "openai/clip-vit-large-patch14"
    created_at: datetime | None = None
    updated_at: datetime | None = None
