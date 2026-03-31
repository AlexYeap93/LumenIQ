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
            create_response = self.admin_client.auth.admin.create_user({
                "email": email,
                "password": password,
                "email_confirm": True,
                "user_metadata": user_metadata or {},
            })

            if create_response.user is None:
                raise ConflictError("An account with this email already exists")

            user_id = str(create_response.user.id)

            self._create_initial_profile(user_id, user_metadata)

            sign_in_response = self.client.auth.sign_in_with_password({
                "email": email,
                "password": password,
            })

            if sign_in_response.session is None:
                raise ExternalServiceError("Supabase Auth", "Failed to create session after signup")

            return {
                "user_id": user_id,
                "email": email,
                "access_token": sign_in_response.session.access_token,
                "refresh_token": sign_in_response.session.refresh_token,
            }
        except ConflictError:
            raise
        except Exception as error:
            if "already been registered" in str(error) or "already exists" in str(error):
                raise ConflictError("An account with this email already exists") from error
            raise ExternalServiceError("Supabase Auth", str(error)) from error

    def _create_initial_profile(self, user_id: str, user_metadata: dict | None = None) -> None:
        try:
            profile_data: dict = {"user_id": user_id}
            if user_metadata:
                if "first_name" in user_metadata:
                    profile_data["first_name"] = user_metadata["first_name"]
                if "last_name" in user_metadata:
                    profile_data["last_name"] = user_metadata["last_name"]

            self.admin_client.table("profiles").insert(profile_data).execute()
        except Exception:
            pass

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

    def sign_in_with_google(self, id_token: str) -> dict:
        try:
            response = self.client.auth.sign_in_with_id_token({
                "provider": "google",
                "token": id_token,
            })

            if response.user is None or response.session is None:
                raise UnauthorizedError("Google authentication failed")

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
