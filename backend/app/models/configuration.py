import uuid

from sqlalchemy import Column, DateTime, ForeignKey, String, Text, Uuid
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.database import Base


class Configuration(Base):
    __tablename__ = "configurations"

    id = Column(Uuid, primary_key=True, index=True, default=uuid.uuid4)
    name = Column(String, nullable=True)
    raw_yaml = Column(Text, nullable=False)
    analysis_result = Column(Text, nullable=True)
    ai_report = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user_id = Column(Uuid, ForeignKey("users.id"))
    owner = relationship("User", back_populates="configurations")