import json

import yaml
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_optional_current_user
from app.db.database import get_db
from app.models.configuration import Configuration
from app.models.user import User
from app.services.graph_builder import generate_graph
from app.schemas.config import UpdateConfigRequest

router = APIRouter()

@router.post("/upload-yaml")
async def upload_and_parse(
    file: UploadFile = File(...),
    current_user: User | None = Depends(get_optional_current_user),
    db: Session = Depends(get_db),
):
    if not file.filename.endswith((".yaml", ".yml")):
        raise HTTPException(status_code=400, detail="ONLY_YAML_AND_YML_FILES_ALLOWED")
    
    try: 
        content = await file.read()
        content_str = content.decode("utf-8")
        yaml_data = yaml.safe_load(content_str)
    except yaml.YAMLError as e:
        raise HTTPException(status_code=400, detail="YAML_PARSING_ERROR")
    except Exception as e:
        raise HTTPException(status_code=400, detail="FILE_PROCESSING_ERROR")
    
    if not yaml_data:
        raise HTTPException(status_code=400, detail="COULD_NOT_READ_YAML_FILE")
    
    try:
        graph_data = generate_graph(yaml_data)
    except ValueError as e:
        raise HTTPException(status_code=422, detail="GRAPH_GENERATION_ERROR")
    
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
        "message": "FILE_UPLOADED_AND_PARSED_SUCCESSFULLY",
        "config_id": saved_config_id,
        "graph_data": graph_data,
        "raw_yaml": content_str,
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

@router.put("/update")
def update_yaml_config(
    request: UpdateConfigRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    config = db.query(Configuration).filter(
        Configuration.id == request.config_id,
        Configuration.user_id == current_user.id
    ).first()

    if not config:
        raise HTTPException(status_code=404, detail="CONFIGURATION_NOT_FOUND")

    try:
        yaml_data = yaml.safe_load(request.yaml_content)
        if not yaml_data:
            raise ValueError("FILE_CANNOT_BE_EMPTY")

        graph_data = generate_graph(yaml_data)

        config.raw_yaml = request.yaml_content
        config.analysis_result = json.dumps(graph_data)
        config.ai_report = None

        db.commit()

        return {
            "message": "CONFIGURATION_UPDATED_SUCCESSFULLY",
            "graph_data": graph_data,
            "raw_yaml": request.yaml_content,
        }

    except yaml.YAMLError as e:
        raise HTTPException(status_code=400, detail="YAML_SYNTAX_ERROR")
    except ValueError as e:
        raise HTTPException(status_code=400, detail="INTERNAL_ERROR")
    except Exception as e:
        raise HTTPException(status_code=500, detail="INTERNAL_ERROR")