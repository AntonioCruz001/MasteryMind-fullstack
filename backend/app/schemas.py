from pydantic import BaseModel, Field
from typing import Optional

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