"""FastAPI application entry point.

This module creates and configures the FastAPI application instance.

Java equivalent: The class with @SpringBootApplication annotation.
"""

from fastapi import FastAPI
from ecommerce.config import get_settings

# Get settings instance
settings = get_settings()

# Create FastAPI application
# This is like: new SpringApplication(MyApplication.class)
app = FastAPI(
  title = settings.app_name,
  version = settings.app_version,
  description = "A REST API for an e-commerce platform",
  debug = settings.debug,
  # OpenAPI documentation will be available at /docs (Swagger UI)
  # and /redoc (ReDoc) automatically
  docs_url = "/docs",
  redoc_url = "/redoc",
)

@app.get("/health")
async def health_check() -> dict[str, str]:
  """Health check endpoint.
  
  The @app.get decorator registers this function as a GET endpoint.
  This is like @GetMapping("/health") in Spring.

  Note the 'async def' - this makes the function a coroutine.
  FastAPI can handle both sync and async functions, but ascync
  is preferred for I/O operations.

  Returns:
    dict: Health status.
  """
  return {"status": "healthy"}

@app.get("/")
async def root() -> dict[str, str]:
  """Root endpoint with API information."""
  
  return {
    "message": f"Welcome to {settings.app_name}",
    "version": settings.app_version,
    "docs": "/docs",
  }

# This block only runs when you execute this file directly
# It's like: public static void main(String[] args) in Java
if __name__ == "__main__":
  import uvicorn
  
  uvicorn.run(
    "src.ecommerce.main:app", # Path to the app object
    host=settings.host,
    port=settings.port,
    reload=settings.debug, # Auto-reload on code changes (dev only)
  )