# Feature Specification: Ambiente de Treinamento Interativo "Claude para Marketing"

**Feature Branch**: `001-ambiente-treinamento`

**Created**: 2026-10-13

**Status**: Draft

**Input**: User description: "Desenvolver de maneira autônoma o projeto descrito no prd.md" — site
de treinamento que simula um assistente de IA para uma profissional de marketing, com 7 módulos,
conversas roteirizadas, comparativos, artefatos, Projetos e Skills.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Instrutor conduz a apresentação módulo a módulo (Priority: P1)

Durante um treinamento de 1 hora, o instrutor abre o material no notebook, navega pelos 7
módulos e, em cada um, faz a conversa simulada avançar a cada clique (ou tecla), mostrando a
mensagem da aluna sendo digitada e a resposta do assistente aparecendo aos poucos.

**Why this priority**: é o uso principal do produto; sem isso não há treinamento.

**Independent Test**: abrir o material, ir do módulo 1 ao 7 só com teclado (setas e
espaço/Enter), verificando que cada conversa avança passo a passo.

**Acceptance Scenarios**:

1. **Given** o material aberto no Módulo 1, **When** o instrutor pressiona seta direita,
   **Then** vai para o Módulo 2 e o indicador mostra "Módulo 2 de 7".
2. **Given** um módulo com conversa no modo apresentação, **When** o instrutor pressiona
   espaço, **Then** a próxima mensagem aparece (digitação para a aluna; "pensando" e texto
   progressivo para o assistente).
3. **Given** uma animação em andamento, **When** o instrutor clica em "Pular animação",
   **Then** a mensagem atual (e a conversa inteira, se assim acionado) aparece completa.
4. **Given** uma conversa avançada, **When** o instrutor clica em "Reiniciar conversa",
   **Then** a conversa daquele módulo volta ao início.
5. **Given** o instrutor no Módulo 4, **When** recarrega a página, **Then** o material reabre
   no Módulo 4.

---

### User Story 2 - Comparativos "antes vs. depois" (Priority: P1)

O instrutor mostra, lado a lado, um prompt fraco e um prompt bom (Módulo 3) e um pedido sem e
com Skill (Módulo 5), para que a aluna veja a diferença de qualidade.

**Why this priority**: é o núcleo pedagógico do treinamento.

**Independent Test**: no Módulo 3, avançar as duas colunas e comparar respostas; em 375px,
alternar entre as abas "Antes" e "Depois".

**Acceptance Scenarios**:

1. **Given** tela de notebook, **When** o Módulo 3 abre, **Then** aparecem duas colunas
   "Antes" e "Depois", cada uma com um mini chat.
2. **Given** tela de 375px, **When** o Módulo 3 abre, **Then** o comparativo vira abas
   "Antes"/"Depois" operáveis por teclado.

---

### User Story 3 - Artefatos visuais, Projeto e Skill (Priority: P2)

Algumas respostas abrem um painel com o resultado visual (carrossel de Instagram navegável,
post com legenda, e-mail/newsletter), cada um com "Copiar texto". O Módulo 4 mostra um Projeto
simulado (nome, instruções, arquivos). O Módulo 5 mostra uma Skill como arquivo e um selo
"Skill em uso" quando ela é carregada na conversa.

**Why this priority**: torna concretos os conceitos de Projetos e Skills.

**Independent Test**: no Módulo 6, abrir os três artefatos, navegar os slides do carrossel com
setas e copiar o texto de cada um.

**Acceptance Scenarios**:

1. **Given** uma resposta com artefato, **When** ela termina de aparecer, **Then** um botão
   permite abrir o painel do artefato (e o painel abre automaticamente no modo apresentação).
2. **Given** o carrossel aberto, **When** o usuário usa as setas do carrossel, **Then** o
   slide muda e o contador "Slide X de N" atualiza.
3. **Given** a conversa do carrossel no Módulo 5, **When** chega a resposta do assistente,
   **Then** aparece o selo "Skill em uso: carrossel-cafe-serra" com animação curta.
4. **Given** qualquer artefato, **When** clica em "Copiar texto", **Then** o texto vai para a
   área de transferência e um aviso confirma.

---

### User Story 4 - Aluna revisa sozinha no modo estudo (Priority: P2)

Depois do treinamento, a aluna abre o link público (inclusive no celular), ativa o modo
estudo e lê as conversas completas com as notas explicativas do instrutor visíveis.

**Why this priority**: o material vira referência de consulta.

**Independent Test**: alternar para modo estudo e verificar que todas as conversas estão
completas e as notas visíveis, em 375px.

**Acceptance Scenarios**:

1. **Given** modo apresentação, **When** clica no botão de modo no topo, **Then** passa ao
   modo estudo e todas as conversas aparecem completas com notas.
2. **Given** modo apresentação, **When** clica no ícone "i" de uma mensagem, **Then** a nota
   daquela mensagem aparece.
3. **Given** modo escolhido, **When** recarrega, **Then** o modo é mantido.

---

### User Story 5 - Chamada para prática no Claude real (Priority: P3)

Ao fim de cada módulo prático, um card "Agora tente no Claude" mostra um prompt sugerido, um
botão "Copiar prompt" e um link para https://claude.ai em nova aba.

**Why this priority**: transforma o conteúdo em prática real.

**Independent Test**: nos módulos 3, 4, 5 e 6, copiar o prompt e verificar o link.

**Acceptance Scenarios**:

1. **Given** fim de um módulo prático, **When** clica em "Copiar prompt", **Then** o prompt
   vai para a área de transferência com confirmação.
2. **Given** o card, **When** clica no link, **Then** https://claude.ai abre em nova aba.

---

### User Story 6 - Tour da interface (Priority: P3)

No Módulo 2, um tour guiado destaca, em sequência, o campo de mensagem, o envio de arquivos, o
histórico de conversas e os Projetos de uma interface simulada, com um balão explicativo.

**Independent Test**: no Módulo 2, avançar o tour pelos 4 destaques via teclado.

**Acceptance Scenarios**:

1. **Given** o Módulo 2, **When** avança o tour, **Then** cada elemento é destacado com um
   balão explicativo, um por vez, e é possível voltar ou recomeçar.

### Edge Cases

- Armazenamento local indisponível (navegação privada/bloqueado): o material funciona
  normalmente, apenas sem lembrar o progresso.
- Cópia para área de transferência indisponível (ex.: `file://` sem permissão): usar método
  alternativo; se falhar, selecionar o texto e avisar para copiar manualmente.
- Usuário com "reduzir movimento": mensagens aparecem inteiras, sem digitação/streaming.
- Teclas de atalho não devem disparar enquanto o foco está num campo de texto, link ou botão
  que já usa Enter/espaço (o botão faz sua ação normal).
- Clicar "Avançar" quando a conversa já terminou: o botão fica desabilitado e indica "Fim da
  conversa".
- Trocar de módulo durante uma animação: a animação é cancelada sem deixar resíduos.
- Progresso salvo apontando para módulo inexistente (conteúdo editado): volta ao Módulo 1.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST exibir uma lista de módulos com indicação do módulo atual e
  botões "Anterior"/"Próximo", além do indicador "Módulo X de 7".
- **FR-002**: O sistema MUST permitir navegação por teclado: setas esquerda/direita trocam de
  módulo; espaço/Enter avançam a conversa ativa.
- **FR-003**: O sistema MUST lembrar o módulo atual e o modo (apresentação/estudo) entre
  recarregamentos.
- **FR-004**: No modo apresentação, mensagens MUST aparecer apenas ao comando "Avançar": a da
  aluna com efeito de digitação no campo de entrada seguido de envio; a do assistente com
  indicador "pensando" curto e texto progressivo.
- **FR-005**: O sistema MUST oferecer "Pular animação" e "Reiniciar conversa" por módulo.
- **FR-006**: Respostas MUST suportar negrito, itálico, listas (com marcadores e numeradas) e
  quebras de linha.
- **FR-007**: O sistema MUST oferecer um comparativo "Antes"/"Depois" em duas colunas, cada uma
  com mini chat próprio; em telas estreitas, MUST virar abas.
- **FR-008**: O sistema MUST exibir painéis de artefato dos tipos carrossel (slides quadrados
  navegáveis), legenda de post (card de rede social com avatar genérico, texto, hashtags) e
  e-mail (assunto e corpo), cada um com "Copiar texto".
- **FR-009**: O sistema MUST exibir um Projeto simulado com nome, instruções e lista de
  arquivos de conhecimento fictícios.
- **FR-010**: O sistema MUST exibir uma Skill como arquivo (nome, descrição, instruções) e um
  selo animado "Skill em uso: <nome>" quando a Skill é carregada em uma conversa.
- **FR-011**: Módulos práticos MUST terminar com o card "Agora tente no Claude" (prompt
  sugerido, "Copiar prompt", link para claude.ai em nova aba).
- **FR-012**: O sistema MUST ter modo apresentação e modo estudo alternáveis por botão no topo;
  no modo estudo as conversas aparecem completas e as notas visíveis.
- **FR-013**: Cada mensagem MAY ter nota do instrutor, acessível por um ícone "i" a qualquer
  momento e visível automaticamente no modo estudo.
- **FR-014**: O sistema MUST conter os 7 módulos com o conteúdo da seção 7 do PRD, usando a
  marca fictícia Café Serra (seção 8 do PRD).
- **FR-015**: Todo conteúdo textual do treinamento MUST ficar num único arquivo de conteúdo
  editável, separado da lógica.
- **FR-016**: O sistema MUST funcionar aberto diretamente do disco e publicado em hospedagem
  estática, sem servidor e sem chamadas de rede além de uma fonte opcional.
- **FR-017**: O sistema MUST respeitar tema escuro do sistema e "reduzir movimento".
- **FR-018**: O sistema MUST ser operável por teclado com foco visível, anunciar novas
  mensagens a leitores de tela e ter textos alternativos em ícones.
- **FR-019**: O Módulo 2 MUST ter um tour com 4 destaques (campo de mensagem, envio de
  arquivos, histórico, Projetos).
- **FR-020**: O Módulo 5 MUST incluir uma tabela comparando Projeto vs. Skill e a lista de
  outras ideias de Skills.
- **FR-021**: O Módulo 7 MUST listar os cuidados, o desafio da semana e os três links oficiais.

### Key Entities

- **Módulo**: id, título, subtítulo, lista ordenada de blocos de conteúdo.
- **Bloco**: tipo (texto, cards, chat, comparativo, projeto, skill, tabela, tour, prática,
  lista de links) e seus dados.
- **Conversa**: título opcional, contexto (ex.: "dentro do Projeto X"), lista ordenada de
  mensagens.
- **Mensagem**: autor (aluna/assistente), texto, nota opcional, anexo opcional, Skill
  carregada opcional, artefato opcional.
- **Artefato**: tipo (carrossel, post, e-mail), título e dados do tipo.
- **Progresso**: módulo atual e modo, guardados localmente.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O instrutor percorre os 7 módulos e todas as conversas usando só o teclado, sem
  usar o mouse.
- **SC-002**: O material abre por duplo clique no arquivo, sem instalar nada, em menos de 2
  segundos num notebook comum.
- **SC-003**: Zero requisições de rede além da fonte opcional, verificável na aba de rede.
- **SC-004**: Nenhuma rolagem horizontal da página em 375px e 1440px, em todos os módulos.
- **SC-005**: Um instrutor não técnico adiciona uma nova mensagem seguindo o README em menos
  de 5 minutos, editando apenas o arquivo de conteúdo.
- **SC-006**: 100% dos botões "Copiar" colocam o texto esperado na área de transferência.
- **SC-007**: Contraste de texto ≥ 4,5:1 (AA) nos temas claro e escuro.

## Assumptions

- Os módulos 3, 4, 5 e 6 são os "módulos práticos" com chamada para prática; o Módulo 7 também
  traz o desafio da semana com link.
- No modo apresentação o painel de artefato abre automaticamente quando a resposta que o
  contém termina; no modo estudo, abre por botão "Ver artefato".
- No celular, o painel de artefato vira uma camada sobreposta em tela cheia com botão fechar.
- O artigo de blog "enviado" no Módulo 6 aparece como anexo fictício na mensagem da aluna.
- "Pular animação" conclui a mensagem em andamento e exibe o restante da conversa.
- Um único conjunto de mensagens por conversa; não há ramificações.
