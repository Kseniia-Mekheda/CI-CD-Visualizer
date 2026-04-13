from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.auth import router as auth_router
from app.api.v1.parser import router as parser_router
from app.api.v1.ai import router as ai_router

def get_application() -> FastAPI:
    application = FastAPI()

    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    application.include_router(auth_router, prefix="/api/v1/auth", tags=["Authentication"])
    application.include_router(parser_router, prefix="/api/v1/parser", tags=["Parser"])
    application.include_router(ai_router, prefix="/api/v1/ai", tags=["AI"])
    return application

app = get_application()

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "Backend is running!"}