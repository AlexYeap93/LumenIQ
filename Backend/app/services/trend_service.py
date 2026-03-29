from supabase import Client

from app.database.supabase_admin import get_supabase_admin_client
from app.models.content import TrendSummary
from app.models.cluster import Cluster, PostClusterAssignment
from app.core.exceptions import NotFoundError, ExternalServiceError


class TrendService:

    def __init__(self):
        self.admin_client: Client = get_supabase_admin_client()
        self.summaries_table = "trend_summaries"
        self.clusters_table = "clusters"
        self.assignments_table = "post_cluster_assignments"

    def list_trend_summaries(self, business_id: str, limit: int = 20) -> list[TrendSummary]:
        try:
            response = (
                self.admin_client.table(self.summaries_table)
                .select("*")
                .eq("business_id", business_id)
                .order("created_at", desc=True)
                .limit(limit)
                .execute()
            )
            return [TrendSummary(**row) for row in response.data]
        except Exception as error:
            raise ExternalServiceError("Supabase", str(error)) from error

    def get_trend_summary(self, summary_id: str) -> TrendSummary:
        try:
            response = (
                self.admin_client.table(self.summaries_table)
                .select("*")
                .eq("id", summary_id)
                .single()
                .execute()
            )
            return TrendSummary(**response.data)
        except Exception as error:
            if "No rows found" in str(error) or "0 rows" in str(error):
                raise NotFoundError("Trend summary", summary_id) from error
            raise ExternalServiceError("Supabase", str(error)) from error

    def list_clusters(self, business_id: str, cluster_type: str | None = None) -> list[Cluster]:
        try:
            query = (
                self.admin_client.table(self.clusters_table)
                .select("*")
                .eq("business_id", business_id)
            )
            if cluster_type:
                query = query.eq("type", cluster_type)

            response = query.order("cluster_index", desc=False).execute()
            return [Cluster(**row) for row in response.data]
        except Exception as error:
            raise ExternalServiceError("Supabase", str(error)) from error

    def get_cluster(self, cluster_id: str) -> Cluster:
        try:
            response = (
                self.admin_client.table(self.clusters_table)
                .select("*")
                .eq("id", cluster_id)
                .single()
                .execute()
            )
            return Cluster(**response.data)
        except Exception as error:
            if "No rows found" in str(error) or "0 rows" in str(error):
                raise NotFoundError("Cluster", cluster_id) from error
            raise ExternalServiceError("Supabase", str(error)) from error

    def list_post_cluster_assignments(self, post_id: str) -> list[PostClusterAssignment]:
        try:
            response = (
                self.admin_client.table(self.assignments_table)
                .select("*")
                .eq("post_id", post_id)
                .execute()
            )
            return [PostClusterAssignment(**row) for row in response.data]
        except Exception as error:
            raise ExternalServiceError("Supabase", str(error)) from error


def get_trend_service() -> TrendService:
    return TrendService()
