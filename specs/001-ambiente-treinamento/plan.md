# Implementation Plan: Ambiente de Treinamento Interativo "Claude para Marketing"

**Branch**: `001-ambiente-treinamento` | **Date**: 2026-10-13 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-ambiente-treinamento/spec.md`

## Summary

Site estático de página única que apresenta 7 módulos de treinamento. Um motor genérico
(`js/app.js`) lê um objeto de dados global (`window.CONTEUDO`, definido em `js/content.js`) e
renderiza blocos tipados (texto, cards, chat, comparativo, projeto, skill, tabela, tour,
prática, links). Um único componente de chat roteirizado — com digitação, "pensando",
streaming, selo de Skill, anexos, notas e artefatos — é reaproveitado no chat principal, nos
mini chats do comparativo e nas conversas de Projeto/Skill. Um painel lateral (sobreposição no
celular) exibe artefatos (carrossel, post, e-mail). Estado (módulo, modo, tema) fica em
`localStorage`.

## Technical Context

**Language/Version**: HTML5, CSS3 (custom properties, grid, `aspect-ratio`), JavaScript ES2019
em scripts clássicos (sem módulos)

**Primary Dependencies**: nenhuma em runtime; fonte "Inter" opcional via Google Fonts

**Storage**: `localStorage` (chave `treinamento-cafe-serra:v1`), protegido por try/catch

**Testing**: Playwright (dependência só de desenvolvimento, em `tests/`), rodando contra
`file://`

**Target Platform**: navegadores modernos (Chrome/Edge/Firefox/Safari atuais), desktop e celular

**Project Type**: site estático (single-page, sem build)

**Performance Goals**: abertura < 2 s; animações a 60 fps; cada resposta roteirizada leva no
máximo ~3 s para "aparecer" no modo apresentação

**Constraints**: funcionar em `file://` e GitHub Pages; zero rede além da fonte; WCAG AA;
375–1440 px; `prefers-reduced-motion`

**Scale/Scope**: 7 módulos, ~10 conversas, ~45 mensagens, 6 artefatos

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Como o plano atende | Status |
|-----------|--------------------|--------|
| I. Estático e Sem Build | Scripts clássicos com `defer`; dados em variável global; sem `fetch`/módulos | ✅ |
| II. Zero Credenciais e Rede | Nenhuma API; só `<link>` do Google Fonts com fallback | ✅ |
| III. Conteúdo Separado | Todo texto (inclusive rótulos de UI) em `CONTEUDO` em `content.js` | ✅ |
| IV. Identidade Própria | Paleta espresso/off-white/verde-folha própria; ícone próprio; nome "Ambiente de Treinamento"; marca Café Serra | ✅ |
| V. Acessível e Responsivo | Foco visível, `role="log"` + `aria-live`, tabs ARIA, reduced-motion, tema escuro | ✅ |
| VI. Simplicidade | Um motor de chat reutilizado; sem dependências | ✅ |

*Pós-design*: re-verificado após data-model e contrato — sem violações.

## Project Structure

### Documentation (this feature)

```text
specs/001-ambiente-treinamento/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── content-schema.md   # contrato do formato de dados de content.js
└── tasks.md
```

### Source Code (repository root)

```text
index.html            # casca: topo, barra lateral, área principal, painel de artefato, toast
css/styles.css        # tokens (claro/escuro), layout, componentes, reduced-motion
js/content.js         # window.CONTEUDO = { interface, marca, modulos[] }
js/app.js             # estado, navegação, teclado, renderizadores de blocos, chat, artefatos
README.md             # uso local, edição de conteúdo, deploy no GitHub Pages
.nojekyll             # GitHub Pages serve os arquivos sem processar
tests/
├── package.json      # devDependency: @playwright/test
├── playwright.config.js
└── app.spec.js       # testes E2E contra file://
```

**Structure Decision**: estrutura fixa exigida pelo PRD (seção 5), mais `tests/` isolado (dev
only) e `.nojekyll`.

## Arquitetura de `app.js`

- **Estado**: `{ moduloIndex, modo: 'apresentacao'|'estudo', tema: 'auto'|'claro'|'escuro' }`,
  carregado/salvo com try/catch; hash da URL (`#<id-do-modulo>`) tem prioridade ao abrir.
- **Renderização**: `renderModulo()` limpa a área principal, cancela animações e chama um
  renderizador por `bloco.tipo` (mapa `RENDERIZADORES`). Tipo desconhecido → aviso discreto.
- **"Avançáveis"**: chats e tours registram `{ avancar(), concluido(), elemento }` numa lista
  do módulo. Espaço/Enter/"Avançar" atuam no primeiro avançável não concluído (ordem do
  documento); o comparativo registra a coluna "Antes" e depois a "Depois", trocando de aba no
  celular automaticamente.
- **Chat**: fila de mensagens; cada passo = (selo de Skill opcional) → digitação no campo →
  bolha da aluna, ou "pensando" → streaming por nós de texto do HTML já formatado. Espaço
  durante animação conclui a animação atual. Animações usam um token de cancelamento.
  Reduced-motion/estudo → render direto.
- **Acessibilidade de chat**: lista com `role="log" aria-live="polite"`; conteúdo em animação
  fica `aria-hidden` e é substituído pela versão final ao concluir (gera um único anúncio).
- **Artefatos**: painel único `aside` (≥1100 px: coluna ao lado do conteúdo; abaixo: diálogo
  sobreposto com foco preso e Esc). Mensagem com vários artefatos → abas.
- **Teclado global**: ignora alvos editáveis, teclas com modificadores e, para setas, regiões
  com navegação local (tabs, carrossel). Botões clicados com mouse perdem o foco para que o
  espaço não os reative.
- **Cópia**: `navigator.clipboard` com fallback `execCommand('copy')`; toast em `role="status"`.

## Complexity Tracking

Sem violações da constituição.
