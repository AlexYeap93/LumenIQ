from supabase import Client

from app.database.supabase_admin import get_supabase_admin_client
from app.models.user import UserProfile, UserProfileUpdate
from app.core.exceptions import NotFoundError, ExternalServiceError


class UserService:

    def __init__(self):
        self.admin_client: Client = get_supabase_admin_client()
        self.table_name = "profiles"

    def get_profile(self, user_id: str) -> UserProfile:
        try:
            response = (
                self.admin_client.table(self.table_name)
                .select("*")
                .eq("user_id", user_id)
                .single()
                .execute()
            )
            return UserProfile(**response.data)
        except Exception as error:
            if "No rows found" in str(error) or "0 rows" in str(error):
                raise NotFoundError("User profile", user_id) from error
            raise ExternalServiceError("Supabase", str(error)) from error

    def create_profile(self, user_id: str, profile_data: dict) -> UserProfile:
        try:
            insert_data = {"user_id": user_id, **profile_data}
            response = (
                self.admin_client.table(self.table_name)
                .insert(insert_data)
                .execute()
            )
            return UserProfile(**response.data[0])
        except Exception as error:
            raise ExternalServiceError("Supabase", str(error)) from error

    def update_profile(self, user_id: str, updates: UserProfileUpdate) -> UserProfile:
        try:
            update_data = updates.model_dump(exclude_none=True)
            if "notification_preferences" in update_data:
                update_data["notification_preferences"] = updates.notification_preferences.model_dump()

            response = (
                self.admin_client.table(self.table_name)
                .update(update_data)
                .eq("user_id", user_id)
                .execute()
            )

            if not response.data:
                raise NotFoundError("User profile", user_id)

            return UserProfile(**response.data[0])
        except NotFoundError:
            raise
        except Exception as error:
            raise ExternalServiceError("Supabase", str(error)) from error

    def delete_profile(self, user_id: str) -> None:
        try:
            self.admin_client.table(self.table_name).delete().eq("user_id", user_id).execute()
        except Exception as error:
            raise ExternalServiceError("Supabase", str(error)) from error


def get_user_service() -> UserService:
    return UserService()
