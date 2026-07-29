"""
Centralized application configuration.
"""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    environment: str = "development"
    cors_origins: str = "http://localhost:5173"
    mymemory_api_url: str = "https://api.mymemory.translated.net/get"
    mymemory_api_key: str = ""

    class Config:
        env_file = ".env"

    @property
    def cors_origins_list(self) -> list[str]:
        """CORS_ORIGINS is stored as a comma-separated string in .env;
        this property splits it into a list for FastAPI's middleware."""
        return [origin.strip() for origin in self.cors_origins.split(",")]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()