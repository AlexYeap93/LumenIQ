import stripe

from app.core.configuration import settings
from app.core.exceptions import ExternalServiceError, NotFoundError
from app.services.user_service import get_user_service
from app.services.payment_service import get_payment_service
from app.models.payment import PaymentCreate

stripe.api_key = settings.stripe_secret_key


class StripeService:

    def __init__(self):
        self.user_service = get_user_service()
        self.payment_service = get_payment_service()

    def create_checkout_session(self, user_id: str, price_id: str, success_url: str, cancel_url: str) -> dict:
        try:
            profile = self.user_service.get_profile(user_id)
            customer_id = profile.stripe_customer_id

            if not customer_id:
                customer = stripe.Customer.create(metadata={"user_id": user_id})
                customer_id = customer.id
                from app.models.user import UserProfileUpdate
                self.user_service.update_profile(
                    user_id,
                    UserProfileUpdate(stripe_customer_id=customer_id),  # type: ignore[call-arg]
                )

            session = stripe.checkout.Session.create(
                customer=customer_id,
                payment_method_types=["card"],
                line_items=[{"price": price_id, "quantity": 1}],
                mode="subscription",
                success_url=success_url,
                cancel_url=cancel_url,
                metadata={"user_id": user_id},
            )

            return {
                "checkout_session_id": session.id,
                "checkout_url": session.url,
            }
        except NotFoundError:
            raise
        except Exception as error:
            raise ExternalServiceError("Stripe", str(error)) from error

    def create_customer_portal_session(self, user_id: str, return_url: str) -> dict:
        try:
            profile = self.user_service.get_profile(user_id)

            if not profile.stripe_customer_id:
                raise NotFoundError("Stripe customer", user_id)

            session = stripe.billing_portal.Session.create(
                customer=profile.stripe_customer_id,
                return_url=return_url,
            )

            return {"portal_url": session.url}
        except NotFoundError:
            raise
        except Exception as error:
            raise ExternalServiceError("Stripe", str(error)) from error

    def handle_webhook_event(self, payload: bytes, signature: str) -> dict:
        try:
            event = stripe.Webhook.construct_event(
                payload, signature, settings.stripe_webhook_secret
            )
        except stripe.error.SignatureVerificationError as error:
            raise ExternalServiceError("Stripe Webhook", "Invalid signature") from error

        event_type = event["type"]
        event_data = event["data"]["object"]

        if event_type == "checkout.session.completed":
            self._handle_checkout_completed(event_data)
        elif event_type == "invoice.payment_succeeded":
            self._handle_invoice_paid(event_data)
        elif event_type == "customer.subscription.updated":
            self._handle_subscription_updated(event_data)
        elif event_type == "customer.subscription.deleted":
            self._handle_subscription_deleted(event_data)

        return {"event_type": event_type, "processed": True}

    def _handle_checkout_completed(self, session_data: dict) -> None:
        user_id = session_data.get("metadata", {}).get("user_id")
        if not user_id:
            return

        subscription_id = session_data.get("subscription")
        payment_intent_id = session_data.get("payment_intent", subscription_id or "unknown")

        self.payment_service.record_payment(
            user_id=user_id,
            payment_data=PaymentCreate(
                stripe_payment_intent_id=payment_intent_id,
                stripe_subscription_id=subscription_id,
                amount=session_data.get("amount_total", 0),
                currency=session_data.get("currency", "cad"),
                status="completed",
                metadata={"session_id": session_data.get("id")},
            ),
        )

    def _handle_invoice_paid(self, invoice_data: dict) -> None:
        customer_id = invoice_data.get("customer")
        if not customer_id:
            return

        subscription_id = invoice_data.get("subscription")
        payment_intent_id = invoice_data.get("payment_intent", "unknown")

        from app.models.user import UserProfileUpdate
        try:
            admin_client = self.user_service.admin_client
            response = (
                admin_client.table("profiles")
                .select("user_id")
                .eq("stripe_customer_id", customer_id)
                .single()
                .execute()
            )
            user_id = response.data["user_id"]

            self.payment_service.record_payment(
                user_id=user_id,
                payment_data=PaymentCreate(
                    stripe_payment_intent_id=payment_intent_id,
                    stripe_subscription_id=subscription_id,
                    amount=invoice_data.get("amount_paid", 0),
                    currency=invoice_data.get("currency", "cad"),
                    status="paid",
                    metadata={"invoice_id": invoice_data.get("id")},
                ),
            )
        except Exception:
            pass

    def _handle_subscription_updated(self, subscription_data: dict) -> None:
        customer_id = subscription_data.get("customer")
        if not customer_id:
            return

        plan_name = self._extract_plan_name(subscription_data)

        try:
            admin_client = self.user_service.admin_client
            response = (
                admin_client.table("profiles")
                .select("user_id")
                .eq("stripe_customer_id", customer_id)
                .single()
                .execute()
            )
            user_id = response.data["user_id"]

            from app.models.user import UserProfileUpdate
            admin_client.table("profiles").update({"plan": plan_name}).eq("user_id", user_id).execute()
        except Exception:
            pass

    def _handle_subscription_deleted(self, subscription_data: dict) -> None:
        customer_id = subscription_data.get("customer")
        if not customer_id:
            return

        try:
            admin_client = self.user_service.admin_client
            response = (
                admin_client.table("profiles")
                .select("user_id")
                .eq("stripe_customer_id", customer_id)
                .single()
                .execute()
            )
            user_id = response.data["user_id"]

            admin_client.table("profiles").update({"plan": "free"}).eq("user_id", user_id).execute()
        except Exception:
            pass

    def _extract_plan_name(self, subscription_data: dict) -> str:
        items = subscription_data.get("items", {}).get("data", [])
        if items:
            price = items[0].get("price", {})
            return price.get("lookup_key", price.get("nickname", "pro"))
        return "pro"


def get_stripe_service() -> StripeService:
    return StripeService()
