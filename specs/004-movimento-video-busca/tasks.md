# Tasks: Movimento na visão, vídeo simulado e busca no estudo

- [X] T001 [US1] `criarVisao`: envio, células em onda, números, holofote, resposta digitada, `destruir`
- [X] T002 [US1] CSS da visão animada + estado estático no estudo
- [X] T003 [US2] `img/torra.svg`
- [X] T004 [US2] `criarVideoSimulado` + CSS (player, legendas, progresso, selo, controles)
- [X] T005 [US2] Bloco `video` no deck (autoplay) e no estudo; conteúdo no módulo 7
- [X] T006 [US3] Busca no estudo: índice, interface, teclado, navegação e destaque
- [X] T007 [US4] Movimento sutil em imagens de abertura e blocos de imagem
- [X] T008 Testes E2E (visão, vídeo, busca), README e revisão visual

## Notas de implementação

- O estado do player fica no próprio `.vs-player` (no deck, o player é movido para fora do contêiner
  `.video-sim`; o estado no contêiner deixava o botão central visível durante a reprodução).
- Na etapa de resposta da visão, as marcações somem para a resposta digitada não cobri-las.
- A busca ignora caminhos `img/…`, autor das mensagens e lembretes de palco (`nota` do bloco).
- Imagens das camadas do vídeo são decorativas (`alt=""`); a descrição fica no `aria-label` do
  player e a legenda é anunciada por `aria-live`.
- Resultado: 69 testes passando (1440 e 375 px); 77 slides sem rolagem em 1440×900.
