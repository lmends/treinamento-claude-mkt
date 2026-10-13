# Feature Specification: Apresentação em slides e subpáginas

**Feature Branch**: `002-slides-e-subpaginas`
**Created**: 2026-10-13
**Status**: Draft
**Input**: Feedback do instrutor sobre a versão 001: "Não curti o resultado final de apresentação,
estava esperando algo como slides, dinâmicos e fluidos. O resultado para estudos ficou bom até,
mas dá para melhorar. Pode segmentar em subpáginas para não pesar demais o index."

## Contexto

A versão 001 entregou uma única página com dois modos (apresentação e estudo) que alternavam o
comportamento das conversas. No uso real, o "modo apresentação" parecia um documento rolável, não
uma apresentação. Esta feature separa as experiências em páginas próprias e transforma a
apresentação num deck de slides em tela cheia, mantendo `js/content.js` como fonte única.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Conduzir o treinamento como slides (Priority: P1)

O instrutor abre a apresentação, coloca em tela cheia e conduz a hora de treinamento avançando
com uma tecla. Cada ideia ocupa um slide; elementos entram com animação; conversas simuladas
acontecem dentro do slide (digitação, "pensando", streaming); artefatos surgem ao lado do chat.

**Why this priority**: é o motivo da mudança; sem isso o treinamento não tem cara de apresentação.

**Independent Test**: abrir `apresentacao.html`, pressionar → / Espaço repetidamente do primeiro ao
último slide e verificar transições, revelações passo a passo e conversas animadas.

**Acceptance Scenarios**:

1. **Given** a apresentação aberta, **When** o instrutor pressiona →, Espaço, Enter ou PageDown,
   **Then** o próximo passo do slide é revelado ou, se o slide terminou, o deck transita para o
   próximo slide com animação suave.
2. **Given** um slide de conversa, **When** o instrutor avança, **Then** a próxima mensagem é
   digitada/transmitida; avançar durante a animação conclui a mensagem na hora.
3. **Given** uma resposta com artefatos, **When** ela termina, **Then** o artefato (carrossel,
   legendas ou e-mail) entra na coluna ao lado do chat, navegável e com "Copiar texto".
4. **Given** qualquer slide, **When** o instrutor pressiona ← ou PageUp, **Then** volta ao slide
   anterior já completo.
5. **Given** o início de cada módulo, **Then** há um slide de abertura com número, título e resumo.
6. **Given** a apresentação, **When** o instrutor pressiona O (ou clica no ícone de grade),
   **Then** abre a visão geral com todos os slides agrupados por módulo, e clicar num slide pula
   para ele.

---

### User Story 2 - Recursos de palco (Priority: P1)

O instrutor precisa de controles de apresentação: tela cheia, notas do apresentador, barra de
progresso por módulo, pular para módulo, tela preta e retomar de onde parou.

**Independent Test**: usar F, N, B, teclas 1–7, Home/End; recarregar a página e conferir que
volta ao mesmo slide.

**Acceptance Scenarios**:

1. **Given** a apresentação, **When** pressiona F, **Then** entra/sai de tela cheia.
2. **When** pressiona N, **Then** um painel mostra as notas do instrutor do slide e das mensagens
   já exibidas.
3. **When** pressiona B, **Then** a tela escurece até nova tecla.
4. **When** pressiona um número de 1 a 7, **Then** vai para a abertura daquele módulo.
5. **Given** o slide 12, **When** recarrega a página, **Then** volta ao slide 12; o endereço
   (`#modulo/n`) permite compartilhar um slide específico.
6. A barra inferior mostra o progresso segmentado por módulo; o contador mostra "n / total".
7. No celular, deslizar para os lados troca de slide e os controles ficam sempre visíveis.

---

### User Story 3 - Estudar com um material melhor (Priority: P2)

Depois do treinamento, a aluna revisa no próprio ritmo numa página de estudo, um módulo por vez,
com conversas completas, notas visíveis e artefatos à vista.

**Independent Test**: abrir `estudo.html`, ler um módulo, ver artefatos sem abrir painel, marcar
como concluído, ir ao próximo e recarregar.

**Acceptance Scenarios**:

1. **Given** um módulo de estudo, **Then** as conversas aparecem completas, com notas do instrutor
   e artefatos exibidos logo abaixo da resposta (abas quando houver mais de um).
2. **When** clica em "Ver animação" numa conversa, **Then** ela é reproduzida com digitação e
   streaming no próprio lugar.
3. **Given** o cabeçalho do módulo, **Then** há tempo estimado de leitura e um índice "Nesta
   página" com âncoras para as seções.
4. **When** clica em "Concluí este módulo", **Then** o módulo fica marcado (✓) na lista lateral e
   na capa, e isso persiste após recarregar.
5. No fim do módulo, um cartão leva ao próximo módulo pelo nome; há link "Apresentar este módulo"
   que abre os slides no módulo atual.
6. Uma barra fina mostra o progresso de leitura da página.

---

### User Story 4 - Capa leve com dois caminhos (Priority: P2)

`index.html` deixa de carregar todo o motor: é uma capa com o nome do treinamento, dois cartões
("Apresentar" e "Estudar", cada um com "continuar de onde parou") e a lista de módulos.

**Independent Test**: abrir `index.html` e chegar às duas subpáginas; conferir que a capa não
carrega os scripts de chat/slides.

**Acceptance Scenarios**:

1. **Given** a capa, **Then** só são carregados `content.js`, `comum.js`, `inicio.js`,
   `base.css` e `inicio.css`.
2. **Given** progresso salvo, **Then** os cartões mostram onde continuar (slide e módulo).
3. Cada módulo da lista abre o estudo naquele módulo e tem atalho para os slides do módulo.

---

### Edge Cases

- `prefers-reduced-motion`: sem transições de slide, sem digitação/streaming; passos ainda são
  revelados um a um (instantaneamente).
- Teclas pressionadas durante uma transição: a transição anterior é finalizada na hora.
- Hash inválido ou de módulo removido: cai no primeiro slide.
- `localStorage` indisponível: tudo funciona sem lembrar posição.
- Tela pequena (375 px): slide rola verticalmente por dentro; colunas viram pilha; comparativo
  vira abas.
- API de tela cheia indisponível (ex.: iOS): botão oculto/sem erro.
- Bloco sem versão para slides (`slide: false`): aparece só no estudo; `soNosSlides: true`: só no
  deck.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O site MUST ter três páginas: `index.html` (capa), `apresentacao.html` (deck),
  `estudo.html` (estudo), com navegação entre elas.
- **FR-002**: O deck MUST ser gerado a partir dos mesmos módulos/blocos de `content.js`: um slide
  de abertura por módulo + um slide por bloco; cada bloco MAY ter `slide: { … }` para sobrescrever
  campos no deck, `slide: false` para ocultar no deck e `soNosSlides: true` para ocultar no estudo.
- **FR-003**: O deck MUST ter transições animadas entre slides (direção conforme avanço/retorno)
  e entrada escalonada de elementos; fundo com formas que se movem suavemente entre slides.
- **FR-004**: Blocos de lista (cards, tabela, skill, visão geral) MUST suportar revelação passo a
  passo (`passoAPasso: true`) ou entrada automática escalonada (padrão).
- **FR-005**: Slides de conversa MUST reutilizar o motor de chat (digitação, pensando, selo de
  skill, streaming) avançando uma mensagem por passo.
- **FR-006**: Slides com artefatos MUST reservar uma coluna "Resultado" que exibe o artefato
  quando a mensagem correspondente termina.
- **FR-007**: Comparativo no deck MUST mostrar "Antes" e "Depois" lado a lado (abas abaixo de
  720 px), avançando primeiro o "Antes".
- **FR-008**: Tour no deck MUST destacar um alvo da interface simulada por passo.
- **FR-009**: Atalhos do deck: →/Espaço/Enter/PageDown avançam; ←/PageUp voltam; Home/End; 1–7;
  O visão geral; N notas; F tela cheia; B tela preta; Esc fecha sobreposições.
- **FR-010**: Deck MUST ter barra de progresso segmentada por módulo, contador, dock de controles
  (anterior, próximo, visão geral, notas, tela cheia, tema, capa) e gesto de deslizar.
- **FR-011**: Posição do deck MUST persistir em `localStorage` e no hash `#id-do-modulo/n`.
- **FR-012**: Estudo MUST exibir artefatos inline (abas para múltiplos) com "Copiar texto", sem
  painel lateral.
- **FR-013**: Estudo MUST permitir "Ver animação" por conversa, índice "Nesta página", tempo
  estimado de leitura, barra de progresso de leitura, "Concluí este módulo" persistente e cartão
  de próximo módulo.
- **FR-014**: Estudo MUST manter comparativo em colunas/abas, tour estático numerado, projeto,
  skill, tabela, prática com "Copiar prompt" e links.
- **FR-015**: A capa MUST mostrar progresso salvo (slide atual, módulos concluídos).
- **FR-016**: Todos os textos MUST continuar em `content.js`; nenhum texto do treinamento em
  HTML ou nos demais scripts.
- **FR-017**: Restrições herdadas da 001 continuam: sem rede além da fonte, sem credenciais,
  `file://`, WCAG AA, 375–1440 px, tema escuro, reduced motion, sem marca Anthropic.
- **FR-018**: Cada slide MUST ser anunciado a leitores de tela ("Slide n de total: título") e o
  chat MUST manter `aria-live`.

### Key Entities

- **Slide**: descritor derivado (módulo, bloco efetivo, título, tipo) + controlador com
  `avancar`, `concluido`, `completar`, `notas`, `destruir`.
- **Bloco**: igual à 001, com campos novos opcionais `slide`, `soNosSlides`, `passoAPasso`,
  `nota`.
- **Estado salvo**: `{ tema, deck: { modulo, slide }, estudo: { modulo, concluidos[] } }`.

## Success Criteria *(mandatory)*

- **SC-001**: O instrutor conduz os 7 módulos só com a tecla → (ou Espaço), sem tocar no mouse.
- **SC-002**: Transições entre slides levam ≤ 600 ms e não travam a navegação.
- **SC-003**: A capa transfere menos da metade do JS/CSS da versão 001 (sem motor de chat).
- **SC-004**: Nenhum slide gera rolagem horizontal em 375 px e 1440 px; em 1440×900 os slides de
  texto, cards e abertura cabem sem rolagem.
- **SC-005**: Todos os testes automatizados passam em 1440 px e 375 px.

## Assumptions

- Um slide por bloco, com overrides opcionais, é suficiente; não há editor visual de slides.
- A fonte Inter passa a incluir o peso 800 (mesma única requisição ao Google Fonts).
- Não há visão de apresentador em segunda janela; as notas aparecem num painel na própria tela.
- Os módulos concluídos no estudo são independentes da posição no deck.
