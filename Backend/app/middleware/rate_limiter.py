from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from starlette.requests import Request

limiter = Limiter(key_func=get_remote_address, default_limits=["100/minute"])


def rate_limit_exceeded_handler(request: Request, exception: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"detail": "Rate limit exceeded. Please try again later."},
    )


def configure_rate_limiter(application: FastAPI) -> None:
    application.state.limiter = limiter
    application.add_exception_handler(RateLimitExceeded, rate_limit_exceeded_handler)
    application.add_middleware(SlowAPIMiddleware)
