# app/routers/test_result.py
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.test_result import TestResultCreate, TestResultRead
from app.crud import test_result as crud_test_result
from app.crud import test_group as crud_test_group

router = APIRouter(prefix="/test-groups", tags=["Test Results"])

@router.post("/{group_id}/results", response_model=TestResultRead, status_code=status.HTTP_201_CREATED)
def create_test_result(
    group_id: int,
    data: TestResultCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    group = crud_test_group.get_test_group_by_id(db=db, group_id=group_id, user_id=current_user.id)
    if not group:
        raise HTTPException(status_code=404, detail="Grupo de teste não encontrado.")
    
    return crud_test_result.create_test_result(db=db, data=data, test_group_id=group_id, user_id=current_user.id)

@router.get("/{group_id}/results", response_model=List[TestResultRead])
def list_test_results(
    group_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    group = crud_test_group.get_test_group_by_id(db=db, group_id=group_id, user_id=current_user.id)
    if not group:
        raise HTTPException(status_code=404, detail="Grupo de teste não encontrado.")
        
    return crud_test_result.get_test_results_by_group(db=db, test_group_id=group_id, user_id=current_user.id)