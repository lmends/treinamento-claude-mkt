# Feature Specification: Conteúdo ampliado — IA, imagens, segundo pedido e prática

**Feature Branch**: `003-conteudo-imagens-pratica`
**Created**: 2026-10-13
**Status**: Draft
**Input**: Feedback do instrutor após a 002: "Quero mais prática, ela usa para gerar vídeo e fotos,
quero explicar um pouco sobre como o Claude 'vê' imagens, quero que deixe as falas menos
robotizadas dentro da apresentação e essa parte de 'Ajustar sem recomeçar' quero detalhar mais,
geralmente sem um segundo prompt bom, o resultado não fica bacana. No geral o slide ficou bom,
bem interativo, senti falta de imagens, e também de explicar o que é uma IA. Esse treinamento vai
ser pago, pode caprichar."

## Contexto

A aluna é profissional de marketing que já usa IA para gerar **fotos e vídeos**. O material
precisa (a) explicar o que é uma IA generativa, (b) mostrar como o Claude interpreta imagens,
(c) ensinar o Claude como parceiro no fluxo de foto e vídeo — sem prometer o que ele não faz:
o Claude **não gera fotos nem vídeos**; ele escreve prompts para geradores, roteiros e briefings,
e analisa as imagens que ela traz — (d) aprofundar a iteração ("segundo pedido"), (e) ter mais
prática guiada, (f) ter imagens nos slides e (g) diálogos com cara de conversa real.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Entender o que é uma IA (Priority: P1)

Antes de pedir bem, a aluna entende, sem jargão, que uma IA generativa prevê a próxima palavra a
partir de padrões aprendidos, por que isso faz o contexto importar e por que ela pode errar.

**Independent Test**: no módulo "O que é uma IA", a demonstração "próxima palavra" mostra as
opções com chances, escolhe uma e completa a frase passo a passo.

**Acceptance Scenarios**:

1. **Given** o slide da demonstração, **When** o instrutor avança, **Then** aparecem barras com
   as palavras candidatas e suas chances; no avanço seguinte a palavra escolhida entra na frase.
2. **Given** o estudo, **Then** a mesma demonstração aparece estática, com todas as rodadas.
3. O módulo explica limites (pode inventar, não é buscador, não lembra de conversas antigas
   fora de Projetos) e o que o Claude lê (texto, imagens, PDFs) e não gera (fotos, vídeos).

### User Story 2 - Como o Claude "vê" imagens (Priority: P1)

**Independent Test**: no slide "Como o Claude vê", a foto do produto ganha uma grade (a imagem
vira pedaços), depois marcações com o que o modelo identifica, uma por avanço.

**Acceptance Scenarios**:

1. Passos: foto → grade de pedaços → marcações (rótulo lido, objetos, luz) → limites.
2. Conversa: a aluna envia a foto (miniatura visível na mensagem) e pede descrição, legenda e
   texto alternativo; outra conversa lê um print de métricas e sugere ações.
3. Lista do que vai bem e do que tem limite (texto pequeno, contagens, rostos, detalhes
   inventados) e dicas de como mandar imagens.

### User Story 3 - Fotos e vídeos com o Claude como parceiro (Priority: P1)

**Acceptance Scenarios**:

1. Comparativo de prompts de imagem: pedido vago × pedido estruturado, cada um com o resultado
   ilustrativo do gerador de imagens, claramente rotulado como tal.
2. Conversa em que o Claude monta um prompt de imagem estruturado (artefato "prompt de imagem"
   com campos e versão final em português e em inglês).
3. Ciclo de refinamento: a aluna traz a imagem gerada, o Claude aponta o que corrigir e ajusta o
   prompt.
4. Conversa de vídeo: roteiro de Reels de 15 s (artefato "roteiro" com cenas, tempo, imagem,
   texto na tela e áudio) e prompts por cena para geradores de vídeo.

### User Story 4 - O segundo pedido (Priority: P1)

**Acceptance Scenarios**:

1. Módulo próprio "Ajustar sem recomeçar" com comparativo de segundo pedido vago × específico.
2. Anatomia do bom segundo pedido (manter, mudar, porquê, exemplo, limite, opções).
3. Tabela "troque isto → por isto" com pedidos vagos e suas versões específicas.
4. Conversa em várias rodadas, incluindo pedir para a IA criticar o próprio texto antes de
   reescrever.
5. Quando recomeçar uma conversa.

### User Story 5 - Mais prática (Priority: P2)

**Acceptance Scenarios**:

1. Cards de prática aceitam passos numerados e vários prompts copiáveis.
2. Todo módulo prático termina com prática; o último módulo traz um desafio integrado
   (texto → segundo pedido → imagem → vídeo → checagem).

### User Story 6 - Imagens e falas naturais (Priority: P2)

**Acceptance Scenarios**:

1. Ilustrações próprias (SVG locais em `img/`) nos slides de abertura, nos posts, na demo de
   visão e no comparativo de imagens; nenhuma imagem externa.
2. Mensagens da aluna soam como alguém digitando no dia a dia; respostas do assistente são
   calorosas e diretas, sem fórmulas ("Claro!", "Perfeito!", "Ótima pergunta").
3. Textos de slides e notas do instrutor em tom de conversa.

### Edge Cases

- Imagem ausente ou caminho errado: o texto alternativo aparece, sem quebrar o layout.
- Movimento reduzido: demo de próxima palavra e grade de visão sem animação, passos mantidos.
- 375 px: imagens se ajustam à largura; roteiro vira lista.
- Mais de 9 módulos: teclas 1–9 continuam funcionando; os demais pela visão geral.

## Requirements *(mandatory)*

- **FR-001**: Novos módulos: "O que é uma IA", "Ajustar sem recomeçar" (separado de "Pedir bem"),
  "Como o Claude vê imagens", "Fotos e vídeos com IA".
- **FR-002**: Novos blocos: `proxima-palavra`, `visao`, `imagem`, `antes-depois`.
- **FR-003**: Novos artefatos: `prompt-imagem`, `roteiro`; `post` aceita imagem ilustrativa.
- **FR-004**: Anexo de mensagem aceita `imagem` e mostra miniatura.
- **FR-005**: Módulos aceitam `imagem` exibida no slide de abertura.
- **FR-006**: `pratica` aceita `passos` e `prompts` (vários, cada um com botão de copiar).
- **FR-007**: Todas as imagens são arquivos locais em `img/` com texto alternativo vindo de
  `content.js`; continuam sem requisições externas além da fonte.
- **FR-008**: O conteúdo afirma explicitamente que o Claude não gera fotos/vídeos.
- **FR-009**: Diálogos e textos revisados para linguagem natural.
- **FR-010**: Restrições anteriores permanecem (file://, WCAG AA, 375–1440 px, sem marca
  Anthropic, conteúdo só em `content.js`).

## Success Criteria *(mandatory)*

- **SC-001**: 11 módulos funcionando nas três páginas, sem erros nem rolagem horizontal.
- **SC-002**: Pelo menos 8 slides com imagem.
- **SC-003**: Cada módulo a partir do 4º termina com prática; o desafio integrado tem ≥ 5 passos.
- **SC-004**: Nenhuma resposta do assistente começa com "Claro!", "Perfeito!" ou "Ótima".
- **SC-005**: Todos os testes passam em 1440 px e 375 px.

## Assumptions

- Ilustrações vetoriais próprias (não fotos de banco) por causa da regra de zero rede e de
  direitos de uso; o instrutor pode trocar por fotos reais colocando arquivos em `img/`.
- A duração passa de ~60 para ~90 minutos; as notas indicam o tempo sugerido por módulo.
- Geradores de imagem/vídeo são citados de forma genérica ("seu gerador de imagens").
