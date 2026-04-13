from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.api.v1.ai import router as ai_router
from app.api.v1.auth import router as auth_router
from app.api.v1.parser import router as parser_router
from app.core.config import settings
from app.core.limiter import limiter


def get_application() -> FastAPI:
    application = FastAPI()

    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    application.state.limiter = limiter
    application.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

    application.include_router(auth_router, prefix="/api/v1/auth", tags=["Authentication"])
    application.include_router(parser_router, prefix="/api/v1/parser", tags=["Parser"])
    application.include_router(ai_router, prefix="/api/v1/ai", tags=["AI"])
    return application

app = get_application()

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "Backend is running!"}