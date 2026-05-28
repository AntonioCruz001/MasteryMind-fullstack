from sqlalchemy.orm import Session
from app import models, schemas

# 1. Create
def create_subject(db: Session, subject: schemas.SubjectCreate):
    """
    Recebe os dados validados do Pydantic, converte em um modelo do 
    SQLAlchemy, salva no MySQL e retorna o objeto criado com o ID.
    """
    # Converte o Schema (Pydantic) em Modelo (SQLAlchemy)
    db_subject = models.Subject(
        name = subject.name,
        description = subject.description
    )
    db.add(db_subject)    # Coloca o objeto na fila de inserção
    db.commit()           # Salva permanentemente no MySQL
    db.refresh(db_subject)# Atualiza o objeto com o ID gerado pelo banco
    return db_subject

# 2. Read (ler múltiplos)
def get_subjects(db:Session, skip:int = 0, limit:int = 100):
    """
    Busca uma lista de assuntos no banco com paginação (skip e limit)
    para evitar travamentos caso o banco tenha milhões de registros.
    """
    return db.query(models.Subject).offset(skip).limit(limit).all()

# 3. Read (Um único registro)
def get_subject_by_id(db:Session, subject_id:int):
    """
    Busca um assunto específico pelo ID. Se não encontrar, retorna None.
    """
    return db.query(models.Subject).filter(models.Subject.id == subject_id).first()