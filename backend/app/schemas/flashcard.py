from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import List, Optional, Literal

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
    is_reviewed: bool
    next_review_date: Optional[datetime] = None
    last_reviewed_at: Optional[datetime] = None
    last_result: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class FlashcardReview(BaseModel):
    result: Literal["acerto", "erro"]
    firstMistake: Optional[bool] = False