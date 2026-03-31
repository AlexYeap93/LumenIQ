from fastapi import APIRouter

from app.routers.health import router as health_router
from app.routers.authentication import router as authentication_router
from app.routers.users import router as users_router
from app.routers.businesses import router as businesses_router
from app.routers.calendar import router as calendar_router
from app.routers.media import router as media_router
from app.routers.payments import router as payments_router
from app.routers.webhooks import router as webhooks_router
from app.routers.analytics import router as analytics_router
from app.routers.plans import router as plans_router
from app.routers.onboarding import router as onboarding_router

api_router = APIRouter()

api_router.include_router(health_router)
api_router.include_router(authentication_router)
api_router.include_router(users_router)
api_router.include_router(businesses_router)       
api_router.include_router(calendar_router)
api_router.include_router(media_router)
api_router.include_router(payments_router)
api_router.include_router(webhooks_router)
api_router.include_router(analytics_router)
api_router.include_router(plans_router)
api_router.include_router(onboarding_router)
