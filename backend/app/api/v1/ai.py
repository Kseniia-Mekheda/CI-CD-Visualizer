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
from app.schemas.ai import AIReport, AnalyzeRequest

router = APIRouter()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL_NAME = "gemini-3-flash-preview"

@router.post("/analyze-pipeline", response_model=AIReport)
@limiter.limit("3/minute")
async def analyze_pipeline(
    request: Request, 
    body: AnalyzeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    config = db.query(Configuration).filter(
        Configuration.id == body.config_id,
        Configuration.user_id == current_user.id
    ).first()

    if not config:
        raise HTTPException(status_code=404, detail="Конфігурацію не знайдено")

    if config.ai_report:
        return json.loads(config.ai_report)

    prompt = f"""
        You are an Expert DevOps Architect. Analyze the following CI/CD YAML configuration.
        Identify issues and improvements strictly in 3 categories: Security, Performance, and Best Practices.
        Respond in Ukrainian for all user-facing text.
        
        YAML to analyze:
        {config.raw_yaml}
        """
    
    try: 
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.2,
                response_schema=AIReport,
            ),
        )

        result = json.loads(response.text)
        config.ai_report = json.dumps(result)
        db.commit()
        db.refresh(config)
        return result
    except Exception as e:
        print(f"AI Error: {e}")
        raise HTTPException(status_code=500, detail=f"Помилка при аналізі пайплайну: {str(e)}")