from typing import Literal
from uuid import UUID

from pydantic import BaseModel, Field

Locale = Literal["uk", "en"]


class FindingUk(BaseModel):
    category: str = Field(
        description="Категорія: рівно один із рядків — Безпека, Продуктивність або Найкращі практики (українською, як зазначено)."
    )
    severity: str = Field(
        description="Критичність: рівно один із рядків — Висока, Середня або Низька (українською, як зазначено)."
    )
    title: str = Field(description="Короткий заголовок знахідки українською (1 рядок).")
    description: str = Field(description="Детальне пояснення проблеми та рекомендації українською.")
    job_name: str | None = Field(
        None, description="Назва job/stage з YAML, до якого стосується знахідка, якщо застосовно;"
    )


class AIReportUk(BaseModel):
    score: int = Field(description="Оцінка «здоров’я» пайплайну від 0 до 100.")
    summary: str = Field(description="Короткий підсумок стану пайплайну одним реченням українською.")
    findings: list[FindingUk] = Field(
        description="Список проблем і покращень за категоріями Безпека, Продуктивність, Найкращі практики."
    )


class FindingEn(BaseModel):
    category: str = Field(
        description="Category: exactly one of Security, Performance, Best Practices."
    )
    severity: str = Field(description="Severity: exactly one of High, Medium, Low.")
    title: str = Field(description="Short finding title in English (one line).")
    description: str = Field(description="Detailed explanation and recommendations in English.")
    job_name: str | None = Field(
        None, description="Related job/stage name from the YAML, if applicable."
    )


class AIReportEn(BaseModel):
    score: int = Field(description="Pipeline health score from 0 to 100.")
    summary: str = Field(description="One-sentence summary of the pipeline state in English.")
    findings: list[FindingEn] = Field(
        description="Findings in Security, Performance, and Best Practices."
    )


# Default OpenAPI / JSON shape (same fields as English variant)
AIReport = AIReportUk


class AnalyzeRequest(BaseModel):
    config_id: UUID
    locale: Locale = "uk"
