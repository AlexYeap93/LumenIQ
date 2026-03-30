from app.models.analytics import (
    KpiItem,
    AudienceDataPoint,
    EngagementDataPoint,
    PlatformItem,
    TopPost,
    ActivityItem,
)

_SEED_KPIS: list[dict] = [
    {"key": "followers", "label": "Total Followers", "value": "24,521", "change": 12.5, "change_label": "vs last period"},
    {"key": "impressions", "label": "Impressions", "value": "148.2K", "change": 8.3, "change_label": "vs last period"},
    {"key": "engagementRate", "label": "Engagement Rate", "value": "4.7%", "change": 0.8, "change_label": "vs last period"},
    {"key": "scheduledPosts", "label": "Scheduled Posts", "value": "12", "change": -2.1, "change_label": "vs last week"},
]

_SEED_AUDIENCE: dict[str, list[dict]] = {
    "7D": [
        {"date": "Mon", "followers": 24120, "impressions": 18400},
        {"date": "Tue", "followers": 24180, "impressions": 21200},
        {"date": "Wed", "followers": 24250, "impressions": 19800},
        {"date": "Thu", "followers": 24310, "impressions": 24600},
        {"date": "Fri", "followers": 24380, "impressions": 22100},
        {"date": "Sat", "followers": 24460, "impressions": 26800},
        {"date": "Sun", "followers": 24521, "impressions": 23400},
    ],
    "30D": [
        {"date": "Week 1", "followers": 22800, "impressions": 124000},
        {"date": "Week 2", "followers": 23200, "impressions": 138000},
        {"date": "Week 3", "followers": 23800, "impressions": 142000},
        {"date": "Week 4", "followers": 24521, "impressions": 148200},
    ],
    "90D": [
        {"date": "Jan", "followers": 19400, "impressions": 98000},
        {"date": "Feb", "followers": 21200, "impressions": 118000},
        {"date": "Mar", "followers": 24521, "impressions": 148200},
    ],
}

_SEED_ENGAGEMENT: list[dict] = [
    {"day": "Mon", "likes": 342, "comments": 89, "shares": 56, "saves": 124},
    {"day": "Tue", "likes": 456, "comments": 102, "shares": 78, "saves": 156},
    {"day": "Wed", "likes": 389, "comments": 94, "shares": 62, "saves": 138},
    {"day": "Thu", "likes": 521, "comments": 134, "shares": 91, "saves": 189},
    {"day": "Fri", "likes": 478, "comments": 118, "shares": 84, "saves": 167},
    {"day": "Sat", "likes": 612, "comments": 156, "shares": 108, "saves": 213},
    {"day": "Sun", "likes": 534, "comments": 128, "shares": 92, "saves": 178},
]

_SEED_PLATFORMS: list[dict] = [
    {"name": "Instagram", "value": 45, "color": "#E1306C", "followers": "11.2K", "growth": "+4.2%"},
    {"name": "Facebook", "value": 25, "color": "#1877F2", "followers": "6.1K", "growth": "+1.8%"},
    {"name": "X / Twitter", "value": 18, "color": "#1DA1F2", "followers": "4.4K", "growth": "+3.1%"},
    {"name": "LinkedIn", "value": 12, "color": "#0A66C2", "followers": "2.8K", "growth": "+6.5%"},
]

_SEED_TOP_POSTS: list[dict] = [
    {"id": "1", "title": "New Collection Drop", "platform": "Instagram", "impressions": "12.4K", "engagement": "8.2%", "likes": 1024, "comments": 89, "image": "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop"},
    {"id": "2", "title": "Customer Success Story", "platform": "LinkedIn", "impressions": "8.7K", "engagement": "6.4%", "likes": 556, "comments": 134, "image": "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop"},
    {"id": "3", "title": "Team Culture Video", "platform": "Facebook", "impressions": "6.2K", "engagement": "5.1%", "likes": 316, "comments": 67, "image": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop"},
]

_SEED_ACTIVITY: list[dict] = [
    {"id": "1", "text": "Instagram post \"New Collection\" reached 1K impressions", "time": "2 min ago", "type": "milestone"},
    {"id": "2", "text": "Weekly content plan auto-generated for Mar 10\u201316", "time": "1 hr ago", "type": "ai"},
    {"id": "3", "text": "\"Product Launch Teaser\" scheduled for today at 2:00 PM", "time": "3 hrs ago", "type": "scheduled"},
    {"id": "4", "text": "Engagement rate up 0.8% compared to last week", "time": "5 hrs ago", "type": "growth"},
    {"id": "5", "text": "3 new followers on LinkedIn from Industry Insights post", "time": "8 hrs ago", "type": "follower"},
]


class AnalyticsService:
    """Returns seed analytics data.

    When real data pipelines are connected (e.g. Instagram Graph API),
    swap the seed constants for actual database/API queries.
    """

    def get_kpis(self, business_id: str, time_range: str) -> list[KpiItem]:
        return [KpiItem(**item) for item in _SEED_KPIS]

    def get_audience(self, business_id: str, time_range: str) -> list[AudienceDataPoint]:
        points = _SEED_AUDIENCE.get(time_range, _SEED_AUDIENCE["7D"])
        return [AudienceDataPoint(**p) for p in points]

    def get_engagement(self, business_id: str, time_range: str) -> list[EngagementDataPoint]:
        return [EngagementDataPoint(**e) for e in _SEED_ENGAGEMENT]

    def get_platforms(self, business_id: str) -> list[PlatformItem]:
        return [PlatformItem(**p) for p in _SEED_PLATFORMS]

    def get_top_posts(self, business_id: str, time_range: str) -> list[TopPost]:
        return [TopPost(**p) for p in _SEED_TOP_POSTS]

    def get_activity(self, business_id: str, limit: int = 10) -> list[ActivityItem]:
        return [ActivityItem(**a) for a in _SEED_ACTIVITY[:limit]]


def get_analytics_service() -> AnalyticsService:
    return AnalyticsService()
