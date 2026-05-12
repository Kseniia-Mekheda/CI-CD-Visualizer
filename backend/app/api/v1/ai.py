import json
import os

from fastapi import APIRouter, Depends, HTTPException, Request
from google import genai
from google.genai import types
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.limiter import limiter
from app.db.database import get_db
from app.models.configuration import Configuration
from app.models.user import User
from app.schemas.ai import AIReportEn, AIReportUk, AnalyzeRequest

router = APIRouter()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL_NAME = "gemini-3-flash-preview"


def _load_ai_reports(raw: str | None) -> dict:
    """Return per-locale report cache stored in `Configuration.ai_report`."""
    if not raw:
        return {}
    data = json.loads(raw)
    return data if isinstance(data, dict) else {}


def _build_prompt(raw_yaml: str, locale: str) -> str:
    if locale == "en":
        return f"""
            You are an Expert DevOps Architect. Analyze the following CI/CD YAML configuration.
            Identify issues and improvements strictly in 3 categories: Security, Performance, and Best Practices.
            Respond in English for all user-facing text (titles, descriptions, summary, category and severity labels).

            YAML to analyze:
            {raw_yaml}
            """
    return f"""
        You are an Expert DevOps Architect. Analyze the following CI/CD YAML configuration.
        Identify issues and improvements strictly in 3 categories: Security, Performance, and Best Practices.
        Respond in Ukrainian for all user-facing text (titles, descriptions, summary, category and severity labels).

        YAML to analyze:
        {raw_yaml}
        """


@router.post("/analyze-pipeline", response_model=AIReportUk)
@limiter.limit("3/minute")
async def analyze_pipeline(
    request: Request,
    body: AnalyzeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    config = db.query(Configuration).filter(
        Configuration.id == body.config_id,
        Configuration.user_id == current_user.id,
    ).first()

    if not config:
        raise HTTPException(status_code=404, detail="CONFIGURATION_NOT_FOUND")

    reports = _load_ai_reports(config.ai_report)
    if body.locale in reports:
        return reports[body.locale]

    schema_model = AIReportEn if body.locale == "en" else AIReportUk
    prompt = _build_prompt(config.raw_yaml or "", body.locale)

    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.2,
                response_schema=schema_model,
            ),
        )

        result = json.loads(response.text)
        reports[body.locale] = result
        config.ai_report = json.dumps(reports)
        db.commit()
        db.refresh(config)
        return result
    except Exception as e:
        print(f"AI Error: {e}")
        raise HTTPException(status_code=500, detail="AI_ANALYSIS_ERROR")
