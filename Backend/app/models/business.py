from datetime import datetime
from typing import Any
from pydantic import BaseModel


class BusinessBase(BaseModel):
    name: str | None = None
    business_type: str | None = None
    city: str | None = None
    country: str | None = None
    instagram_handle: str | None = None
    website_url: str | None = None
    ideal_customer: str | None = None


class BusinessCreate(BusinessBase):
    name: str


class BusinessUpdate(BusinessBase):
    profile_json: dict[str, Any] | None = None


class Business(BusinessBase):
    id: str
    user_id: str
    profile_json: dict[str, Any] = {}
    ig_user_id: str | None = None
    ig_business_account_id: str | None = None
    fb_page_id: str | None = None
    access_token: str | None = None
    token_expires_at: datetime | None = None
    refresh_token: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None


class BusinessSummary(BaseModel):
    id: str
    name: str | None = None
    business_type: str | None = None
    city: str | None = None
    country: str | None = None
    instagram_handle: str | None = None
