from pydantic import BaseModel

class AnalyzeRequest(BaseModel):
    yaml_data: str