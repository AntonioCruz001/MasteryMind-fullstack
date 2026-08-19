from pydantic import BaseModel, ConfigDict
from typing import Optional

class SubjectBase(BaseModel):
    name: str
    description: Optional[str] = None

class SubjectCreate(SubjectBase):
    pass

class SubjectRead(SubjectBase):
    id: int
    user_id: int

    model_config = ConfigDict(from_attributes=True)