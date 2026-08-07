# Memorizer - Frontend

Aplicação web desenvolvida para o gerenciamento de estudos e memorização, com foco em arquitetura limpa e integração com API RESTful em Python (FastAPI).

## 🚀 Tecnologias Utilizadas

* **React:** Biblioteca principal para construção de interfaces reativas em modelo SPA.
* **Tailwind CSS:** Framework utilitário para estilização e design responsivo.
* **React Router DOM:** Gerenciamento de rotas do lado do cliente e controle de navegabilidade.
* **Axios:** Cliente HTTP para consumo de endpoints e manipulação de cabeçalhos.
* **Context API:** Gerenciamento do estado global de autenticação e sessão de usuário.

## 📌 Estrutura e Funcionalidades Atual

* **Contexto Global de Autenticação (`AuthContext`):** Persistência de tokens JWT no `localStorage`, injeção automática do cabeçalho `Authorization: Bearer <token>` na instância do Axios e gerenciamento dos estados `user` e `loading`.
* **Tela de Login:** Interface com entradas controladas, *floating labels* estilizados em Tailwind CSS, tratamento de erros de autenticação e bloqueio visual de submissão dupla.
* **Guarda de Rotas (`ProtectedRoute`):** Componente wrapper para interceptação de navegação não autorizada, redirecionando usuários não autenticados diretamente para a tela de login.
