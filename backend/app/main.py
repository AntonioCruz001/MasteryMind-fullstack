from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware 
from app.database import engine, Base
from app import models
from app.routers import subjects,users, auth
  
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MasteryMind API",
    description="API de gerenciamento de aprendizado e repetição espaçada.",
    version="1.0.0"
)

origins = [
    "http://localhost:3000",      # Endereço padrão do React / Next.js
    "http://127.0.0.1:3000",      # IP correspondente ao localhost
    "http://localhost:5173",      # Endereço padrão do Vite (Vue / React moderno)    
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # 1. Libera os sites da sua lista
    allow_credentials=True,      # 2. Permite o envio de cookies/autenticação
    allow_methods=["*"],         # 3. Permite todos os métodos HTTP (GET, POST, PUT, DELETE)
    allow_headers=["*"],         # 4. Permite todos os cabeçalhos HTTP
)

app.include_router(auth.router)
app.include_router(subjects.router)
app.include_router(users.router)

@app.get("/")
def health_check():
    """
    Rota de saúde para verificar se a API está online.
    """
    return {"status":"online","message":"MasteryMind API conectada ao MySQL!"}
