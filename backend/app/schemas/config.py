from pydantic import BaseModel

class UpdateConfigRequest(BaseModel):
    config_id: int
    yaml_content: str