
from pydantic import BaseModel, Field


class Finding(BaseModel):
    category: str = Field(description="Категорія: рівно один із рядків — Безпека, Продуктивність або Найкращі практики (українською, як зазначено).")
    severity: str = Field(description="Критичність: рівно один із рядків — Висока, Середня або Низька (українською, як зазначено).")
    title: str = Field(description="Короткий заголовок знахідки українською (1 рядок).")
    description: str = Field(description="Детальне пояснення проблеми та рекомендації українською.")
    job_name: str | None = Field(None, description="Назва job/stage з YAML, до якого стосується знахідка, якщо застосовно;")

class AIReport(BaseModel):
    score: int = Field(description="Оцінка «здоров’я» пайплайну від 0 до 100.")
    summary: str = Field(description="Короткий підсумок стану пайплайну одним реченням українською.")
    findings: list[Finding] = Field(description="Список проблем і покращень за категоріями Безпека, Продуктивність, Найкращі практики.")

class AnalyzeRequest(BaseModel):
    config_id: int