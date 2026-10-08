from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import crud, models
from app.database import get_db
from app.core.deps import get_current_user
from app.schemas.flashcard import FlashcardRead

router = APIRouter(
    prefix="/flashcards",
    tags=["Flashcards Global"]
)

@router.get("/",response_model=List[FlashcardRead])
def read_all_user_flashcard(
    db:Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Retorna TODOS os flashcards pertencentes ao usuário logado,
    independente da matéria (Subject). Usado pelo HomeLayout no Frontend.
    """
    return crud.get_all_flashcards_by_user(db = db, user_id = current_user.id)