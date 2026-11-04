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

def get_subjects(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[Subject]:
    return db.query(Subject).filter(Subject.user_id == user_id).offset(skip).limit(limit).all()

def update_subject(db: Session, subject_id: int, user_id: int, subject_in: SubjectCreate)-> Subject | None:
    db_subject = db.query(Subject).filter(Subject.id == subject_id, Subject.user_id == user_id).first() 
    if not db_subject:
        return None
    db_subject.name = subject_in.name
    db_subject.description = subject_in.description
    db.commit()
    db.refresh(db_subject)
    return db_subject

def delete_subject(db: Session, subject_id: int, user_id: int) -> bool:
    db_subject = db.query(Subject).filter(Subject.id == subject_id, Subject.user_id == user_id).first() 
    if db_subject:
        db.delete(db_subject)
        db.commit()
        return True
    return False