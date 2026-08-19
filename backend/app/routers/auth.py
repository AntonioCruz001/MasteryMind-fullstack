from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
# from app.crud import crud
# from app import crud
from app.crud import user as user_crud
from app.core import security

from fastapi.security import OAuth2PasswordRequestForm
from app.database import SessionLocal, get_db
from app.schemas.user import UserLogin,Token

router = APIRouter(
    prefix="/auth",
    tags=["Auth (Autenticação)"]
)


@router.post("/login",response_model=Token)
def login_for_access_token(
    # form_data: OAuth2PasswordRequestForm = Depends(),

    # UserLogin (parâmetro aqui) é um schema para validar o objeto vindo do AuthContext (Axios)
    credentials: UserLogin,
    db: Session = Depends(get_db)
):
    # 1. Busca o usuário no MySQL pelo e-mail
    user = user_crud.get_user_by_email(db, email= credentials.email)
    
    # 2. Se o usuário não existir, barra o login
    if not user or not security.verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha incorretos.",
            headers={"WWW-Authenticate":"Bearer"},
        )
    
    
    # 4. Se passou em tudo, gera o token guardando o e-mail do usuário no "sub" (subject)
    access_token= security.create_access_token(data={"sub":user.email})

    return {"access_token": access_token, "token_type": "bearer"}