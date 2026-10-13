# Implementation Plan: Movimento na visão, vídeo simulado e busca no estudo

**Branch**: `004-movimento-video-busca` | **Spec**: [spec.md](spec.md)

## Technical Context

Igual às features anteriores (HTML/CSS/JS puros, `file://`, Playwright). Animações em CSS
(`@keyframes`, `@property` para o holofote) e `requestAnimationFrame` para o relógio do vídeo.

## Constitution Check

| Princípio | Status |
|---|---|
| I. Estático | ✅ sem dependências, sem módulos |
| II. Zero rede | ✅ imagem nova local |
| III. Conteúdo separado | ✅ cenas, resposta da visão e rótulos em `content.js` |
| IV. Identidade | ✅ ilustração própria |
| V. Acessível | ✅ player com botões rotulados, `aria-live` para legenda; busca com `role="combobox"`/`listbox`; movimento reduzido respeitado |
| VI. Simplicidade | ✅ um componente de vídeo compartilhado |

## Design

- **Visão**: grade de 16×12 células (`--d` = linha+coluna para atraso em onda); camada de
  números em ~1/7 das células; camada `.visao-foco` com gradiente radial guiado por
  `--fx/--fy` (`@property`, transição suave); bolha de resposta com streaming por `setInterval`.
- **Vídeo**: `{ elemento, tocar, pausar, reiniciar, irParaCena, destruir }`; cenas
  `{ tempo, duracao?, visual, foco, efeito, origem, textoTela, audio }`; duração deduzida de
  `tempo` ("2–5 s") quando `duracao` falta; camadas com crossfade e efeitos `zoom-in`,
  `zoom-out`, `pan-esquerda`, `pan-direita`.
- **Busca**: índice `[{ moduloIndice, secaoId, titulo, texto normalizado, texto original }]`
  construído uma vez a partir de `blocosDoModulo(mod, 'estudo')`; ids de seção iguais aos
  renderizados (`secao-N`); hash `#modulo` + rolagem programática.

## Tasks

Ver [tasks.md](tasks.md).
