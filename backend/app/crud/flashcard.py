from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.flashcard import Flashcard
from app.schemas.flashcard  import FlashcardCreate
from typing import List

def create_flashcard(db: Session, flashcard: FlashcardCreate , subject_id: int) -> Flashcard:
    db_flashcard = Flashcard(
        front=flashcard.front,
        back= flashcard.back,
        subject_id=subject_id
    )
    db.add(db_flashcard)
    db.commit()
    db.refresh(db_flashcard)
    return db_flashcard

def get_flashcards_by_subjects(db: Session, subject_id: int,skip: int = 0, limit: int = 100) -> List[Flashcard]:
    return db.query(Flashcard).filter(Flashcard.subject_id == subject_id).offset(skip).limit(limit).all()

def delete_flashcard(db: Session, flashcard_id: int) -> bool:
    db_flashcard = db.query(Flashcard).filter(Flashcard.id == flashcard_id).first()
    if db_flashcard:
        db.delete(db_flashcard)
        db.commit()
        return True
    return False

def review_flashcard(db: Session, flascard_id: int, result: str) -> Flashcard:
    db_flashcard = db.query(Flashcard).filter(Flashcard.id == flascard_id).first()
    if not db_flashcard:
        return None

    now = datetime.now()
    db_flashcard.is_reviewed = True

    if result == "acerto":
        db_flashcard.points +=1
        db_flashcard.repetitions = min(4, db_flashcard.repetitions + 1)

        if db_flashcard.repetitions == 1:
            db_flashcard.next_review_date = now + timedelta(days=1)
        elif db_flashcard.repetitions == 2:
            db_flashcard.next_review_date = now + timedelta(days=7)
        elif db_flashcard.repetitions == 3:
            db_flashcard.next_review_date = now + timedelta(days=15)
        else:
            db_flashcard.next_review_date = None

    elif result == 'erro':
        db_flashcard.points = max(0, db_flashcard.points - 1)

        if db_flashcard.repetitions >= 3:
            db_flashcard.repetitions = 2
            db_flashcard.next_review_date = now + timedelta(days=7)
        elif db_flashcard.repetitions == 2:
            db_flashcard.repetitions = 1
            db_flashcard.next_review_date = now + timedelta(days=1)
        else:
            db_flashcard.repetitions = 0
            db_flashcard.points = 0
            db_flashcard.next_review_date = now + timedelta(days=1)


    db.commit()
    db.refresh(db_flashcard)
    return db_flashcard