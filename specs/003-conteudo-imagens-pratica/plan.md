# Implementation Plan: Conteúdo ampliado — IA, imagens, segundo pedido e prática

**Branch**: `003-conteudo-imagens-pratica` | **Spec**: [spec.md](spec.md)

## Summary

Reescrever `js/content.js` com 11 módulos e linguagem natural; criar ilustrações SVG locais em
`img/`; estender `componentes.js` (anexo com imagem, artefatos `prompt-imagem` e `roteiro`,
imagem em post, componentes `proximaPalavra`, `visao`, `imagem`, `antesDepois`, prática com
passos e vários prompts); adicionar construtores no deck e renderizadores no estudo.

## Technical Context

Mesmo da 002 (HTML/CSS/JS puros, `file://`, Playwright). Imagens: SVG estáticos referenciados
por `<img src="img/…">` (funciona em `file://`, sem rede, sem CSS externo).

## Constitution Check

| Princípio | Status | Observação |
|---|---|---|
| I. Estático | ✅ | `<img>` com caminho relativo |
| II. Zero rede | ✅ | imagens locais |
| III. Conteúdo separado | ✅ | textos (inclusive alt) em `content.js`; SVGs são mídia, não lógica |
| IV. Identidade própria | ✅ | ilustrações próprias com a marca fictícia |
| V. Acessível | ✅ | `alt` obrigatório; demos com estado final estático no estudo |
| VI. Simplicidade | ✅ | componentes compartilhados entre deck e estudo |

## Design dos componentes (componentes.js)

- `renderImagem(b)` → `<figure>` com `<img>` + legenda; `onerror` mostra o alt.
- `criarProximaPalavra(b, {animado})` → `{ elemento, avancar, concluido, completar }`;
  rodadas `{ frase, opcoes:[{palavra, chance}], escolhida }`.
- `criarVisao(b)` → foto + grade + marcações `{x, y, rotulo}` em %; passos revelam grade e
  marcações; `completar` mostra tudo.
- `criarAntesDepois(b)` → duas colunas (prompt + imagem resultado + comentário).
- Artefatos: `prompt-imagem` `{ campos:[{rotulo, valor}], prompt, promptIngles, proporcao }`;
  `roteiro` `{ duracao, formato, cenas:[{tempo, imagem, textoTela, audio}], legenda }`.
- `renderPratica` com `passos[]` e `prompts[{rotulo, texto}]`.

## Ilustrações (img/)

`cafe-inverno.svg` (natureza-morta do produto), `foto-generica.svg` (resultado de prompt vago),
`metricas.svg` (print de métricas), `cafeteria.svg`, `cafezal.svg`, `coador.svg`, `ia.svg`.

## Fases

1. Ilustrações. 2. Componentes + CSS. 3. Deck/estudo. 4. Conteúdo. 5. Testes, README, revisão.
