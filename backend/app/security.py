from datetime import datetime, timedelta, timezone
from jose import jwt
from passlib.context import CryptContext

# Configurações do JWT (Em produção, mudar a SECRET_KEY para algo seguro!)
SECRET_KEY = "chave_secreta_longa_e_segura"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 # 1 hora

# Configura o passlib para usar o algoritmo bcrypt para hash de senhas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def generate_password_hash(password: str) -> str:
    """Transforma a senha limpa em um hash criptografado para salvar no banco."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Compara a senha digitada no login com o hash salvo no banco."""
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data:dict) -> str:
    """Gera o token JWT assinado digitalmente pela API."""
    to_encode = data.copy()

    # Define o tempo de expiração do token (Tempo atual + 60 minutos)
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    # Adiciona a expiração dentro dos dados do token (payload)
    to_encode.update({"exp":expire})

    # Cria e assina o JWT
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt