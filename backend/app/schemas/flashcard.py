from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class FlashcardBase(BaseModel):
    front: str
    back: str


class FlashcardCreate(FlashcardBase):
    pass

class FlashcardRead(FlashcardBase):
    id:int
    subject_id: int
    points: int
    repetitions: int
    is_reviewed: bool
    next_review_date: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)