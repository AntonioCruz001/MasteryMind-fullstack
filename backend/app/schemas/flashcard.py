from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional, Literal

class FlashcardBase(BaseModel):
    front: str
    back: str


class FlashcardCreate(FlashcardBase):
    pass

class FlashcardUpdate(FlashcardBase):
    front: Optional[str] = None
    back: Optional[str] = None

class FlashcardRead(FlashcardBase):
    id:int
    subject_id: int
    level: int
    is_reviewed: bool
    next_review_date: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class FlashcardReview(BaseModel):
    result: Literal["acerto", "erro"]