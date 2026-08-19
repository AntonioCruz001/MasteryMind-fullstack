from sqlalchemy.orm import Session
from app.models.subject import Subject 
from app.schemas.subjects import SubjectCreate
from typing import List

def create_subject(db:Session, subject: SubjectCreate, user_id: int) -> Subject:
    db_subject = Subject(
        name=subject.name,
        description=subject.description,
        user_id=user_id
    )
    db.add(db_subject)
    db.commit()
    db.refresh(db_subject)
    return db_subject

def get_subjects(db:Session, user_id: int, skip: int = 0, limit: int = 100) -> List[Subject] :
    return db.query(Subject).filter(Subject.user_id == user_id).offset(skip).limit(limit).all()
