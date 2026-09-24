from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.flashcard import Flashcard
from app.models.tags import Tag
from app.schemas.flashcard  import FlashcardCreate, FlashcardUpdate
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

def review_flashcard(db: Session, flashcard_id: int, result: str, firstMistake: bool) -> Flashcard:
    db_flashcard = db.query(Flashcard).filter(Flashcard.id == flashcard_id).first()
    if not db_flashcard:
        return None

    now = datetime.now()

    db_flashcard.last_result = result

    # Criar condição para is_reviewed não permitir no primeiro erro.
    if not firstMistake:
        db_flashcard.is_reviewed = True
        db_flashcard.last_reviewed_at = now

    # lastLevel = db_flashcard.level

    if result == "acerto":
        db_flashcard.level = min(4, db_flashcard.level + 1) # min(a,b) retorna o menor dos itens - neste caso, menor que 4 ou 4

        
        if db_flashcard.level == 1:
            db_flashcard.next_review_date = now + timedelta(days=1)
        elif db_flashcard.level == 2:
            db_flashcard.next_review_date = now + timedelta(days=7)
        elif db_flashcard.level == 3:
            db_flashcard.next_review_date = now + timedelta(days=15)
        elif db_flashcard.level >= 4:
            db_flashcard.next_review_date = None
        else:
            db_flashcard.next_review_date = None

    elif result == 'erro':
        db_flashcard.level = max(0, db_flashcard.level - 1) # max(a,b) retorna o maior dos itens - neste caso, maior que 0 ou 0

        
        if  db_flashcard.level >= 3:
            db_flashcard.level = 2
            db_flashcard.next_review_date = now + timedelta(days=7)
        elif db_flashcard.level == 1:
            db_flashcard.next_review_date = now + timedelta(days=1)
        else:
            db_flashcard.level = 0
            if firstMistake:
                db_flashcard.next_review_date = now + timedelta(minutes=5)
            else:
                db_flashcard.next_review_date = now + timedelta(minutes=5)


    db.commit()
    db.refresh(db_flashcard)
    return db_flashcard

def update_flashcard(db: Session, flashcard_id: int, flashcard_update: FlashcardUpdate)-> Flashcard | None:
    db_flashcard = db.query(Flashcard).filter(Flashcard.id == flashcard_id).first()
    if not db_flashcard:
        return None

    updated_data = flashcard_update.model_dump(exclude_unset=True)
    for field, value in updated_data.items():
        setattr(db_flashcard, field, value)

    db.commit()
    db.refresh(db_flashcard)
    return db_flashcard

def get_or_create_tag(db: Session, tag_name: str) -> Tag:
    tag = db.query(Tag).filter(Tag.name == tag_name).first()
    if not tag:
        tag = Tag(name=tag_name)
        db.add(tag)
        db.commit()
        db.flush()
    return tag