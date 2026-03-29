from supabase import Client

from app.database.supabase_admin import get_supabase_admin_client
from app.models.payment import Payment, PaymentCreate
from app.core.exceptions import NotFoundError, ExternalServiceError


class PaymentService:

    def __init__(self):
        self.admin_client: Client = get_supabase_admin_client()
        self.table_name = "payments"

    def list_payments_for_user(self, user_id: str, limit: int = 20) -> list[Payment]:
        try:
            response = (
                self.admin_client.table(self.table_name)
                .select("*")
                .eq("user_id", user_id)
                .order("created_at", desc=True)
                .limit(limit)
                .execute()
            )
            return [Payment(**row) for row in response.data]
        except Exception as error:
            raise ExternalServiceError("Supabase", str(error)) from error

    def get_payment(self, payment_id: str) -> Payment:
        try:
            response = (
                self.admin_client.table(self.table_name)
                .select("*")
                .eq("id", payment_id)
                .single()
                .execute()
            )
            return Payment(**response.data)
        except Exception as error:
            if "No rows found" in str(error) or "0 rows" in str(error):
                raise NotFoundError("Payment", payment_id) from error
            raise ExternalServiceError("Supabase", str(error)) from error

    def record_payment(self, user_id: str, payment_data: PaymentCreate) -> Payment:
        try:
            insert_data = {"user_id": user_id, **payment_data.model_dump(exclude_none=True)}
            response = (
                self.admin_client.table(self.table_name)
                .insert(insert_data)
                .execute()
            )
            return Payment(**response.data[0])
        except Exception as error:
            raise ExternalServiceError("Supabase", str(error)) from error


def get_payment_service() -> PaymentService:
    return PaymentService()
