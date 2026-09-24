from sqlalchemy import Table, String, ForeignKey, Column
from sqlalchemy.orm import relationship, mapped_column, Mapped
from app.database import Base


flashcard_tags = Table(
    "flashcard_tags",
    Base.metadata,
    Column("flashcard_id", ForeignKey("flashcards.id", ondelete="CASCADE"), primary_key=True),
    Column("tag_id", ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True)
)

class Tag(Base):
    __tablename__ = "tags"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)

    flashcards = relationship("Flashcard", secondary=flashcard_tags, back_populates="tags")