from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from app.models.flashcard import Flashcard
from app.models.tags import Tag
from app.schemas.flashcard  import FlashcardCreate, FlashcardUpdate, FlashcardReset
from app.enums.flashcards import FlashcardStatus
from typing import List
from app import models

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

def get_all_flashcards_by_user(db: Session, user_id: int) -> list[models.Flashcard]:
    return (
        db.query(models.Flashcard)
        .join(models.Subject, models.Flashcard.subject_id == models.Subject.id)
        .filter(models.Subject.user_id == user_id)
        .all()
    )

def delete_flashcard(db: Session, flashcard_id: int) -> bool:
    db_flashcard = db.query(Flashcard).filter(Flashcard.id == flashcard_id).first()
    if db_flashcard:
        db.delete(db_flashcard)
        db.commit()
        return True
    return False

def review_flashcard(db: Session, flashcard_id: int, result: str) -> Flashcard:
    db_flashcard = db.query(Flashcard).filter(Flashcard.id == flashcard_id).first()
    if not db_flashcard:
        return None

    now = datetime.now(timezone.utc)
    db_flashcard.last_result = result
    current_level = db_flashcard.level
    current_status = db_flashcard.status
    db_flashcard.last_reviewed_at = now


    if result == "acerto":
        # min(a,b) retorna o menor dos itens - neste caso, menor que 4 ou 4
        new_level = min(4, db_flashcard.level + 1) 
        db_flashcard.level = new_level
        
        if new_level == 4:
            db_flashcard.status = FlashcardStatus.MASTERED
            db_flashcard.next_review_date = None

        else:

            if new_level == 1:
                db_flashcard.status = FlashcardStatus.REVIEW_1
                db_flashcard.next_review_date = now + timedelta(days=1)
            elif new_level == 2:
                db_flashcard.status = FlashcardStatus.REVIEW_2
                db_flashcard.next_review_date = now + timedelta(days=7)
            elif new_level == 3:
                db_flashcard.status = FlashcardStatus.REVIEW_3
                db_flashcard.next_review_date = now + timedelta(days=7) # 14 dias depois da revisão 1

    elif result == "erro":
            # 1. Fluxo de Cards Novos ou em Aprendizado Inicial (Level 0)
            if current_status == FlashcardStatus.NEW or (current_status == FlashcardStatus.LEARNING and current_level == 0):
                db_flashcard.status = FlashcardStatus.LEARNING
                db_flashcard.level = 0
                db_flashcard.next_review_date = now + timedelta(minutes=5)

            # 2. Fluxo Explícito de Cards Graduados / Em Retenção

            # Level 4 não precisa de logica de erro. Se for resetado volta para 0. 

            elif current_status == FlashcardStatus.REVIEW_3:
                if current_level == 3:
                    db_flashcard.level = 2
                    db_flashcard.status = FlashcardStatus.REVIEW_2
                    db_flashcard.next_review_date = now + timedelta(days=7)
            
            elif current_status == FlashcardStatus.REVIEW_2:
                if current_level == 2:
                    db_flashcard.level = 1
                    db_flashcard.status = FlashcardStatus.REVIEW_1
                    db_flashcard.next_review_date = now + timedelta(days=1)

            elif current_status == FlashcardStatus.REVIEW_1:
                if current_level == 1:
                    db_flashcard.level = 0
                    db_flashcard.status = FlashcardStatus.LEARNING
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

def reset_flashcard(db: Session, flashcard_id: int, subject_id: int, flashcard_reset: FlashcardReset) -> Flashcard | None:
    db_flashcard = db.query(Flashcard).filter(Flashcard.id == flashcard_id, Flashcard.subject_id == subject_id).first()
    if not db_flashcard:
        return None

    # Extrai os dados padrão de reset definidos no schema Pydantic
    reset_data = flashcard_reset.model_dump()
    for field, value in reset_data.items():
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