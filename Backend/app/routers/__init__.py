from fastapi import APIRouter

from app.routers.health import router as health_router
from app.routers.authentication import router as authentication_router
from app.routers.users import router as users_router
from app.routers.businesses import router as businesses_router
from app.routers.competitors import router as competitors_router
from app.routers.content_ideas import router as content_ideas_router
from app.routers.calendar import router as calendar_router
from app.routers.trend_summaries import router as trend_summaries_router
from app.routers.media import router as media_router
from app.routers.payments import router as payments_router
from app.routers.webhooks import router as webhooks_router

api_router = APIRouter()

api_router.include_router(health_router)
api_router.include_router(authentication_router)
api_router.include_router(users_router)
api_router.include_router(businesses_router)
api_router.include_router(competitors_router)
api_router.include_router(content_ideas_router)
api_router.include_router(calendar_router)
api_router.include_router(trend_summaries_router)
api_router.include_router(media_router)
api_router.include_router(payments_router)
api_router.include_router(webhooks_router)
