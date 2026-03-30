from datetime import datetime
from pydantic import BaseModel


class BusinessMediaBase(BaseModel):
    file_name: str | None = None
    file_type: str | None = None
    tags: list[str] = []


class BusinessMediaCreate(BusinessMediaBase):
    file_url: str


class BusinessMedia(BusinessMediaBase):
    id: str
    business_id: str
    file_url: str
    file_size: int | None = None
    created_at: datetime | None = None
