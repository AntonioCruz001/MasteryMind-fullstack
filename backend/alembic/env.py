from logging.config import fileConfig
import sys
import os
from pathlib import Path
from logging.config import fileConfig
from dotenv import load_dotenv

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context

# Importe a Base declarativa e seus modelos para a autogeração de migrações
from app.database import Base  # Importa a Base declarativa do seu projeto
from app.models.user import User  # Garante que os modelos sejam carregados
from app.models.subject import Subject

load_dotenv()

# Objeto de configuração do Alembic (acessa os valores do alembic.ini)
config = context.config

# Injeta a DATABASE_URL do arquivo .env no sqlalchemy.url da configuração do Alembic
if os.getenv("DATABASE_URL"):
    config.set_main_option("sqlalchemy.url", os.getenv("DATABASE_URL"))

# Configuração de logs do Python
if config.config_file_name is not None:
    try:
        fileConfig(config.config_file_name)
    except Exception:
        pass

# Define o metadata para suporte a 'autogenerate'
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Roda migrações no modo 'offline'."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Roda migrações no modo 'online'."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()