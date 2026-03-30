from supabase import Client

from app.database.supabase_client import get_supabase_client
from app.database.supabase_admin import get_supabase_admin_client
from app.core.exceptions import UnauthorizedError, ConflictError, ExternalServiceError


class AuthenticationService:

    def __init__(self):
        self.client: Client = get_supabase_client()
        self.admin_client: Client = get_supabase_admin_client()

    def sign_up(self, email: str, password: str, user_metadata: dict | None = None) -> dict:
        try:
            response = self.client.auth.sign_up({
                "email": email,
                "password": password,
                "options": {"data": user_metadata or {}},
            })

            if response.user is None:
                raise ConflictError("An account with this email already exists")

            return {
                "user_id": str(response.user.id),
                "email": response.user.email,
                "access_token": response.session.access_token if response.session else None,
                "refresh_token": response.session.refresh_token if response.session else None,
            }
        except ConflictError:
            raise
        except Exception as error:
            raise ExternalServiceError("Supabase Auth", str(error)) from error

    def sign_in(self, email: str, password: str) -> dict:
        try:
            response = self.client.auth.sign_in_with_password({
                "email": email,
                "password": password,
            })

            if response.user is None or response.session is None:
                raise UnauthorizedError("Invalid email or password")

            return {
                "user_id": str(response.user.id),
                "email": response.user.email,
                "access_token": response.session.access_token,
                "refresh_token": response.session.refresh_token,
                "expires_in": response.session.expires_in,
            }
        except UnauthorizedError:
            raise
        except Exception as error:
            raise UnauthorizedError("Invalid email or password") from error

    def sign_out(self, access_token: str) -> None:
        try:
            self.client.auth.sign_out()
        except Exception as error:
            raise ExternalServiceError("Supabase Auth", str(error)) from error

    def refresh_session(self, refresh_token: str) -> dict:
        try:
            response = self.client.auth.refresh_session(refresh_token)

            if response.session is None:
                raise UnauthorizedError("Could not refresh session")

            return {
                "access_token": response.session.access_token,
                "refresh_token": response.session.refresh_token,
                "expires_in": response.session.expires_in,
            }
        except UnauthorizedError:
            raise
        except Exception as error:
            raise UnauthorizedError("Could not refresh session") from error

    def request_password_reset(self, email: str) -> None:
        try:
            self.client.auth.reset_password_email(email)
        except Exception as error:
            raise ExternalServiceError("Supabase Auth", str(error)) from error

    def update_password(self, access_token: str, new_password: str) -> None:
        try:
            self.admin_client.auth.admin.update_user_by_id(
                self._get_user_id_from_token(access_token),
                {"password": new_password},
            )
        except Exception as error:
            raise ExternalServiceError("Supabase Auth", str(error)) from error

    def _get_user_id_from_token(self, access_token: str) -> str:
        try:
            user_response = self.admin_client.auth.get_user(access_token)
            if user_response.user is None:
                raise UnauthorizedError("Invalid access token")
            return str(user_response.user.id)
        except UnauthorizedError:
            raise
        except Exception as error:
            raise UnauthorizedError("Invalid access token") from error


def get_authentication_service() -> AuthenticationService:
    return AuthenticationService()
