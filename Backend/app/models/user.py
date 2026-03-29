from datetime import datetime
from pydantic import BaseModel, Field


class NotificationPreferences(BaseModel):
    email_notifications: bool = True
    push_notifications: bool = True
    marketing_emails: bool = False


class UserProfile(BaseModel):
    user_id: str
    display_name: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    phone: str | None = None
    avatar_url: str | None = None
    plan: str = "free"
    stripe_customer_id: str | None = None
    notification_preferences: NotificationPreferences = Field(
        default_factory=NotificationPreferences
    )
    created_at: datetime | None = None
    updated_at: datetime | None = None


class UserProfileUpdate(BaseModel):
    display_name: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    phone: str | None = None
    avatar_url: str | None = None
    stripe_customer_id: str | None = None
    notification_preferences: NotificationPreferences | None = None


class SignUpRequest(BaseModel):
    email: str
    password: str
    first_name: str | None = None
    last_name: str | None = None


class SignInRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class PasswordResetRequest(BaseModel):
    email: str


class PasswordUpdateRequest(BaseModel):
    new_password: str
