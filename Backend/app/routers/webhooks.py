from fastapi import APIRouter, Request, Header

from app.services.stripe_service import StripeService, get_stripe_service

router = APIRouter(prefix="/webhooks", tags=["Webhooks"])


@router.post("/stripe")
async def stripe_webhook(
    request: Request,
    stripe_signature: str = Header(alias="stripe-signature"),
):
    """Receives and processes Stripe webhook events.
    This endpoint does NOT require authentication — Stripe signature verification
    is used instead to validate the request origin.
    """
    payload = await request.body()
    stripe_service: StripeService = get_stripe_service()
    result = stripe_service.handle_webhook_event(payload, stripe_signature)
    return result
