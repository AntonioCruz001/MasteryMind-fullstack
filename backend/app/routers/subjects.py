from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app import crud, schemas, models
from app.dependencies import get_current_user
from app.database import SessionLocal


router = APIRouter(
    prefix="/subjects",
    tags=["Subjects (Assuntos)"]
)

# Dependência para abrir/fechar a sessão do banco a cada requisição
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Rota para criar um assunto
@router.post("/", response_model=schemas.SubjectRead)
def create_subject(subject: schemas.SubjectCreate, db: Session = Depends(get_db),
                   current_user : models.User = Depends(get_current_user)):
    
    return crud.create_subject(db = db, subject = subject, user_id = current_user.id)

# Rota para Listar os assuntos
@router.get("/", response_model=List[schemas.SubjectRead])
def read_subjects(skip: int = 0, limit: int = 100, db:Session = Depends(get_db),
                  current_user : models.User = Depends(get_current_user)):
    
    subjects = crud.get_subjects(db, skip = skip, limit = limit, user_id = current_user.id)
    return subjects