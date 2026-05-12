from pydantic import BaseModel


class UpdateConfigRequest(BaseModel):
    yaml_content: str