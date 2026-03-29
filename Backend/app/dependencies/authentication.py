from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.core.exceptions import UnauthorizedError
from app.database.supabase_admin import get_supabase_admin_client

bearer_scheme = HTTPBearer()


async def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> str:
    """Extracts and validates the user ID from the Supabase JWT in the Authorization header.
    Returns the authenticated user's UUID string.
    """
    token = credentials.credentials
    admin_client = get_supabase_admin_client()

    try:
        user_response = admin_client.auth.get_user(token)
        if user_response is None or user_response.user is None:
            raise UnauthorizedError("Could not validate user from token")
        return str(user_response.user.id)
    except Exception as error:
        raise UnauthorizedError(f"Token validation failed: {error}") from error


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> dict:
    """Extracts the full user object from the Supabase JWT.
    Returns a dictionary with user id, email, and metadata.
    """
    token = credentials.credentials
    admin_client = get_supabase_admin_client()

    try:
        user_response = admin_client.auth.get_user(token)
        if user_response is None or user_response.user is None:
            raise UnauthorizedError("Could not validate user from token")

        user = user_response.user
        return {
            "id": str(user.id),
            "email": user.email,
            "user_metadata": user.user_metadata or {},
        }
    except UnauthorizedError:
        raise
    except Exception as error:
        raise UnauthorizedError(f"Token validation failed: {error}") from error
