# Tasks: Apresentação em slides e subpáginas

**Input**: spec.md, plan.md, research.md, data-model.md, contracts/content-schema.md

## Phase 1: Setup

- [X] T001 Criar `css/base.css` a partir de `css/styles.css` (tokens, reset, botões, chat, componentes, artefatos, toast) sem layout de página
- [X] T002 Remover `css/styles.css` e `js/app.js` após a migração; atualizar `.gitignore` (pasta `.tmp/`)

## Phase 2: Foundational

- [X] T003 `js/comum.js`: utilitários, markdown, ícones, estado v2 (com migração do v1), tema, toast, copiar, Animacao, streaming
- [X] T004 `js/comum.js`: `criarChat` com opções `animado`, `controles`, `notas`, `aoArtefatos`, `rolar`, `notasExibidas`, `completar`, `destruir`
- [X] T005 `js/comum.js`: `criarVisualizadorArtefatos` (abas, carrossel, legendas, e-mail, copiar)
- [X] T006 `js/comum.js`: componentes visuais (cards, agenda, projeto, skill, tabela, mock, prática, links, destaque) e `blocosDoModulo`
- [X] T007 `js/content.js`: rótulos novos (capa, deck, estudo), seção `apresentacao`, `slide`/`passoAPasso`/`nota`/`soNosSlides` nos blocos, tipo `frase`

## Phase 3: US1 + US2 — Deck de slides (P1) 🎯 MVP

- [X] T008 [US1] `apresentacao.html` com palco, fundo animado, topo, dock, barra segmentada, sobreposições (visão geral, notas, tela preta) e região de anúncio
- [X] T009 [US1] `css/apresentacao.css`: layout de slide fluido, tipografia, transições direcionais, fragmentos, fundo, tipos de slide, responsivo, reduced motion
- [X] T010 [US1] `js/apresentacao.js`: montagem do deck, `irPara` com transições, fragmentos e construtores (capa, abertura, frase, texto, destaque, cards, agenda, tabela, skill, projeto, prática, links)
- [X] T011 [US1] Construtores de conversa: chat com coluna de resultado, comparativo, tour
- [X] T012 [US2] Atalhos, gesto de deslizar, dock com auto-ocultar, tela cheia, tela preta, visão geral, notas
- [X] T013 [US2] Persistência (estado + hash), anúncio de slide, fundo por slide, título do documento

## Phase 4: US3 — Estudo (P2)

- [X] T014 [US3] `estudo.html` + `css/estudo.css` (topo, lateral, barra de leitura, principal)
- [X] T015 [US3] `js/estudo.js`: renderizadores, artefatos inline, "Ver animação", índice, tempo de leitura, concluído, próximo módulo, link para slides

## Phase 5: US4 — Capa (P2)

- [X] T016 [US4] `index.html` + `css/inicio.css` + `js/inicio.js` com cartões de modo, continuar, lista de módulos

## Phase 6: Polish

- [X] T017 Reescrever `tests/app.spec.js` cobrindo capa, deck e estudo (1440 e 375 px)
- [X] T018 Atualizar `README.md` (páginas, atalhos do deck, overrides de slide)
- [X] T019 Validação visual com capturas (desktop, 375 px, escuro) e correções
- [X] T020 Verificar rede, console, overflow, contraste das cores novas

## Dependencies

T001 → T003–T006 → T007 → (T008–T013) ∥ (T014–T015) ∥ T016 → T017–T020.

## Notas de implementação

- T003–T006 resultaram em dois arquivos: `js/comum.js` (utilitários, carregado pela capa) e
  `js/componentes.js` (chat, artefatos e componentes), além de `css/base.css` +
  `css/componentes.css`, para a capa não carregar o motor de conversa (SC-003).
- Achados da revisão visual corrigidos: sombra do chat cortada na borda do slide, ícone da frase
  na mesma linha do rótulo, descendente do título da capa cortado, colisão da classe
  `slide-texto`, carrossel alto demais na coluna de resultado em 900 px.
