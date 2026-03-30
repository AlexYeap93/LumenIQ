from supabase import Client

from app.database.supabase_admin import get_supabase_admin_client
from app.models.competitor import (
    Competitor,
    CompetitorCreate,
    CompetitorUpdate,
    CompetitorPost,
    CompetitorDiscoveryCandidate,
)
from app.core.exceptions import NotFoundError, ExternalServiceError


class CompetitorService:

    def __init__(self):
        self.admin_client: Client = get_supabase_admin_client()
        self.competitors_table = "competitors"
        self.posts_table = "competitor_posts"
        self.candidates_table = "competitor_discovery_candidates"

    def list_competitors(self, business_id: str) -> list[Competitor]:
        try:
            response = (
                self.admin_client.table(self.competitors_table)
                .select("*")
                .eq("business_id", business_id)
                .order("created_at", desc=True)
                .execute()
            )
            return [Competitor(**row) for row in response.data]
        except Exception as error:
            raise ExternalServiceError("Supabase", str(error)) from error

    def get_competitor(self, competitor_id: str) -> Competitor:
        try:
            response = (
                self.admin_client.table(self.competitors_table)
                .select("*")
                .eq("id", competitor_id)
                .single()
                .execute()
            )
            return Competitor(**response.data)
        except Exception as error:
            if "No rows found" in str(error) or "0 rows" in str(error):
                raise NotFoundError("Competitor", competitor_id) from error
            raise ExternalServiceError("Supabase", str(error)) from error

    def create_competitor(self, business_id: str, competitor_data: CompetitorCreate) -> Competitor:
        try:
            insert_data = {"business_id": business_id, **competitor_data.model_dump(exclude_none=True)}
            response = (
                self.admin_client.table(self.competitors_table)
                .insert(insert_data)
                .execute()
            )
            return Competitor(**response.data[0])
        except Exception as error:
            raise ExternalServiceError("Supabase", str(error)) from error

    def update_competitor(self, competitor_id: str, updates: CompetitorUpdate) -> Competitor:
        try:
            update_data = updates.model_dump(exclude_none=True)
            response = (
                self.admin_client.table(self.competitors_table)
                .update(update_data)
                .eq("id", competitor_id)
                .execute()
            )
            if not response.data:
                raise NotFoundError("Competitor", competitor_id)
            return Competitor(**response.data[0])
        except NotFoundError:
            raise
        except Exception as error:
            raise ExternalServiceError("Supabase", str(error)) from error

    def delete_competitor(self, competitor_id: str) -> None:
        try:
            self.admin_client.table(self.competitors_table).delete().eq("id", competitor_id).execute()
        except Exception as error:
            raise ExternalServiceError("Supabase", str(error)) from error

    def list_competitor_posts(
        self, business_id: str, competitor_id: str | None = None, limit: int = 50, offset: int = 0
    ) -> list[CompetitorPost]:
        try:
            query = (
                self.admin_client.table(self.posts_table)
                .select("*")
                .eq("business_id", business_id)
            )
            if competitor_id:
                query = query.eq("competitor_id", competitor_id)

            response = (
                query.order("posted_at", desc=True)
                .range(offset, offset + limit - 1)
                .execute()
            )
            return [CompetitorPost(**row) for row in response.data]
        except Exception as error:
            raise ExternalServiceError("Supabase", str(error)) from error

    def get_competitor_post(self, post_id: str) -> CompetitorPost:
        try:
            response = (
                self.admin_client.table(self.posts_table)
                .select("*")
                .eq("id", post_id)
                .single()
                .execute()
            )
            return CompetitorPost(**response.data)
        except Exception as error:
            if "No rows found" in str(error) or "0 rows" in str(error):
                raise NotFoundError("Competitor post", post_id) from error
            raise ExternalServiceError("Supabase", str(error)) from error

    def list_discovery_candidates(self, run_id: str) -> list[CompetitorDiscoveryCandidate]:
        try:
            response = (
                self.admin_client.table(self.candidates_table)
                .select("*")
                .eq("run_id", run_id)
                .order("created_at", desc=True)
                .execute()
            )
            return [CompetitorDiscoveryCandidate(**row) for row in response.data]
        except Exception as error:
            raise ExternalServiceError("Supabase", str(error)) from error

    def accept_discovery_candidate(self, candidate_id: str) -> CompetitorDiscoveryCandidate:
        try:
            response = (
                self.admin_client.table(self.candidates_table)
                .update({"accepted": True})
                .eq("id", candidate_id)
                .execute()
            )
            if not response.data:
                raise NotFoundError("Discovery candidate", candidate_id)
            return CompetitorDiscoveryCandidate(**response.data[0])
        except NotFoundError:
            raise
        except Exception as error:
            raise ExternalServiceError("Supabase", str(error)) from error


def get_competitor_service() -> CompetitorService:
    return CompetitorService()
