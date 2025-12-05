"""Application configuration.

This module uses Pydantic Settings for configuration management,
which provides:
- Type validation
- Environment variable loading
- .env file support
- Default values

Java equivalent: @ConfigurationProperties classes.
"""

from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
  """Application settings loaded from environment variables.
  
  Pydantic Settings automatically:
  1. Reads from environment variables
  2. Falls back to .env file
  3. Uses default values if neither exists
  4. Validates types

  Attribute names are case-insensitive for env vars.
  APP_NAME in .env -> app_name attribute in code.
  """

  # Application
  app_name: str = "E-Commerce API"
  app_version: str = "0.1.0"
  debug: bool = False

  # API
  api_prefix: str = "/api/v1"

  # Server
  host: str = "0.0.0.0"
  port: int = 8000

  # Database
  database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/ecommerce"

  # Security
  secret_key: str = "ecommerce-secret-key"
  access_token_expire_minutes: int = 30

  # Use model_config instead of inner Config class (Pydantic v2 style)
  model_config = SettingsConfigDict(
      env_file=".env",
      env_file_encoding="utf-8",
      case_sensitive=False,
      extra="ignore", # Ignore extra env vars
  )

@lru_cache
def get_settings() -> Settings:
  """Get cached settings instance.

  The @lru_cache decorator ensures we only create one Settings instance.
  This is important because reading .env files has overhead.

  Java equivalent: @Bean with singleton scope (the default in Spring)

  Returns:
    Settings: The cached settings instance.
  """
  return Settings()