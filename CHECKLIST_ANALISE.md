# Checklist de Avaliação - Projeto Semestral: Gerenciador de Biblioteca Pessoal

Análise baseada nos critérios de entrega do projeto.

## 1. Visão Geral
- [x] **CRUD de livros:** Implementado no Backend (`BookController`, `BookService`, etc.) e Frontend (Páginas de criação, edição, listagem e detalhes).
- [x] **Cadastro de novos usuários:** Implementado (`AuthController` e `UserService` normalizando dados e persistindo no MongoDB).
- [x] **Persistência em MongoDB:** Configurado corretamente no `application.properties` e via `spring-boot-starter-data-mongodb`.
- [x] **Interface funcional e Gerenciamento de sessão:** Frontend React implementando JWT e `AuthContext`.

## 2. Requisitos Técnicos

### Backend
- [x] **Spring Boot (Java):** Utilizando a versão 3.2.6 com Java 17.
- [x] **MongoDB (NoSQL):** Persistência de `User` e `Book` realizada com sucesso.
- [x] **Arquitetura MVC:** Separação clara entre `controller`, `service`, `repository` e `model`.
- [x] **Integração com SonarQube:** Configurado no arquivo de pipeline e no `pom.xml`.
- [x] **CI completo com GitHub Actions:** Pipeline `backend-ci.yml` configurada para testes e análise do SonarCloud no evento de push/PR.
- [x] **Cadastro de Usuários:** Funcional.
- [~] **Testcontainers & VCR:** Implementados (Hoverfly para VCR e Testcontainers para MongoDB nas classes de integração), porém há o uso indevido de Mocks em outros testes.

### Frontend
- [x] **Interface Web Funcional:** Construída com React/Vite.
- [x] **Gerenciamento de Sessão:** Controle de acesso em `AuthContext` e persistência de token.
- [x] **Design Responsivo:** TailwindCSS utilizado para garantir responsividade.
- [x] **Experiência do Usuário (UX):** Tratamento de estados visuais (Loading, alertas de erro).

## 3. Estratégia de Testes
- [x] **Mínimo 80% Cobertura:** Atingido. A cobertura atual no relatório do JaCoCo aponta para mais de 93% das instruções cobertas e a regra do Maven garante mínimo de 80%.
- [x] **Parametrizados (Múltiplos cenários):** Presente em `ValidationExceptionHandlerTest.java` (`@ParameterizedTest`).
- [ ] **Atenção: O uso de Mocks está proibido no projeto final:** **(ALERTA)** Ainda existem Mocks do Mockito em `AuthControllerTest`, `BookControllerTest`, `JwtAuthenticationFilterTest` e `JwtServiceTest`. O requisito exige o uso de Testcontainers e VCR e a eliminação completa do Mockito.
- [ ] **Caixa Preta (E2E / Controller):** Como os Controllers ainda estão sendo testados via Mocks das camadas de serviço, eles **não** estão em testes de Caixa Preta verdadeiros (eles deveriam levantar o contexto com `@SpringBootTest`, rodando no Testcontainers).
- [~] **Caixa Branca (Lógica interna):** Atendido em parte pelas regras internas de UserService e models, mas afetado pela falha acima.
- [~] **Unitários/Integração (Com Testcontainers e VCR):** Atendido em `ExternalBookServiceVcrTest` e `BookServiceIntegrationTest`, porém as demais partes do sistema devem aderir a esse padrão devido à proibição de mocks.

## 4. Documento RTM.md
- [ ] **Documento RTM.md:** Arquivo não encontrado no repositório.
- [ ] **Matriz de Rastreabilidade (100% de cobertura mapeada):** Requisito pendente de criação.
- [ ] **Diagramas UML de Sequência:** Pendente (deve acompanhar o documento `RTM.md` detalhando o fluxo de cada operação).

## 5. Protocolo de Entrega
- [x] **Repositório no GitHub:** Código organizado e versionado.
- [x] **Qualidade Automatizada:** Pipeline configurada com cobertura e SonarQube.
- [x] **Relatório de Cobertura:** Configuração do JaCoCo atende os requisitos. O arquivo é gerado em tempo de build (`jacoco.xml`/`jacoco.csv`).
- [~] **Documentação:** Há um `README.md` detalhado, porém o `RTM.md` exigido ainda falta.

---

## 🚀 Próximos Passos Obrigatórios (Ação Imediata)
1. **Erradicar o uso de Mockito:** Refatorar `AuthControllerTest` e `BookControllerTest` para que utilizem `@SpringBootTest` junto de `MockMvc` ou `TestRestTemplate`, conectando-se no MongoDB do Testcontainers.
2. **Criar o documento `RTM.md`:** Desenhar a Matriz de Rastreabilidade cobrindo todos os requisitos e adicionar os Diagramas de Sequência UML.
3. **Revisão final de Cobertura:** Após refatorar os testes, rodar o JaCoCo para garantir que a cobertura real (caixa preta) continuará acima de 80%.
