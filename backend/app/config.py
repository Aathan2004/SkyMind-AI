from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "SkyMind AI"
    DEBUG: bool = True
    DATABASE_URL: str = "sqlite:///./skymind.db"
    SECRET_KEY: str = "skymind-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 14
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173"

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    class Config:
        env_file = ".env"

settings = Settings()
