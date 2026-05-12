# Frontend - Gerenciador de Biblioteca Pessoal

Este é o frontend da aplicação de gerenciamento de biblioteca, construído com React e Vite. Ele se comunica com o backend em Spring Boot para fornecer as funcionalidades reais de cadastro, login e CRUD de livros.

## Pré-requisitos

- Node.js (versão 18+ recomendada)
- npm ou yarn

## Instalação

1. Acesse o diretório do frontend:
   ```bash
   cd frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

## Configuração de Ambiente

Para o frontend funcionar corretamente e comunicar-se com o backend real, você deve criar um arquivo `.env` na raiz da pasta `frontend`.

1. Copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```

2. Verifique o conteúdo do `.env` criado. Ele deve conter algo como:
   ```env
   VITE_API_URL=http://localhost:8080
   VITE_PREVIEW_MODE=false
   VITE_BOOKS_PREVIEW_MODE=false
   ```
   *Nota: O `VITE_API_URL` deve apontar para o endereço do seu backend rodando (normalmente em `http://localhost:8080`). As variáveis `PREVIEW_MODE` devem estar como `false` para desativar o comportamento de testes/mock.*

## Executando o Projeto

1. Certifique-se de que seu backend (Spring Boot + MongoDB) está rodando.
2. Inicie o servidor de desenvolvimento do Vite:
   ```bash
   npm run dev
   ```
3. O aplicativo estará disponível no navegador, geralmente no endereço `http://localhost:5173`.

## Funcionalidades Prontas

- Cadastro e Autenticação de Usuário (via JWT integrado ao backend).
- Dashboard com resumo de livros.
- Listagem completa da sua biblioteca de livros.
- Busca inteligente e adição de novos livros, tanto integrados à APIs externas quanto via preenchimento manual.
- Visualização e edição dos detalhes de um livro.
- Exclusão de livros da biblioteca (com fluxo de confirmação e exclusão real).
