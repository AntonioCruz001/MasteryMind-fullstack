from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import List, Optional, Literal
from app.enums import FlashcardStatus

class FlashcardBase(BaseModel):
    front: str
    back: str
    tags: List[str] = []


class FlashcardCreate(FlashcardBase):
    pass

class FlashcardUpdate(FlashcardBase):
    front: Optional[str] = None
    back: Optional[str] = None
    tags: Optional[List[str]] = None

class FlashcardRead(FlashcardBase):
    id:int
    subject_id: int
    level: int
    status: FlashcardStatus
    next_review_date: Optional[datetime] = None
    last_reviewed_at: Optional[datetime] = None
    last_result: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class FlashcardReview(BaseModel):
    result: Literal["acerto", "erro"]
    firstMistake: Optional[bool] = False

class FlashcardReset(BaseModel):
    # Contém os dados padrão para o reset
    status: FlashcardStatus = FlashcardStatus.LEARNING
    level: int = 0
    next_review_date: Optional[datetime] = None
    last_result: Optional[str] = None
    last_reviewed_at: Optional[datetime] = None

