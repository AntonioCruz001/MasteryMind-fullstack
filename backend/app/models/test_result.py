from datetime import datetime
from sqlalchemy import Integer, ForeignKey, DateTime, Float, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

class TestResult(Base):
    __tablename__ = "test_results"

    id:Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    test_group_id:Mapped[int] = mapped_column(ForeignKey("test_groups.id", ondelete='CASCADE'), nullable=False)
    user_id:Mapped[int] = mapped_column(ForeignKey("users.id", ondelete='CASCADE'), nullable=False)

    total_cards:Mapped[int] = mapped_column(Integer, nullable=False)
    correct_count:Mapped[int] = mapped_column(Integer, nullable=False)
    score_percentage:Mapped[int] = mapped_column(Float, nullable=False)

    created_at:Mapped[datetime] = mapped_column(DateTime, server_default = func.now())

    test_group = relationship("TestGroup", back_populates='results')