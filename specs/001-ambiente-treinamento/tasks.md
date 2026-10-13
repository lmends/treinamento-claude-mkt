---
description: "Task list for Ambiente de Treinamento"
---

# Tasks: Ambiente de Treinamento Interativo "Claude para Marketing"

**Input**: Design documents from `/specs/001-ambiente-treinamento/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/content-schema.md

**Tests**: E2E com Playwright (critérios de aceite do PRD exigem verificação em 375/1440 px,
teclado, persistência e rede).

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

- [ ] T001 Criar estrutura `index.html`, `css/`, `js/`, `tests/`, `.nojekyll` na raiz
- [ ] T002 [P] Criar `tests/package.json` e `tests/playwright.config.js` (file://, 1440 e 375 px)

## Phase 2: Foundational

- [ ] T003 Casca da página em `index.html` (topo, barra lateral, main, painel de artefato, toast, skip link)
- [ ] T004 [P] Tokens de design claro/escuro, tipografia, foco visível e reduced-motion em `css/styles.css`
- [ ] T005 Estado + persistência (localStorage com try/catch, hash da URL) em `js/app.js`
- [ ] T006 Mini-markdown seguro (escape + negrito/itálico/listas/títulos/quebras) em `js/app.js`
- [ ] T007 Registro de renderizadores por tipo de bloco + blocos `texto`, `destaque`, `cards`, `visao-geral` em `js/app.js`
- [ ] T008 Utilitário de cópia (Clipboard API + fallback) e toast em `js/app.js`

## Phase 3: User Story 1 - Apresentação módulo a módulo (P1) 🎯 MVP

**Goal**: navegar os 7 módulos e avançar conversas por clique/teclado.
**Independent Test**: percorrer tudo só com teclado; recarregar mantém o módulo.

- [ ] T009 [US1] Barra lateral de módulos, Anterior/Próximo, "Módulo X de 7" e barra de progresso em `js/app.js`
- [ ] T010 [US1] Componente de chat: digitação no campo, "pensando", streaming por nós de texto, token de cancelamento em `js/app.js`
- [ ] T011 [US1] Controles Avançar / Pular animação / Reiniciar conversa e estado "Fim da conversa" em `js/app.js`
- [ ] T012 [US1] Teclado global (setas, espaço/Enter) com lista de avançáveis e blur pós-clique em `js/app.js`
- [ ] T013 [P] [US1] Estilos de layout, sidebar/drawer, chat e bolhas em `css/styles.css`
- [ ] T014 [US1] Conteúdo dos módulos 1–7 (texto, cards e conversas) em `js/content.js`
- [ ] T015 [US1] Testes de navegação, teclado e persistência em `tests/app.spec.js`

## Phase 4: User Story 2 - Comparativos (P1)

- [ ] T016 [US2] Bloco `comparativo` (duas colunas; abas ARIA em telas estreitas; troca automática de aba ao avançar) em `js/app.js`
- [ ] T017 [P] [US2] Estilos do comparativo e das abas em `css/styles.css`
- [ ] T018 [US2] Teste do comparativo em 1440 e 375 px em `tests/app.spec.js`

## Phase 5: User Story 3 - Artefatos, Projeto e Skill (P2)

- [ ] T019 [US3] Painel de artefato (coluna ≥1100 px, diálogo sobreposto abaixo, Esc, foco, abas por artefato) em `js/app.js`
- [ ] T020 [US3] Renderizadores `carrossel` (slides quadrados, setas, contador, teclado), `post` e `email` + "Copiar texto" em `js/app.js`
- [ ] T021 [US3] Blocos `projeto`, `skill` e `tabela` e selo animado "Skill em uso" na mensagem em `js/app.js`
- [ ] T022 [P] [US3] Estilos de artefatos, projeto, skill, selo e tabela responsiva em `css/styles.css`
- [ ] T023 [US3] Testes de artefatos, carrossel, cópia e selo em `tests/app.spec.js`

## Phase 6: User Story 4 - Modo estudo (P2)

- [ ] T024 [US4] Alternância de modo no topo (aria-pressed, persistida); render completo + notas no estudo em `js/app.js`
- [ ] T025 [US4] Notas do instrutor (ícone "i" com `aria-expanded`) em `js/app.js` e `css/styles.css`
- [ ] T026 [US4] Teste do modo estudo em `tests/app.spec.js`

## Phase 7: User Story 5 - Chamada para prática (P3)

- [ ] T027 [US5] Blocos `pratica` e `links` (Copiar prompt, link em nova aba) em `js/app.js` e `css/styles.css`

## Phase 8: User Story 6 - Tour da interface (P3)

- [ ] T028 [US6] Bloco `tour` com interface simulada, destaque + balão, voltar/recomeçar, versão estática no estudo em `js/app.js` e `css/styles.css`

## Phase 9: Polish

- [ ] T029 [P] `README.md`: rodar local, editar `content.js` (exemplos), publicar no GitHub Pages
- [ ] T030 Testes transversais: sem rolagem horizontal (375/1440), zero rede, tema escuro, reduced-motion, console sem erros em `tests/app.spec.js`
- [ ] T031 Validação visual com capturas (desktop, 375 px, escuro) e ajustes finais
- [ ] T032 Varredura da constituição: nenhum texto de conteúdo em `app.js`, nenhum logo/paleta Anthropic, nenhuma credencial

## Dependencies & Execution Order

- Setup → Foundational → US1 (MVP) → US2 → US3 → US4 → US5/US6 → Polish.
- US2–US6 dependem do componente de chat (T010) e do registro de blocos (T007).
- Tarefas [P] tocam arquivos diferentes (CSS/tests) e podem andar em paralelo à lógica.

## Implementation Strategy

MVP = Phases 1–3 (navegação + chat). Em seguida, cada história é incremental e testável por si.
Como `app.js` e `content.js` são arquivos únicos, a maior parte das tarefas é sequencial.
