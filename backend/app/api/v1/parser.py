import yaml
from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from sqlalchemy.orm import Session
import json

from app.db.database import get_db
from app.models.user import User
from app.models.configuration import Configuration
from app.api.deps import get_optional_current_user, get_current_user
from app.services.graph_builder import generate_graph

router = APIRouter()

@router.post("/upload-yaml")
async def upload_and_parse(
    file: UploadFile = File(...),
    current_user: User | None = Depends(get_optional_current_user),
    db: Session = Depends(get_db),
):
    if not file.filename.endswith((".yaml", ".yml")):
        raise HTTPException(status_code=400, detail="Дозволені лише файли .yaml або .yml")
    
    try: 
        content = await file.read()
        content_str = content.decode("utf-8")
        yaml_data = yaml.safe_load(content_str)
    except yaml.YAMLError as e:
        raise HTTPException(status_code=400, detail=f"Помилка парсингу YAML: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Помилка при обробці файлу: {str(e)}")
    
    if not yaml_data:
        raise HTTPException(status_code=400, detail="Не вдалося прочитати YAML файл")
    
    try:
        graph_data = generate_graph(yaml_data)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    
    saved_config_id = None
    if current_user:
        new_config = Configuration(
            name=file.filename,
            raw_yaml=content_str,
            analysis_result=json.dumps(graph_data),
            user_id=current_user.id,
        )

        db.add(new_config)
        db.commit()
        db.refresh(new_config)
        saved_config_id = new_config.id
    
    return {
        "message": "Файл успішно завантажено та проаналізовано",
        "config_id": saved_config_id,
        "graph_data": graph_data,
        "status": "success",
        "saved": bool(saved_config_id),
    }
        
@router.get("/history")
def get_user_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    configurations = (
        db.query(Configuration)
        .filter(Configuration.user_id == current_user.id)
        .order_by(Configuration.created_at.desc())
        .all()
    )

    return [
        {
            "id": config.id,
            "name": config.name,
            "created_at": config.created_at.isoformat(),
            "analysis_result": config.analysis_result,
            "raw_yaml": config.raw_yaml,
        } for config in configurations
    ]