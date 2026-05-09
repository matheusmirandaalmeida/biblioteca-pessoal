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

# Checklist de aderência ao Projeto Semestral — Gerenciador de Biblioteca Pessoal

Análise realizada sobre a versão atual do repositório na branch `work`, commit `da726a5`, em 2026-05-08.

Legenda:
- `[x]` Atendido na versão atual.
- `[~]` Parcialmente atendido; existe implementação inicial, mas faltam ajustes/evidências.
- `[ ]` Não identificado no repositório atual.

## 1. Visão geral do produto

| Status | Item solicitado | Evidência encontrada | Próximo passo recomendado |
| --- | --- | --- | --- |
| [x] | Aplicação para cadastro e gerenciamento de livros | Há backend REST para livros e telas de listagem, cadastro, edição, detalhes e exclusão no frontend. | Completar testes e documentação desses fluxos. |
| [x] | CRUD de livros | `BookController` expõe endpoints de listar, buscar por ID, criar, atualizar e excluir livros. | Validar o CRUD com testes de controller/E2E usando banco real via Testcontainers. |
| [x] | Cadastro de novos usuários | `AuthController` possui endpoint de cadastro e `UserService` normaliza email, valida duplicidade e salva usuário. | Cobrir cadastro com testes de sucesso, validação e duplicidade. |
| [x] | Autenticação de usuários | Há endpoints de login/me/logout, JWT, filtro de autenticação e proteção de rotas no frontend. | Avaliar regras de autorização por usuário nos livros. |
| [x] | Biblioteca pessoal por usuário | O modelo `Book` possui `userId`, mas os endpoints de livros usam `findAll`, `findById`, `save` e `deleteById` sem vincular/filtrar pelo usuário autenticado. | Ajustar controller/service para usar `@AuthenticationPrincipal`, atribuir `userId` no cadastro e impedir acesso a livros de outros usuários. |

## 2. Backend

| Status | Requisito técnico | Evidência encontrada | O que falta fazer |
| --- | --- | --- | --- |
| [x] | Spring Boot (Java) | `backend/pom.xml` usa Spring Boot 3.2.6 e Java 17. | Manter versões documentadas no README. |
| [x] | MongoDB (NoSQL) | Dependência `spring-boot-starter-data-mongodb` e `application.properties` apontando para MongoDB local. | Adicionar `docker-compose.yml` ou instrução clara para subir MongoDB. |
| [x] | Arquitetura MVC | Pacotes `controller`, `service`, `repository`, `model` e `dto` estão separados. | Padronizar DTOs de entrada/saída de livros para não expor entidade diretamente. |
| [x] | Cadastro de usuários | Implementado com `RegisterRequest`, `User`, `UserRepository` e `UserService`. | Criar testes de integração com MongoDB real. |
| [x] | Login e sessão via token | Implementado com JWT stateless, `JwtAuthenticationFilter` e `SecurityConfig`. | Documentar fluxo e variáveis `JWT_SECRET`/expiração. |
| [~] | Proteção dos endpoints | `SecurityConfig` exige autenticação para qualquer rota exceto cadastro/login. | Corrigir isolamento de dados por usuário nos endpoints de livros. |
| [~] | Validações de entrada | Há validações Jakarta em usuário/livro e handler de exceções. | Cobrir cenários inválidos com testes parametrizados e incluir validação de ano/status. |
| [~] | API externa com VCR | Existe integração com Open Library em `ExternalBookService`. | Adicionar dependência/configuração de VCR para gravar/reproduzir chamadas externas nos testes. |
| [~] | Testcontainers | Não há dependência nem configuração de Testcontainers no `pom.xml`. | Adicionar Testcontainers MongoDB e usar nos testes de integração. |
| [ ] | JaCoCo / relatório de cobertura | Não há plugin JaCoCo no `pom.xml`. | Configurar `jacoco-maven-plugin`, gerar relatório e gate mínimo de 80%. |
| [ ] | SonarQube | Não há configuração de Sonar no `pom.xml` ou pipeline. | Configurar análise SonarQube/SonarCloud no Maven e no CI. |

## 3. Frontend

| Status | Requisito técnico | Evidência encontrada | O que falta fazer |
| --- | --- | --- | --- |
| [x] | Interface web funcional | Projeto React/Vite com páginas de login, cadastro, dashboard e livros. | Incluir instruções completas de execução no README raiz. |
| [x] | Gerenciamento de sessão | `AuthContext` mantém usuário, token em `localStorage`, `getMe`, login, cadastro e logout; `ProtectedRoute` bloqueia rotas privadas. | Avaliar expiração/renovação de sessão e mensagens de erro globais. |
| [x] | Design responsivo | Componentes usam classes responsivas Tailwind, incluindo grids e layout lateral. | Testar em telas pequenas e documentar evidência visual se solicitado. |
| [~] | UX | Existem componentes reutilizáveis, loading, mensagens de erro e navegação protegida. | Revisar textos sem acentuação, feedback de exclusão/sucesso e estados vazios. |
| [~] | Integração real com backend | Serviços `authService` e `bookService` usam Axios contra `VITE_API_URL`; há modo preview com mocks. | Garantir que modo mock não seja usado como substituto nos testes finais. |
| [ ] | Testes frontend | Não há scripts/dependências de teste no `package.json`. | Adicionar testes de UI/E2E ou justificar cobertura via backend + E2E. |

## 4. Estratégia de testes solicitada

| Status | Requisito | Evidência encontrada | O que falta fazer |
| --- | --- | --- | --- |
| [ ] | Cobertura mínima de 80% | Não há configuração de JaCoCo nem relatório versionado. | Configurar JaCoCo, executar `mvn test jacoco:report` e publicar evidência. |
| [ ] | Sem mocks no projeto final | Existem mocks no frontend para modo preview e o backend ainda não usa Testcontainers/VCR. | Remover/limitar mocks dos testes finais e garantir persistência real em Testcontainers. |
| [ ] | Testes unitários/integração | Só existe o teste padrão de contexto da aplicação. | Criar testes para serviços, controllers, repositórios e autenticação. |
| [ ] | Testes com Testcontainers | Não identificado. | Criar base de teste com container MongoDB. |
| [ ] | Testes com VCR | Não identificado. | Gravar/reproduzir chamadas da Open Library em testes do `ExternalBookService`. |
| [ ] | Testes parametrizados | Não identificado. | Criar testes parametrizados para validações de usuário/livro e cenários de busca/status. |
| [ ] | Caixa branca | Não identificado. | Testar regras internas como normalização de email, senha inválida e mapeamento da API externa. |
| [ ] | Caixa preta / E2E / Controller | Não identificado. | Usar `MockMvc`/`WebTestClient` sem mocks e/ou E2E no frontend contra ambiente real. |

## 5. Documentação e rastreabilidade

| Status | Item solicitado | Evidência encontrada | O que falta fazer |
| --- | --- | --- | --- |
| [~] | README detalhado | Existe README raiz, mas ele ainda descreve apenas execução básica do backend e endpoints de livros. | Atualizar com arquitetura, requisitos, variáveis, execução backend/frontend, testes, cobertura e CI. |
| [ ] | `RTM.md` | Arquivo não existe no repositório atual. | Criar matriz rastreando cada requisito funcional aos testes. |
| [ ] | Diagramas UML de sequência no RTM | Não identificado. | Adicionar um diagrama por requisito funcional, preferencialmente em Mermaid. |
| [ ] | Relatório de cobertura | Não identificado. | Gerar e anexar/registrar evidência do JaCoCo. |
| [ ] | Histórico de commits | O repositório possui histórico de commits. | Manter commits pequenos e descritivos até a entrega. |

## 6. CI/CD e qualidade automatizada

| Status | Item solicitado | Evidência encontrada | O que falta fazer |
| --- | --- | --- | --- |
| [ ] | GitHub Actions completo | Não há workflow em `.github/workflows`. | Criar pipeline com build/test backend, lint/build frontend, JaCoCo e Sonar. |
| [ ] | Integração SonarQube | Não identificado. | Configurar secrets e etapa Sonar no GitHub Actions. |
| [ ] | Validações automáticas do repositório | Não identificado. | Incluir checks obrigatórios: `mvn test`, `npm run lint`, `npm run build`, cobertura e análise estática. |

## 7. Prioridade sugerida até a entrega

1. Corrigir isolamento da biblioteca por usuário autenticado nos endpoints de livros.
2. Configurar Testcontainers MongoDB e substituir testes frágeis por integração real.
3. Configurar JaCoCo com regra de cobertura mínima de 80%.
4. Criar testes de controller/E2E para autenticação e CRUD de livros.
5. Adicionar VCR para a integração com Open Library.
6. Criar `RTM.md` com matriz requisito → teste e diagramas UML de sequência.
7. Configurar GitHub Actions com backend, frontend, cobertura e SonarQube.
8. Atualizar README com execução completa, variáveis, testes e evidências de qualidade.
9. Revisar UX, acentuação dos textos e responsividade final.
10. Gerar relatório final de cobertura e anexar evidência para apresentação.
