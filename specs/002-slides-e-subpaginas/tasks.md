# Tasks: Apresentação em slides e subpáginas

**Input**: spec.md, plan.md, research.md, data-model.md, contracts/content-schema.md

## Phase 1: Setup

- [ ] T001 Criar `css/base.css` a partir de `css/styles.css` (tokens, reset, botões, chat, componentes, artefatos, toast) sem layout de página
- [ ] T002 Remover `css/styles.css` e `js/app.js` após a migração; atualizar `.gitignore` (pasta `.tmp/`)

## Phase 2: Foundational

- [ ] T003 `js/comum.js`: utilitários, markdown, ícones, estado v2 (com migração do v1), tema, toast, copiar, Animacao, streaming
- [ ] T004 `js/comum.js`: `criarChat` com opções `animado`, `controles`, `notas`, `aoArtefatos`, `rolar`, `notasExibidas`, `completar`, `destruir`
- [ ] T005 `js/comum.js`: `criarVisualizadorArtefatos` (abas, carrossel, legendas, e-mail, copiar)
- [ ] T006 `js/comum.js`: componentes visuais (cards, agenda, projeto, skill, tabela, mock, prática, links, destaque) e `blocosDoModulo`
- [ ] T007 `js/content.js`: rótulos novos (capa, deck, estudo), seção `apresentacao`, `slide`/`passoAPasso`/`nota`/`soNosSlides` nos blocos, tipo `frase`

## Phase 3: US1 + US2 — Deck de slides (P1) 🎯 MVP

- [ ] T008 [US1] `apresentacao.html` com palco, fundo animado, topo, dock, barra segmentada, sobreposições (visão geral, notas, tela preta) e região de anúncio
- [ ] T009 [US1] `css/apresentacao.css`: layout de slide fluido, tipografia, transições direcionais, fragmentos, fundo, tipos de slide, responsivo, reduced motion
- [ ] T010 [US1] `js/apresentacao.js`: montagem do deck, `irPara` com transições, fragmentos e construtores (capa, abertura, frase, texto, destaque, cards, agenda, tabela, skill, projeto, prática, links)
- [ ] T011 [US1] Construtores de conversa: chat com coluna de resultado, comparativo, tour
- [ ] T012 [US2] Atalhos, gesto de deslizar, dock com auto-ocultar, tela cheia, tela preta, visão geral, notas
- [ ] T013 [US2] Persistência (estado + hash), anúncio de slide, fundo por slide, título do documento

## Phase 4: US3 — Estudo (P2)

- [ ] T014 [US3] `estudo.html` + `css/estudo.css` (topo, lateral, barra de leitura, principal)
- [ ] T015 [US3] `js/estudo.js`: renderizadores, artefatos inline, "Ver animação", índice, tempo de leitura, concluído, próximo módulo, link para slides

## Phase 5: US4 — Capa (P2)

- [ ] T016 [US4] `index.html` + `css/inicio.css` + `js/inicio.js` com cartões de modo, continuar, lista de módulos

## Phase 6: Polish

- [ ] T017 Reescrever `tests/app.spec.js` cobrindo capa, deck e estudo (1440 e 375 px)
- [ ] T018 Atualizar `README.md` (páginas, atalhos do deck, overrides de slide)
- [ ] T019 Validação visual com capturas (desktop, 375 px, escuro) e correções
- [ ] T020 Verificar rede, console, overflow, contraste das cores novas

## Dependencies

T001 → T003–T006 → T007 → (T008–T013) ∥ (T014–T015) ∥ T016 → T017–T020.
