from supabase import Client

from app.database.supabase_admin import get_supabase_admin_client
from app.models.business import Business, BusinessCreate, BusinessUpdate, BusinessSummary
from app.core.exceptions import NotFoundError, ForbiddenError, ExternalServiceError


class BusinessService:

    def __init__(self):
        self.admin_client: Client = get_supabase_admin_client()
        self.table_name = "businesses"

    def list_businesses_for_user(self, user_id: str) -> list[BusinessSummary]:
        try:
            response = (
                self.admin_client.table(self.table_name)
                .select("id, name, business_type, city, country, instagram_handle")
                .eq("user_id", user_id)
                .order("created_at", desc=True)
                .execute()
            )
            return [BusinessSummary(**row) for row in response.data]
        except Exception as error:
            raise ExternalServiceError("Supabase", str(error)) from error

    def get_business(self, business_id: str, user_id: str) -> Business:
        try:
            response = (
                self.admin_client.table(self.table_name)
                .select("*")
                .eq("id", business_id)
                .single()
                .execute()
            )
            business = Business(**response.data)
            if business.user_id != user_id:
                raise ForbiddenError("You do not own this business")
            return business
        except ForbiddenError:
            raise
        except Exception as error:
            if "No rows found" in str(error) or "0 rows" in str(error):
                raise NotFoundError("Business", business_id) from error
            raise ExternalServiceError("Supabase", str(error)) from error

    def create_business(self, user_id: str, business_data: BusinessCreate) -> Business:
        try:
            insert_data = {"user_id": user_id, **business_data.model_dump(exclude_none=True)}
            response = (
                self.admin_client.table(self.table_name)
                .insert(insert_data)
                .execute()
            )
            return Business(**response.data[0])
        except Exception as error:
            raise ExternalServiceError("Supabase", str(error)) from error

    def update_business(self, business_id: str, user_id: str, updates: BusinessUpdate) -> Business:
        self.get_business(business_id, user_id)
        try:
            update_data = updates.model_dump(exclude_none=True)
            response = (
                self.admin_client.table(self.table_name)
                .update(update_data)
                .eq("id", business_id)
                .execute()
            )
            return Business(**response.data[0])
        except Exception as error:
            raise ExternalServiceError("Supabase", str(error)) from error

    def delete_business(self, business_id: str, user_id: str) -> None:
        self.get_business(business_id, user_id)
        try:
            self.admin_client.table(self.table_name).delete().eq("id", business_id).execute()
        except Exception as error:
            raise ExternalServiceError("Supabase", str(error)) from error


def get_business_service() -> BusinessService:
    return BusinessService()
