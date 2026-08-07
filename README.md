# CONTEXTO DO PROJETO E ESPECIFICAÇÃO TÉCNICA

**Projeto:** Memorizer-MasteryMind (Plataforma Fullstack de Gestão de Estudos)

## 1. Tech Stack
* **Frontend:** React (Vite), Tailwind CSS, React Router DOM, Context API, Axios (Deploy: Vercel).
* **Backend:** Python, FastAPI, Pydantic v2, SQLAlchemy 2.0, Alembic (Deploy: Render).
* **Banco de Dados:** MySQL (Relacional).
* **Autenticação:** JWT (JSON Web Tokens) via OAuth2 com Bearer Token.

## 2. Diretrizes de Arquitetura e Engenharia
* **Estrutura de Camadas (Backend):** Separação estrita entre `routers` (endpoints), `schemas` (DTOs/Pydantic), `models` (entidades SQLAlchemy) e `services/crud` (regras de negócio).
* **SQLAlchemy 2.0:** Uso exclusivo do padrão moderno com `Mapped[]`, `mapped_column()` e consultas via `select()`.
* **Pydantic v2:** Validação rigorosa de dados de entrada/saída com `ConfigDict(from_attributes=True)`.
* **Segurança:** Criptografia de senhas (`bcrypt`/`passlib`) e injeção de dependência (`Depends`) para validação de sessão.

## 3. Regras de Negócio e Domínio
* Gestão de usuários com isolamento de dados (cada usuário acessa apenas seus próprios registros).
* Organização de estudos em Assuntos (*Subjects*), Tópicos de estudo e Históricos de revisão.

## 4. Estado Atual do Desenvolvimento
* **Frontend:** `AuthContext`, tela de `Login` (estilizada com Tailwind CSS) e `ProtectedRoute` já implementados.
* **Próximos Passos:** Modelagem do banco MySQL via SQLAlchemy 2.0, criação das rotas no FastAPI e integração com o frontend.
