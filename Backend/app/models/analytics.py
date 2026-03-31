from pydantic import BaseModel


class KpiItem(BaseModel):
    key: str
    label: str
    value: str
    change: float
    change_label: str


class AudienceDataPoint(BaseModel):
    date: str
    followers: int
    impressions: int


class EngagementDataPoint(BaseModel):
    day: str
    likes: int
    comments: int
    shares: int
    saves: int


class PlatformItem(BaseModel):
    name: str
    value: int
    color: str
    followers: str
    growth: str


class TopPost(BaseModel):
    id: str
    title: str
    platform: str
    impressions: str
    engagement: str
    likes: int
    comments: int
    image: str


class ActivityItem(BaseModel):
    id: str
    text: str
    time: str
    type: str
