from fastapi import HTTPException, status


class NotFoundError(HTTPException):
    def __init__(self, resource: str, identifier: str | None = None):
        detail = f"{resource} not found"
        if identifier:
            detail = f"{resource} with id '{identifier}' not found"
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)


class ForbiddenError(HTTPException):
    def __init__(self, message: str = "You do not have permission to perform this action"):
        super().__init__(status_code=status.HTTP_403_FORBIDDEN, detail=message)


class UnauthorizedError(HTTPException):
    def __init__(self, message: str = "Authentication credentials are invalid or missing"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=message,
            headers={"WWW-Authenticate": "Bearer"},
        )


class ConflictError(HTTPException):
    def __init__(self, message: str = "Resource already exists"):
        super().__init__(status_code=status.HTTP_409_CONFLICT, detail=message)


class ValidationError(HTTPException):
    def __init__(self, message: str = "Validation failed"):
        super().__init__(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=message)


class ExternalServiceError(HTTPException):
    def __init__(self, service_name: str, message: str = ""):
        detail = f"External service '{service_name}' encountered an error"
        if message:
            detail = f"{detail}: {message}"
        super().__init__(status_code=status.HTTP_502_BAD_GATEWAY, detail=detail)
