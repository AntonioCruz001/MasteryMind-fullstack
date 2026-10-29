from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.test_group import TestGroup
from app.models.flashcard import Flashcard
from app.schemas.test_group import TestGroupCreate, TestGroupRead
from app.crud import test_group as crud_test_group

router = APIRouter(prefix="/test-groups", tags=["Test Groups"])

@router.post("/", response_model=TestGroupRead, status_code=status.HTTP_201_CREATED)
def create_group(
    data: TestGroupCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    group = crud_test_group.create_test_group(db=db, data=data, user_id=current_user.id)
    return {
        "id": group.id,
        "name": group.name,
        "flashcard_ids": [card.id for card in group.flashcards]
    }

@router.get("/", response_model=List[TestGroupRead])
def list_groups(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    groups = crud_test_group.get_test_groups_by_user(db=db, user_id=current_user.id)
    return [
        {
            "id": g.id,
            "name": g.name,
            "flashcard_ids": [card.id for card in g.flashcards]
        }
        for g in groups
    ]

@router.put("/{group_id}", response_model=TestGroupRead)
def update_group(
    group_id: int,
    data: TestGroupCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    group = crud_test_group.update_test_group(db=db, group_id=group_id, data=data, user_id=current_user.id)
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Grupo de teste não encontrado"
        )
    return {
        "id": group.id,
        "name": group.name,
        "flashcard_ids": [card.id for card in group.flashcards]
    }