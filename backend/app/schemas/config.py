from uuid import UUID

from pydantic import BaseModel

class UpdateConfigRequest(BaseModel):
    config_id: UUID
    yaml_content: str