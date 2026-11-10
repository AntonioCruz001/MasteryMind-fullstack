from sqlalchemy.orm import Session
from app.models.test_result import TestResult
from app.schemas.test_result import TestResultCreate
from typing import List

def create_test_result (db: Session, data: TestResultCreate, test_group_id: int, user_id: int) -> TestResultCreate:
    db_result = TestResult(
        test_group_id = test_group_id,
        user_id = user_id,
        correct_count = data.correct_count,
        total_cards = data.total_cards,
        score_percentage = data.score_percentage)

    db.add(db_result)
    db.commit()
    db.refresh(db_result)
    return db_result

def get_test_results_by_group(db: Session, test_group_id: int, user_id: int) -> List[TestResult]:
    
    return db.query(TestResult).filter(TestResult.test_group_id == test_group_id, TestResult.user_id == user_id).order_by(TestResult.created_at.desc()).all()