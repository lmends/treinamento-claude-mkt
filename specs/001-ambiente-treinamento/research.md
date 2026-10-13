# Research: Ambiente de Treinamento

## 1. Carregar conteúdo funcionando em `file://`

- **Decision**: `js/content.js` como script clássico que define `window.CONTEUDO = {...}`,
  carregado antes de `js/app.js` (ambos com `defer`).
- **Rationale**: `fetch('content.json')` e ES modules são bloqueados em `file://` por CORS.
- **Alternatives**: JSON + fetch (quebra local); `<script type="application/json">` inline
  (mistura conteúdo com `index.html`).

## 2. Streaming de texto já formatado

- **Decision**: converter o texto (mini-markdown) em HTML completo, coletar os nós de texto e
  revelar caracteres progressivamente truncando cada nó; blocos ainda vazios ficam ocultos.
- **Rationale**: evita asteriscos "soltos" aparecendo durante o streaming e mantém listas e
  negrito corretos a cada quadro.
- **Alternatives**: re-renderizar o markdown do prefixo a cada quadro (marcadores aparecem
  quebrados); revelar por palavra com `<span>` (DOM pesado).

## 3. Anúncio para leitores de tela

- **Decision**: lista de mensagens com `role="log"` e `aria-live="polite"`; durante a animação
  o conteúdo é `aria-hidden`, e ao concluir é trocado pelo nó final.
- **Rationale**: evita dezenas de anúncios parciais durante o streaming.

## 4. Cópia para área de transferência

- **Decision**: `navigator.clipboard.writeText` quando disponível; fallback com `textarea`
  oculto + `document.execCommand('copy')`; se ambos falharem, aviso para copiar manualmente.
- **Rationale**: `file://` e navegadores antigos nem sempre expõem a Clipboard API.

## 5. Paleta própria

- **Decision**: off-white neutro `#FAF9F7`, grafite `#26282B`, destaque espresso `#7A4A2A`,
  apoio verde-folha `#3D6B52`; tema escuro com grafite `#17181A` e destaque caramelo `#D9A57A`.
- **Rationale**: remete a café sem se aproximar dos tons laranja/terracota da marca Anthropic.
  Contrastes calculados ≥ 4,5:1 para texto sobre fundo.

## 6. Teclado vs. botões focados

- **Decision**: handler global em `keydown`; ignora `input/textarea/select/[contenteditable]`;
  em botões/links deixa Enter/espaço nativos; após clique de mouse (`event.detail > 0`) em
  controles de navegação/chat, o foco é removido do botão.
- **Rationale**: no modo apresentação o instrutor alterna mouse e teclado; sem isso o espaço
  reativaria o último botão clicado (ex.: "Próximo").

## 7. Fonte

- **Decision**: Inter (400/600/700) via Google Fonts com `display=swap`; pilha de fallback
  `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.
- **Rationale**: única requisição externa permitida; offline cai no sistema sem quebrar.

## 8. Testes

- **Decision**: Playwright E2E contra `file://` em 1440 px e 375 px, claro/escuro e
  reduced-motion; registro de requisições para provar "zero rede".
- **Rationale**: valida diretamente os critérios de aceite do PRD.
