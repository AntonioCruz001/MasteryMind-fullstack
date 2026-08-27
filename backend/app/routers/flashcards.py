from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import crud, models
from app.database import get_db
from app.core.deps import get_current_user
from app.schemas.flashcard import FlashcardCreate, FlashcardRead

router = APIRouter(
    prefix="/subjects/{subject_id}/flashcards",
    tags=["Flashcards"]
)

@router.post("/", response_model=FlashcardRead, status_code=status.HTTP_201_CREATED)
def create_flashcard(
    subject_id: int,
    flashcard: FlashcardCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Verifica se o subject pertence ao usuário logado
    subject = db.query(models.Subject).filter(models.Subject.id == subject_id, models.Subject.user_id == current_user.id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Assunto não encontrado.")
    
    return crud.create_flashcard(db=db, flashcard=flashcard, subject_id=subject_id)


@router.get("/", response_model=List[FlashcardRead])
def read_flashcards(
    subject_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    subject = db.query(models.Subject).filter(models.Subject.id == subject_id, models.Subject.user_id == current_user.id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Assunto não encontrado.")
        
    return crud.get_flashcards_by_subjects(db=db, subject_id=subject_id)


@router.delete("/{flashcard_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_flashcard(
    subject_id: int,
    flashcard_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    subject = db.query(models.Subject).filter(models.Subject.id == subject_id, models.Subject.user_id == current_user.id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Assunto não encontrado.")
        
    success = crud.delete_flashcard(db=db, flashcard_id=flashcard_id)
    if not success:
        raise HTTPException(status_code=404, detail="Flashcard não encontrado.")
    return None

@router.post("/{flashcard_id}/review", response_model=FlashcardRead)
def review_flashcard_route(
    subject_id: int,
    flashcard_id: int,
    data: dict,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    subject = db.query(models.Subject).filter(models.Subject.id == subject_id, models.Subject.user_id == current_user.id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Assunto não encontrado.")

    result = data.get("result")
    if result not in ["acerto","erro"]:
        raise HTTPException(status_code=400, detail="Resultado inválido. Use 'acerto' ou 'erro'.")

    updated_card = crud.review_flashcard(db=db, flashcard_id = flashcard_id, result = result)
    if not updated_card:
        raise HTTPException(status_code=404, detail="Flashcard não encontrado.")

    return updated_card