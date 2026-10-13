# Feature Specification: Movimento na visão, vídeo simulado e busca no estudo

**Feature Branch**: `004-movimento-video-busca`
**Created**: 2026-10-13
**Status**: Draft
**Input**: "Consegue trazer ainda mais movimento na parte que fala como o Claude vê e trazer também
um vídeo simulado na parte que fala disso, não só o roteiro. […] eu colocaria um pouco mais de
movimento apenas, uma parte de pesquisa dentro do material de estudos para uma busca rápida e acho
que finalizamos."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visão com movimento (Priority: P1)

**Acceptance Scenarios**:

1. Ao entrar no slide, a foto chega com um indicador de envio animado.
2. Na etapa "vira pedacinhos", a imagem se divide numa grade de células que entram em onda; na
   etapa seguinte, números piscam dentro de algumas células.
3. Cada marcação que aparece move um holofote (o resto da imagem escurece) até o ponto marcado.
4. Na última etapa, uma resposta do assistente é digitada sobre a foto.
5. A foto tem um zoom lento contínuo. Com movimento reduzido, tudo aparece sem animação.
6. No estudo, o estado final aparece estático (grade, marcações e resposta).

### User Story 2 - Vídeo simulado (Priority: P1)

**Acceptance Scenarios**:

1. Novo bloco `video`: player vertical 9:16 que toca as cenas em sequência, com zoom/pan nas
   imagens, legenda animada, barras de progresso por cena, selo de origem ("Gerado com IA" /
   "Gravado na loja"), tempo decorrido e indicação do áudio de cada cena.
2. Controles: tocar/pausar, recomeçar e clique numa cena da lista para pular até ela.
3. Nos slides, o vídeo começa sozinho ao entrar no slide (exceto com movimento reduzido); no
   estudo, só ao clicar.
4. Rotulado como "Prévia simulada", sem áudio.

### User Story 3 - Busca no estudo (Priority: P1)

**Acceptance Scenarios**:

1. Campo de busca no topo do estudo; atalho `/` foca o campo; `Esc` limpa e fecha.
2. Busca em títulos, textos, mensagens, notas, prompts e artefatos de todos os módulos,
   ignorando maiúsculas e acentos ("cafe" encontra "café").
3. Resultados mostram módulo, seção e trecho com o termo destacado; setas ↑/↓ e Enter navegam.
4. Ao escolher um resultado, abre o módulo, rola até a seção e a destaca brevemente.
5. Funciona em 375 px (painel em largura total).

### User Story 4 - Um pouco mais de movimento geral (Priority: P3)

1. Imagens de abertura e blocos de imagem com movimento sutil e contínuo (respeitando
   movimento reduzido).

## Requirements *(mandatory)*

- **FR-001**: `criarVisao` com células, números, holofote, envio e resposta digitada; `destruir`
  cancela temporizadores.
- **FR-002**: Componente `criarVideoSimulado` em `componentes.js`, usado pelo deck e pelo estudo.
- **FR-003**: Nova ilustração local `img/torra.svg` para a cena gravada na loja.
- **FR-004**: Busca no estudo indexa o conteúdo a partir de `content.js`, sem rede.
- **FR-005**: Textos novos (rótulos do player e da busca) em `content.js`.
- **FR-006**: Restrições anteriores mantidas (file://, WCAG AA, 375–1440 px, sem rede extra).

## Success Criteria *(mandatory)*

- **SC-001**: Todos os testes passam, incluindo novos para visão, vídeo e busca.
- **SC-002**: Busca responde enquanto se digita (< 50 ms por tecla com o conteúdo atual).
- **SC-003**: Nenhum slide passa a rolar em 1440×900.
