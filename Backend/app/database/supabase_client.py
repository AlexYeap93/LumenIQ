from functools import lru_cache

from supabase import create_client, Client

from app.core.configuration import settings


@lru_cache
def get_supabase_client() -> Client:
    """Returns a Supabase client authenticated with the anon key.
    Used for operations that respect Row Level Security (RLS) policies.
    """
    return create_client(settings.supabase_url, settings.supabase_anon_key)


def get_authenticated_client(access_token: str) -> Client:
    """Returns a Supabase client scoped to the authenticated user's session.
    Passes the user's JWT so RLS policies apply to their specific permissions.
    """
    client = create_client(settings.supabase_url, settings.supabase_anon_key)
    client.auth.set_session(access_token, "")
    return client
