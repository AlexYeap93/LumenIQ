from enum import Enum


class OrganizationRole(str, Enum):
    ADMIN = "admin"
    MEMBER = "member"


class RunStatus(str, Enum):
    QUEUED = "queued"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"


class PipelineStage(str, Enum):
    BUSINESS_PROFILING = "business_profiling"
    COMPETITOR_DISCOVERY = "competitor_discovery"
    POST_SCRAPING = "post_scraping"
    TREND_ANALYSIS = "trend_analysis"
    CONTENT_GENERATION = "content_generation"
    SCHEDULING = "scheduling"


class ClusterType(str, Enum):
    IMAGE = "image"
    CAPTION = "caption"


class IdeaStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    USED = "used"


class ScheduledPostStatus(str, Enum):
    DRAFT = "draft"
    SCHEDULED = "scheduled"
    PUBLISHED = "published"
    FAILED = "failed"
