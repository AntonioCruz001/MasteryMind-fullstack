🧠 MasteryMind — Sistema de Repetição Espaçada & Flashcards

O MasteryMind é uma aplicação web Full-Stack projetada para otimizar o aprendizado e a memorização de longo prazo através do método de Repetição Espaçada (Spaced Repetition System - SRS). A ferramenta permite que usuários criem categorias de estudo, adicionem flashcards interativos e realizem sessões de revisão guiadas por algoritmos de intervalo programado.
🚀 Funcionalidades Principais
🔒 Autenticação & Segurança

    Cadastro e Login de Usuários: Sistema de criação de conta com validação de dados em tempo real.

    Segurança de Senhas: Armazenamento seguro de senhas utilizando hash Argon2 e Bcrypt via pwdlib.

    Autenticação JWT: Sessões autenticadas via JSON Web Tokens (Bearer Token).

    Proteção de Rotas & Sessão: Proteção no Frontend (ProtectedRoute) e interceptor HTTP (Axios) com tratamento de expiração de token e redirecionamento automático para a tela de login.

📚 Gerenciamento de Assuntos (Subjects)

    Categorização de estudos por assuntos/disciplinas (ex: Informática, Direito, Inglês).

    CRUD completo associado isoladamente ao usuário logado.

🎴 Módulo de Flashcards & Repetição Espaçada (SRS)

    Criação e Organização: Flashcards interativos contendo Pergunta (Frente) e Resposta (Verso).

    Efeito Flip Interativo: Animação/Alternância dinâmica de leitura da pergunta/resposta.

    Algoritmo de Revisão:

        Avaliação por feedback de desempenho (Acertei / Fácil vs Errei / Difícil).

        Atualização dinâmica de pontuação (points), repetições (repetitions) e cálculo do próximo ciclo de estudo (next_review_date de 1, 7 a 15 dias).

        Marcação de status de revisão (is_reviewed) com reorganização da fila em tempo real (cards pendentes no topo e revisados ao final).

🛠️ Tecnologias Utilizadas
Backend

    Linguagem: Python 3.10+

    Framework Web: FastAPI

    Banco de Dados: MySQL

    ORM & Migrações: SQLAlchemy 2.0 & Alembic

    Autenticação & Hash: PyJWT, Pwdlib (Argon2 / Bcrypt)

    Validação de Dados: Pydantic v2

Frontend

    Biblioteca Principal: React 18

    Ferramenta de Build: Vite

    Estilização: Tailwind CSS v4

    Roteamento: React Router DOM v6

    Comunicação HTTP: Axios (com suporte a Interceptors)