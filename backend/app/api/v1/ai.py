import os
import json
from fastapi import APIRouter, HTTPException
from app.schemas.analyzeRequest import AnalyzeRequest
import google.generativeai as genai

router = APIRouter()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

@router.post("/analyze-pipeline")
async def analyze_pipeline(request: AnalyzeRequest):
    prompt = f"""
        You are an Expert DevOps Architect. Analyze the following CI/CD YAML configuration.
        
        Identify issues and improvements in 3 categories: Security, Performance, and Best Practices.

        Return EXACTLY this JSON structure:
        {{
            "score": 85,
            "summary": "Brief 1-sentence summary",
            "findings": [
                {{
                    "category": "Security" | "Performance" | "Best Practice",
                    "severity": "High" | "Medium" | "Low",
                    "title": "Short title",
                    "description": "Detailed explanation",
                    "job_name": "name of the job this applies to"
                }}
            ]
        }}

        YAML to analyze:
        {request.yaml_content}
        """
    
    try: 
        response = model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
                temperature=0.2,
            )
        )

        result = json.loads(response.text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Помилка при аналізі пайплайну: {str(e)}")