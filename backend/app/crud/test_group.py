# app/crud/test_group.py
from sqlalchemy.orm import Session
from app.models.test_group import TestGroup
from app.models.flashcard import Flashcard
from app.schemas.test_group import TestGroupCreate
from typing import List

def create_test_group(db: Session, data: TestGroupCreate, user_id: int) -> TestGroup:
    db_group = TestGroup(name=data.name, user_id=user_id)
    
    if data.flashcard_ids:
        cards = db.query(Flashcard).filter(Flashcard.id.in_(data.flashcard_ids)).all()
        db_group.flashcards = cards
        
    db.add(db_group)
    db.commit()
    db.refresh(db_group)
    return db_group

def get_test_groups_by_user(db: Session, user_id: int) -> List[TestGroup]:
    return db.query(TestGroup).filter(TestGroup.user_id == user_id).all()


def update_test_group(db: Session, group_id: int, data: TestGroupCreate, user_id: int) -> TestGroup | None:
    db_group = db.query(TestGroup).filter(TestGroup.id == group_id, TestGroup.user_id == user_id).first()
    
    if not db_group:
        return None
        
    db_group.name = data.name
    
    if data.flashcard_ids is not None:
        cards = db.query(Flashcard).filter(Flashcard.id.in_(data.flashcard_ids)).all()
        db_group.flashcards = cards
    
    db.commit()
    db.refresh(db_group)
    return db_group

def delete_test_group(db: Session, group_id: int, user_id: int) -> bool:
    db_group = db.query(TestGroup).filter(TestGroup.id == group_id, TestGroup.user_id == user_id).first()
    if db_group:
        db.delete(db_group)
        db.commit()
        return True
    return False