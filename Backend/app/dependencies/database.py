from supabase import Client

from app.database.supabase_client import get_supabase_client
from app.database.supabase_admin import get_supabase_admin_client


def get_database_client() -> Client:
    """Provides the standard Supabase client for use as a FastAPI dependency.
    Operations through this client respect Row Level Security policies.
    """
    return get_supabase_client()


def get_admin_database_client() -> Client:
    """Provides the admin Supabase client for use as a FastAPI dependency.
    Bypasses RLS — restrict usage to trusted server-side operations only.
    """
    return get_supabase_admin_client()
