from supabase import Client

from app.database.supabase_admin import get_supabase_admin_client
from app.models.content import (
    ContentIdea,
    ContentIdeaCreate,
    ContentIdeaUpdate,
    IdeaFeedback,
    IdeaFeedbackCreate,
)
from app.core.exceptions import NotFoundError, ExternalServiceError


class ContentService:

    def __init__(self):
        self.admin_client: Client = get_supabase_admin_client()
        self.ideas_table = "content_ideas"
        self.feedback_table = "idea_feedback"

    def list_content_ideas(
        self, business_id: str, status: str | None = None, limit: int = 50, offset: int = 0
    ) -> list[ContentIdea]:
        try:
            query = (
                self.admin_client.table(self.ideas_table)
                .select("*")
                .eq("business_id", business_id)
            )
            if status:
                query = query.eq("status", status)

            response = (
                query.order("created_at", desc=True)
                .range(offset, offset + limit - 1)
                .execute()
            )
            return [ContentIdea(**row) for row in response.data]
        except Exception as error:
            raise ExternalServiceError("Supabase", str(error)) from error

    def get_content_idea(self, idea_id: str) -> ContentIdea:
        try:
            response = (
                self.admin_client.table(self.ideas_table)
                .select("*")
                .eq("id", idea_id)
                .single()
                .execute()
            )
            return ContentIdea(**response.data)
        except Exception as error:
            if "No rows found" in str(error) or "0 rows" in str(error):
                raise NotFoundError("Content idea", idea_id) from error
            raise ExternalServiceError("Supabase", str(error)) from error

    def create_content_idea(self, business_id: str, idea_data: ContentIdeaCreate) -> ContentIdea:
        try:
            insert_data = {"business_id": business_id, **idea_data.model_dump(exclude_none=True)}
            response = (
                self.admin_client.table(self.ideas_table)
                .insert(insert_data)
                .execute()
            )
            return ContentIdea(**response.data[0])
        except Exception as error:
            raise ExternalServiceError("Supabase", str(error)) from error

    def update_content_idea(self, idea_id: str, updates: ContentIdeaUpdate) -> ContentIdea:
        try:
            update_data = updates.model_dump(exclude_none=True)
            response = (
                self.admin_client.table(self.ideas_table)
                .update(update_data)
                .eq("id", idea_id)
                .execute()
            )
            if not response.data:
                raise NotFoundError("Content idea", idea_id)
            return ContentIdea(**response.data[0])
        except NotFoundError:
            raise
        except Exception as error:
            raise ExternalServiceError("Supabase", str(error)) from error

    def delete_content_idea(self, idea_id: str) -> None:
        try:
            self.admin_client.table(self.ideas_table).delete().eq("id", idea_id).execute()
        except Exception as error:
            raise ExternalServiceError("Supabase", str(error)) from error

    def submit_feedback(self, idea_id: str, user_id: str, feedback_data: IdeaFeedbackCreate) -> IdeaFeedback:
        try:
            insert_data = {
                "content_idea_id": idea_id,
                "user_id": user_id,
                **feedback_data.model_dump(),
            }
            response = (
                self.admin_client.table(self.feedback_table)
                .insert(insert_data)
                .execute()
            )
            return IdeaFeedback(**response.data[0])
        except Exception as error:
            raise ExternalServiceError("Supabase", str(error)) from error

    def list_feedback_for_idea(self, idea_id: str) -> list[IdeaFeedback]:
        try:
            response = (
                self.admin_client.table(self.feedback_table)
                .select("*")
                .eq("content_idea_id", idea_id)
                .order("created_at", desc=True)
                .execute()
            )
            return [IdeaFeedback(**row) for row in response.data]
        except Exception as error:
            raise ExternalServiceError("Supabase", str(error)) from error


def get_content_service() -> ContentService:
    return ContentService()
