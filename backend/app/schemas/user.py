from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

 # O Pydantic lê os dados brutos em JSON e tenta transformá-los em um 
 # Objeto Schema (DTO) em Python. 
 # Ele verifica se o e-mail é válido e se a senha foi preenchida.
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    created_at: datetime
    is_active: bool

    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str