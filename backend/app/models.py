from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base  # Certifique-se de importar o seu Base correto

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(150), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)

    # Relacionamento: Um usuário pode ter muitos assuntos (Lista de Subjects)
    subjects = relationship("Subject", back_populates="owner", cascade="all, delete-orphan")


class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(String(255))
    # RELACIONAMENTO E CHAVE ESTRANGEIRA (O coração da Etapa 2)
    # Vincula a linha do assunto diretamente ao ID de um usuário na tabela "users"
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # Relacionamento: O assunto pertence a um usuário específico
    # Owner não é palavar reservada
    owner = relationship("User", back_populates="subjects")