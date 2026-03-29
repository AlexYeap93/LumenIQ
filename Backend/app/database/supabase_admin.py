from functools import lru_cache

from supabase import create_client, Client

from app.core.configuration import settings


@lru_cache
def get_supabase_admin_client() -> Client:
    """Returns a Supabase client authenticated with the service role key.
    Bypasses Row Level Security — use only for server-side administrative operations
    like user management, webhook processing, and background tasks.
    """
    return create_client(settings.supabase_url, settings.supabase_service_role_key)
