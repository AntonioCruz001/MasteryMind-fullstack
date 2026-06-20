from pydantic import BaseModel, Field, EmailStr
from typing import Optional

# UserCreate é instanciado internamente pelo FastApi
class UserCreate(BaseModel):
    email:EmailStr
    password:str
    
# UserRead é instanciado internamente pelo FastApi
class UserRead(BaseModel):
    id:int
    email:EmailStr

    # class Config é lido pelo FastApi para ter autorização para
    # ler os dados vindos do banco de dados e passá-los como JSON
    class Config:
        from_attributes = True



# 1. Esquema base com campos comuns
class SubjectBase(BaseModel):
    name: str = Field(..., min_length=3, max_length=100, description="Nome do assunto")
    description: Optional[str] = Field(None, max_length=255)

# 2. Esquema para CRIAÇÃO: O que o usuário envia
class SubjectCreate(SubjectBase):
    pass

# 3. Esquema para LEITURA: O que o servidor devolve
class SubjectRead(SubjectBase):
    id: int

    class Config:
        # Permite que o Pydantic leia objetos do SQLAlchemy (ORM)
        from_attributes = True


