from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app import crud, security, schemas
from app.database import SessionLocal

router = APIRouter(
    prefix="/auth",
    tags=["Auth (Autenticação)"]
)

def get_db():
    db= SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/token",response_model=schemas.Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    # 1. Busca o usuário no MySQL pelo e-mail
    user = crud.get_user_by_email(db, email= form_data.username)

    # 2. Se o usuário não existir, barra o login
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha incorretos.",
            header={"WWW-Authenticate":"Bearer"},
        )
    
    # 3. Se existir, verifica se a senha bate com o hash criptografado do banco
    if not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha incorretos.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # 4. Se passou em tudo, gera o token guardando o e-mail do usuário no "sub" (subject)
    access_token= security.create_access_token(data={"sub":user.email})

    return {"access_token": access_token, "token_type": "bearer"}