from datetime import date

from fastapi import APIRouter, Depends, Query

from app.models.calendar import (
    ContentCalendarWeeklyView,
    CalendarPost,
    CalendarPostCreate,
    CalendarPostUpdate,
    PublishAttempt,
)
from app.services.calendar_service import CalendarService, get_calendar_service
from app.dependencies.authentication import get_current_user_id

router = APIRouter(prefix="/businesses/{business_id}/calendar", tags=["Calendar"])


@router.get("/weeks", response_model=list[ContentCalendarWeeklyView])
async def list_weekly_calendars(
    business_id: str,
    week_start: date | None = Query(default=None),
    user_id: str = Depends(get_current_user_id),
    calendar_service: CalendarService = Depends(get_calendar_service),
):
    return calendar_service.list_weekly_calendars(business_id, week_start)


@router.get("/weeks/{calendar_id}", response_model=ContentCalendarWeeklyView)
async def get_weekly_calendar(
    business_id: str,
    calendar_id: str,
    user_id: str = Depends(get_current_user_id),
    calendar_service: CalendarService = Depends(get_calendar_service),
):
    return calendar_service.get_weekly_calendar(calendar_id)


@router.get("/posts", response_model=list[CalendarPost])
async def list_calendar_posts(
    business_id: str,
    calendar_id: str | None = Query(default=None),
    status: str | None = Query(default=None),
    user_id: str = Depends(get_current_user_id),
    calendar_service: CalendarService = Depends(get_calendar_service),
):
    return calendar_service.list_calendar_posts(business_id, calendar_id, status)


@router.get("/posts/{post_id}", response_model=CalendarPost)
async def get_calendar_post(
    business_id: str,
    post_id: str,
    user_id: str = Depends(get_current_user_id),
    calendar_service: CalendarService = Depends(get_calendar_service),
):
    return calendar_service.get_calendar_post(post_id)


@router.post("/posts", response_model=CalendarPost, status_code=201)
async def create_calendar_post(
    business_id: str,
    post_data: CalendarPostCreate,
    user_id: str = Depends(get_current_user_id),
    calendar_service: CalendarService = Depends(get_calendar_service),
):
    return calendar_service.create_calendar_post(business_id, post_data)


@router.patch("/posts/{post_id}", response_model=CalendarPost)
async def update_calendar_post(
    business_id: str,
    post_id: str,
    updates: CalendarPostUpdate,
    user_id: str = Depends(get_current_user_id),
    calendar_service: CalendarService = Depends(get_calendar_service),
):
    return calendar_service.update_calendar_post(post_id, updates)


@router.delete("/posts/{post_id}", status_code=204)
async def delete_calendar_post(
    business_id: str,
    post_id: str,
    user_id: str = Depends(get_current_user_id),
    calendar_service: CalendarService = Depends(get_calendar_service),
):
    calendar_service.delete_calendar_post(post_id)


@router.get("/posts/{post_id}/publish-attempts", response_model=list[PublishAttempt])
async def list_publish_attempts(
    business_id: str,
    post_id: str,
    user_id: str = Depends(get_current_user_id),
    calendar_service: CalendarService = Depends(get_calendar_service),
):
    return calendar_service.list_publish_attempts(post_id)
