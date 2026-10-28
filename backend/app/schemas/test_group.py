from pydantic import BaseModel, ConfigDict
from typing import List

class TestGroupCreate(BaseModel):
    name: str
    flashcard_ids: List[int]

class TestGroupRead(BaseModel):
    id: int
    name: str
    flashcard_ids: List[int] = []

    model_config = ConfigDict(from_attributes=True)