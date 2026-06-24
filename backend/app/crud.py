from sqlalchemy.orm import Session
from app import models, schemas
from app.security import generate_password_hash


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db : Session):
    return db.query(models.User).all()

def create_user(db: Session, user: schemas.UserCreate):
    # 1. Criptografa a senha
    hashed_pwd = generate_password_hash(user.password)
    # 2. Cria o objeto do SQLAlchemy trocando a senha limpa pelo hash
    db_user = models.User(
        email=user.email,
        hashed_password = hashed_pwd
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return(db_user)

# 1. Create
def create_subject(db: Session, subject: schemas.SubjectCreate, user_id: int):
    """
    Recebe os dados validados do Pydantic, converte em um modelo do 
    SQLAlchemy, salva no MySQL e retorna o objeto criado com o ID.
    """
    # Converte o Schema (Pydantic) em Modelo (SQLAlchemy)
    db_subject = models.Subject(
        name = subject.name,
        description = subject.description,
        user_id= user_id
    )
    db.add(db_subject)    # Coloca o objeto na fila de inserção
    db.commit()           # Salva permanentemente no MySQL
    db.refresh(db_subject)# Atualiza o objeto com o ID gerado pelo banco
    return db_subject

# 2. Read (ler múltiplos)
def get_subjects(db:Session, skip:int = 0, limit:int = 100, user_id: int = None):
    """
    Busca uma lista de assuntos no banco com paginação (skip e limit)
    para evitar travamentos caso o banco tenha milhões de registros.
    """
    return db.query(models.Subject).filter(models.Subject.user_id == user_id).offset(skip).limit(limit).all()

# 3. Read (Um único registro)
def get_subject_by_id(db:Session, subject_id:int):
    """
    Busca um assunto específico pelo ID. Se não encontrar, retorna None.
    """
    return db.query(models.Subject).filter(models.Subject.id == subject_id).first()