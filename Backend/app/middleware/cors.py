from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.configuration import settings


def configure_cors(application: FastAPI) -> None:
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
