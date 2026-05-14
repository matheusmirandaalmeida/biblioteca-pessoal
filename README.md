# Gerenciador de Biblioteca Pessoal

Aplicação completa para cadastro e gerenciamento de livros de uma biblioteca pessoal. Este projeto atende todos os requisitos do Projeto Semestral, focando em qualidade de software, testes automatizados e integração contínua (CI).

![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=java&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.6-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Testcontainers](https://img.shields.io/badge/Testcontainers-2496ED?style=for-the-badge&logo=docker&logoColor=white)

---

## Funcionalidades

- **Gerenciamento de Usuários:** Cadastro seguro de usuários com criptografia de senha e autenticação via JWT.
- **Gestão da Biblioteca Pessoal:** Permite realizar o CRUD (Criar, Ler, Atualizar, Excluir) de livros com isolamento total de dados por usuário.
- **Pesquisa Inteligente:** Pesquisa de livros integrando internamente os livros do usuário, e externamente buscando recomendações através da Open Library API.
- **Interface Intuitiva:** Interface responsiva e moderna construída com React e TailwindCSS.

## Stack Tecnológica

### Backend
- **Framework:** Spring Boot 3.2.6 (Java 17)
- **Banco de Dados:** MongoDB (NoSQL)
- **Segurança:** Spring Security com JSON Web Tokens (JWT)
- **Arquitetura:** Padrão MVC (Controller, Service, Repository, Model, DTO)

### Frontend
- **Framework:** React estruturado pelo Vite
- **Estilização:** Tailwind CSS (Design Responsivo e UI moderna)
- **Requisições:** Axios (Com interceptor para os JWTs)

### Qualidade e Testes (Estratégia Caixa Preta e E2E)
- **Testcontainers:** Testes de integração diretos com o banco MongoDB, sem biblioteca de mock nos testes do projeto.
- **VCR (Hoverfly):** Gravação e reprodução das chamadas para a API do Open Library.
- **Frontend:** Testes automatizados com **Vitest**, **jsdom** e **Testing Library** via `npm run test`.
- **Cobertura de Código:** Cobertura avaliada por **JaCoCo**, com regra restrita de falha caso não atinja **>80%**.
- **Análise Estática:** Integração contínua e Quality Gate realizados por **SonarQube/SonarCloud**.
- **CI/CD:** Pipeline robusta rodando no **GitHub Actions**.

---

## Rastreabilidade e Documentação

Para visualizar o mapeamento completo dos testes que garantem a integridade da aplicação e seus **Diagramas UML de Sequência**, acesse a matriz através do arquivo:
**[RTM.md (Requirements Traceability Matrix)](RTM.md)**

---

## Como Executar o Projeto

### Pré-requisitos
Certifique-se de ter instalado em sua máquina:
- Java 17 (JDK)
- Maven
- Node.js (v18+) e NPM
- Docker (Obrigatório para executar a base de Testcontainers e recomendado para subir a base local)

### Rodando o Backend

1. Certifique-se de ter um MongoDB em execução local (seja instalado na máquina ou via Docker). Exemplo de comando Docker:
   ```bash
   docker run -d -p 27017:27017 --name mongo-biblioteca mongo:latest
   ```
2. Abra um terminal e navegue até a pasta do backend:
   ```bash
   cd backend
   ```
3. Execute a aplicação usando Maven:
   ```bash
   mvn spring-boot:run
   ```
A API backend iniciará em: `http://localhost:8080/`

### Rodando o Frontend

1. Abra um segundo terminal e navegue até a pasta do frontend:
   ```bash
   cd frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
A interface do frontend iniciará em: `http://localhost:5173/`

---

## Rodando os Testes e Gerando Relatório de Cobertura

Os testes do backend garantem a estabilidade seguindo os padrões do **Testcontainers** para testes de contexto limpo em banco MongoDB real, e VCR para API.

Para rodar todos os testes, gerar o relatório do JaCoCo e aplicar a regra mínima de 80%:

```bash
cd backend
mvn clean verify
```

O relatório de cobertura HTML da aplicação será gerado automaticamente em:
`backend/target/site/jacoco/index.html`. 
O comando falha automaticamente se a cobertura de instruções ficar abaixo de 80%.

---
*Este projeto é um esforço avaliativo acadêmico. Verifique também o arquivo `CHECKLIST_ANALISE.md` na raiz para o balanço de cumprimento das diretrizes do projeto.*
