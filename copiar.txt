from fastapi import FastAPI
from app.database import engine, Base
from app import models
from app.routers import subjects
  
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MasteryMind API",
    description="API de gerenciamento de aprendizado e repetição espaçada.",
    version="1.0.0"
)

app.include_router(subjects.router)

@app.get("/")
def health_check():
    """
    Rota de saúde para verificar se a API está online.
    """
    return {"status":"online","message":"MasteryMind API conectada ao MySQL!"}
