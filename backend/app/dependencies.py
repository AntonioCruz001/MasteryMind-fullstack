from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from app import crud, models, database
from app.security import SECRET_KEY, ALGORITHM

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(token: str = Depends(oauth2_scheme),
                     db: Session = Depends(get_db)) -> models.User:
        
    credentials_exception = HTTPException(
            status_code= status.HTTP_401_UNAUTHORIZED,
            detail= "Não foi possível validar as credenciais",
            headers= {"WWW-Authenticate": "Bearer"}
)
    try:
        # Decodifica o token usando a chave secreta
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email : str = payload.get("sub")
        if email is None:
             raise credentials_exception
    except JWTError:
        raise credentials_exception

    # Busca o usuário no banco pelo e-mail contido no token
    user = crud.get_user_by_email(db, email=email)
    if user is None:
        raise credentials_exception
    
    return user