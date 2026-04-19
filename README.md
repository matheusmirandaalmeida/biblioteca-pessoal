# Biblioteca Pessoal

Projeto base Spring Boot usando MongoDB e arquitetura MVC.

## Estrutura do projeto

- `src/main/java/com/example/bibliotecapessoal`
  - `controller` - endpoints REST
  - `service` - regras de negócio
  - `repository` - acesso ao MongoDB
  - `model` - entidades do domínio

- `src/main/resources/application.properties` - configurações do Spring e MongoDB

## Como executar

1. Tenha o MongoDB rodando em `mongodb://localhost:27017`
2. Execute:
   ```bash
   mvn spring-boot:run
   ```
3. A API estará disponível em `http://localhost:8080/api/books`

## Endpoints principais

- `GET /api/books`
- `GET /api/books/{id}`
- `GET /api/books/search?author={nome}`
- `POST /api/books`
- `PUT /api/books/{id}`
- `DELETE /api/books/{id}`
