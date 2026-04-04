from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql://corpora:corpora_dev@db:5432/corpora"
    api_secret_key: str = "dev-secret"
    allowed_origins: str = "http://localhost:3000"
    ip_hash_salt: str = "default-salt"

    @property
    def origins_list(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",")]

    class Config:
        env_file = ".env"


settings = Settings()
