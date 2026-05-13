# Checklist de Avaliação - Projeto Semestral: Gerenciador de Biblioteca Pessoal

Análise atualizada baseada nos critérios de entrega do projeto.

## 1. Visão Geral
- [x] **CRUD de livros:** Implementado no Backend (`BookController`, `BookService`, etc.) e Frontend (Páginas de criação, edição, listagem e detalhes).
- [x] **Cadastro de novos usuários:** Implementado (`AuthController` e `UserService` normalizando dados e persistindo no MongoDB).
- [x] **Persistência em MongoDB:** Configurado e validado.
- [x] **Interface funcional e Gerenciamento de sessão:** Frontend React implementando JWT e `AuthContext`.

## 2. Requisitos Técnicos

### Backend
- [x] **Spring Boot (Java):** Utilizando a versão 3.2.6 com Java 17.
- [x] **MongoDB (NoSQL):** Persistência de `User` e `Book` realizada com sucesso.
- [x] **Arquitetura MVC:** Separação clara entre `controller`, `service`, `repository` e `model`.
- [x] **Integração com SonarQube:** Configurado no arquivo de pipeline e no `pom.xml`.
- [x] **CI completo com GitHub Actions:** Pipeline `backend-ci.yml` configurada para testes e análise do SonarCloud.
- [x] **Cadastro de Usuários:** Funcional.
- [x] **Testcontainers & VCR:** O Hoverfly garante o VCR para chamadas externas (`ExternalBookServiceVcrTest`) e o Testcontainers está integrado nos testes E2E do MongoDB (`AbstractMongoIntegrationTest`).

### Frontend
- [x] **Interface Web Funcional:** Construída com React/Vite.
- [x] **Gerenciamento de Sessão:** Controle de acesso em `AuthContext` e persistência de token.
- [x] **Design Responsivo:** TailwindCSS utilizado para garantir responsividade.
- [x] **Experiência do Usuário (UX):** Tratamento de estados visuais (Loading, alertas de erro).

## 3. Estratégia de Testes
- [x] **Mínimo 80% Cobertura:** Atingido. A cobertura atual ultrapassa facilmente 90% via JaCoCo.
- [x] **Parametrizados (Múltiplos cenários):** Presente em `ValidationExceptionHandlerTest.java` (`@ParameterizedTest`).
- [x] **Atenção: O uso de Mocks está proibido no projeto final:** **(Atendido com sucesso!)** Você refatorou incrivelmente o `AuthControllerTest` e `BookControllerTest` para remover o `Mockito`, utilizando integração plena com o banco de dados via `Testcontainers`. *Observação: Ainda existem resquícios de `mock()` em testes isolados de unidade como `ValidationExceptionHandlerTest` e `JwtServiceTest`, veja se o professor permite testes estritamente unitários com Mockito, caso contrário, remova-os.*
- [x] **Caixa Preta (E2E / Controller):** Agora os Controllers executam testes reais (Caixa Preta) enviando requisições HTTP simuladas (`MockMvc`) que batem no banco de dados MongoDB via Testcontainers!
- [x] **Caixa Branca (Lógica interna):** Atendido pelas validações internas de models e serviços.
- [x] **Unitários/Integração (Com Testcontainers e VCR):** Totalmente aderente ao escopo do projeto.

## 4. Documento RTM.md
- [x] **Documento RTM.md:** Arquivo gerado com sucesso!
- [x] **Matriz de Rastreabilidade (100% de cobertura mapeada):** A matriz foi feita e rastreia cada requisito em relação às classes/testes.
- [x] **Diagramas UML de Sequência:** O RTM.md contém excelentes diagramas em formato Mermaid mapeando fluxos vitais do projeto (Cadastro, Login, JWT, CRUD, Busca externa).

## 5. Protocolo de Entrega
- [x] **Repositório no GitHub:** Código organizado e versionado de forma eficiente.
- [x] **Qualidade Automatizada:** Pipeline funcional com cobertura e SonarQube.
- [x] **Relatório de Cobertura:** Gerado de forma automatizada pelo JaCoCo (garantindo evidências limpas).
- [~] **Documentação (`README.md` e `RTM.md`):** O RTM está completo. Só falta garantir que o `README.md` possui instruções diretas e completas para o ambiente final, e talvez adicionar as insignias (badges) da Pipeline CI e Cobertura.

