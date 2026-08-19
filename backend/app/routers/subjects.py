from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import crud, models
from app.database import get_db
from app.core.deps import get_current_user
from app.schemas.subjects import SubjectCreate, SubjectRead
# from app.crud.subject import create_subject, get_subjects

router = APIRouter(
    prefix="/subjects",
    tags=["Subjects (Assuntos)"]
)

@router.post("/", response_model=SubjectRead, status_code=status.HTTP_201_CREATED)
def create_subject(
    subject: SubjectCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.create_subject(db=db, subject=subject, user_id=current_user.id)


@router.get("/", response_model=List[SubjectRead])
def read_subjects(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.get_subjects(db=db, skip=skip, limit=limit, user_id=current_user.id)