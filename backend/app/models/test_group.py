from datetime import datetime
from sqlalchemy import String, ForeignKey, Table, Column, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base




# Tabela associativa muitos-para-muitos entre Grupos de Teste e Flashcards
test_group_flashcards = Table(
    "test_group_flashcards",
    Base.metadata,
    Column("test_group_id", ForeignKey("test_groups.id", ondelete="CASCADE"), primary_key=True),
    Column("flashcard_id", ForeignKey("flashcards.id", ondelete="CASCADE"), primary_key=True)
)

class TestGroup(Base):
    __tablename__ = "test_groups"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    user = relationship("User")
    flashcards = relationship("Flashcard", secondary=test_group_flashcards)