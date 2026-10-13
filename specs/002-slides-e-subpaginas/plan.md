# Implementation Plan: Apresentação em slides e subpáginas

**Branch**: `002-slides-e-subpaginas` | **Date**: 2026-10-13 | **Spec**: [spec.md](spec.md)

## Summary

Dividir o site em três páginas estáticas (capa, deck de slides, estudo) que compartilham um motor
(`js/comum.js`) e um único arquivo de conteúdo (`js/content.js`). O deck gera slides a partir dos
blocos de cada módulo, com transições direcionais, revelação por passos, conversas animadas e
coluna de artefatos. O estudo herda o renderizador da 001, agora com artefatos inline, replay de
conversas, índice, tempo de leitura e conclusão por módulo.

## Technical Context

**Language/Version**: HTML5, CSS3 (container queries, `color-mix`), JavaScript ES2017 (async/await)
**Primary Dependencies**: nenhuma em runtime; Inter via Google Fonts (opcional)
**Storage**: `localStorage` chave `treinamento-cafe-serra:v2` (try/catch)
**Testing**: Playwright (dev), `file://`, projetos 1440 px e 375 px
**Target Platform**: navegadores modernos; GitHub Pages; `file://`
**Project Type**: site estático multipágina
**Performance Goals**: transição ≤ 600 ms; capa sem motor de chat
**Constraints**: sem build, sem módulos ES, sem fetch, sem rede além da fonte
**Scale/Scope**: 7 módulos, ~45 slides

## Constitution Check

| Princípio | Status | Como |
|---|---|---|
| I. Estático e sem build | ✅ | scripts clássicos com `defer`; namespace `window.Treino` |
| II. Zero credenciais/rede | ✅ | só a folha do Google Fonts |
| III. Conteúdo separado | ✅ | overrides de slide ficam em `content.js`; teste varre todos os JS/HTML |
| IV. Identidade própria | ✅ | paleta e marca da 001 |
| V. Acessível/responsivo | ✅ | slides com `aria-roledescription`, região viva de anúncio, foco, reduced motion |
| VI. Simplicidade | ✅ | motor único em `comum.js`; um slide por bloco; sem bibliotecas de slides |

Sem violações; Complexity Tracking vazio.

## Project Structure

```text
index.html            capa leve
apresentacao.html     deck de slides
estudo.html           material de estudo
css/base.css          tokens, reset, botões e componentes compartilhados (chat, artefatos…)
css/inicio.css        capa
css/apresentacao.css  deck
css/estudo.css        estudo
js/content.js         conteúdo (única fonte)
js/comum.js           motor compartilhado → window.Treino
js/inicio.js          capa
js/apresentacao.js    deck
js/estudo.js          estudo
tests/                Playwright (dev)
```

`css/styles.css` e `js/app.js` da 001 são removidos (substituídos pelos arquivos acima).

## Arquitetura

### comum.js (`window.Treino`)
- Utilitários: `t`, `el`, `icone`, `iconeArquivo`, `markdown`, `inline`, `textoPuro`, `md`.
- Estado: `lerEstado()`, `gravarEstado(parcial)`; tema: `iniciarTema(botao)`.
- `toast`, `copiar`, `botaoCopiar`; `Animacao` cancelável; `prepararStreaming`.
- `criarChat(conversa, opcoes)` → `{ elemento, avancar, concluido, completar, reiniciar,
  pularTudo, notasExibidas, destruir }`; opções: `animado`, `controles`, `notas`
  (`'visiveis' | 'botao' | 'nenhuma'`), `aoArtefatos(artefatos, msg)`, `rolar`.
- `criarVisualizadorArtefatos(artefatos)` (abas + carrossel/post/e-mail + Copiar).
- Componentes visuais: `renderCards`, `renderAgenda`, `renderProjeto`, `renderSkill`,
  `renderTabela`, `renderMock`, `renderPratica`, `renderLinks`, `renderDestaque`.
- `blocosDoModulo(mod, 'deck' | 'estudo')` aplica `slide`, `soNosSlides`.

### apresentacao.js
- `montarDeck()` → lista de descritores `{ modulo, indiceNoModulo, bloco, titulo, tipo }`
  (capa geral + abertura de módulo + blocos).
- `CONSTRUTORES[tipo](bloco, ctx)` → `{ elemento, avancar(), concluido(), completar(), notas(),
  destruir() }`. Fragmentos genéricos via `fragmentos(lista)`.
- `irPara(i, direcao, completo)`: constrói o slide, anima entrada/saída, finaliza transições
  pendentes, atualiza hash/estado/progresso/anúncio/fundo.
- Sobreposições: visão geral, notas, tela preta; dock com auto-ocultar no desktop.

### estudo.js
- Layout 001 (topo + lateral + principal) sem painel lateral; renderizadores por bloco usando
  componentes de `comum.js`; conversas completas com botão "Ver animação".

## Fases
1. Fundação: CSS base, `comum.js`, conteúdo (rótulos novos + overrides de slide).
2. US1/US2: deck (P1).
3. US3: estudo (P2).
4. US4: capa (P2).
5. Testes, README, validação visual.
