# Research: Apresentação em slides e subpáginas

## 1. Slides derivados dos blocos vs. deck escrito à parte
- **Decision**: um slide por bloco, com override opcional `slide: {…}` (mesclado sobre o bloco),
  `slide: false` e `soNosSlides: true`.
- **Rationale**: fonte única; adicionar módulo continua sendo só editar `content.js`; o instrutor
  pode encurtar textos para o palco sem duplicar o resto.
- **Alternatives**: array `slides` separado por módulo (duplicação e divergência de conteúdo).

## 2. Escala do slide
- **Decision**: slide ocupa a viewport inteira com tipografia fluida
  (`clamp()` sobre `min(vw, vh)`), em vez de canvas 16:9 fixo escalado com `transform`.
- **Rationale**: canvas fixo fica minúsculo no celular em retrato e borra texto em zoom; tipografia
  fluida funciona do projetor ao celular.

## 3. Transições
- **Decision**: animações CSS próprias (`@keyframes` de entrada/saída por direção, 520 ms,
  `cubic-bezier(.22,.8,.2,1)`), slide anterior removido em `animationend` ou timeout de segurança.
  Fundo com três manchas desfocadas cuja posição/cor muda por slide via variáveis CSS com
  `transition` de 1,2 s.
- **Rationale**: View Transitions API não existe em todos os navegadores; CSS puro é previsível e
  respeita `prefers-reduced-motion` com uma regra.

## 4. Reconstruir slide ao entrar
- **Decision**: o slide é construído toda vez que se entra nele; ao voltar, chama `completar()`.
- **Rationale**: evita estado velho de animações; o DOM fica com no máximo dois slides.

## 5. Artefatos
- **Decision**: no deck, coluna "Resultado" reservada (placeholder tracejado) que recebe o
  visualizador quando a mensagem termina; no estudo, visualizador inline logo abaixo da resposta.
- **Rationale**: elimina o painel lateral/diálogo da 001 (complexo no celular) e deixa o
  resultado sempre visível.

## 6. Notas do apresentador
- **Decision**: painel inferior na própria tela (N), listando nota do bloco e notas das mensagens
  já exibidas, a mais recente destacada.
- **Alternatives**: janela de apresentador separada (`window.open` + `BroadcastChannel`) —
  fora de escopo (YAGNI).

## 7. Tela cheia
- **Decision**: `document.documentElement.requestFullscreen()` quando disponível; botão oculto
  caso contrário.

## 8. Fonte
- **Decision**: Inter com pesos 400/500/600/700/800 numa só requisição.
