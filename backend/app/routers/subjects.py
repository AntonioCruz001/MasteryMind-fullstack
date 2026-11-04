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


@router.get("/{subject_id}", response_model=SubjectRead)
def read_subject(
    subject_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    subject = db.query(models.Subject).filter(
        models.Subject.id == subject_id,
        models.Subject.user_id == current_user.id
    ).first()
    
    if not subject:
        raise HTTPException(status_code=404, detail="Assunto não encontrado.")
        
    return subject

@router.put("/{subject_id}", response_model=SubjectRead)
def update_subject(subject_id: int, subject_in: SubjectCreate, db: Session = Depends(get_db), current_User: models.User = Depends(get_current_user)):
    updated = crud.update_subject(db = db, subject_id = subject_id, user_id= current_User.id, subject_in= subject_in)
    if not updated:
        raise HTTPException(status_code=404, detail="Assunto não encontrado.")
    return updated

@router.delete("/{subject_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_subject(subject_id: int, db: Session = Depends(get_db),current_User: models.User = Depends(get_current_user) ):
    success = crud.delete_subject(db=db, subject_id= subject_id, user_id=current_User.id)
    if not success:
        raise HTTPException(status_code=404, detail="Assunto não encontrado.")
    return None