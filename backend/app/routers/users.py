from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import crud, schemas
from app.database import SessionLocal

router = APIRouter(
    prefix="/users",
    tags=["Users (Usuários)"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=schemas.UserRead, status_code=status.HTTP_201_CREATED)
def register_user(user : schemas.UserCreate, db: Session = Depends(get_db)):
    # Verifica se o e-mail já está cadastrado no MySQL
    db_user= crud.get_user_by_email(db, email=user.email)

    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Este e-mail já está cadastrado."
        )
    return crud.create_user(db=db, user=user)