from pydantic import BaseModel, ConfigDict
from datetime import datetime

class TestResultCreate(BaseModel):
    correct_count: int
    total_cards: int
    score_percentage: float

class TestResultRead(TestResultCreate):
    id: int
    test_group_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)