# PRD: Ambiente de Treinamento Interativo "Claude para Marketing"

## 1. Visão geral

Aplicação web estática que simula o ambiente de um assistente de IA (inspirado no Claude) para apoiar um treinamento individual de 1 hora com uma profissional de marketing e criação de conteúdo. A aplicação será usada como apresentação durante o treinamento e depois ficará disponível como material de consulta via GitHub Pages.

## 2. Objetivos

- Explicar visualmente os conceitos: interface, boas práticas de prompt, Projetos e Skills.
- Simular conversas de forma controlada (respostas pré-roteirizadas), sem dependência de API.
- Mostrar comparativos "antes vs. depois" (prompt fraco vs. prompt bom; sem Skill vs. com Skill).
- Servir como material de revisão autônoma após o treinamento.
- Direcionar a usuária para praticar no Claude real ao fim de cada módulo.

## 3. Público-alvo

Profissional de marketing, não técnica, com pouca ou nenhuma experiência com IA generativa. Produz posts, carrosséis, legendas, newsletters e roteiros.

## 4. Restrições importantes

- **Sem chamadas a APIs ou chaves de API.** Todo o conteúdo é roteirizado. O site será público; nenhuma credencial pode existir no código.
- **Sem identidade visual oficial da Anthropic.** Não usar logo, wordmark ou cores oficiais da marca Claude/Anthropic. A interface deve ser apenas *inspirada* em um chat de IA, com identidade própria. Nome sugerido na interface: "Ambiente de Treinamento".
- **Sem dados reais de empresas.** Usar uma marca fictícia em todos os exemplos (ver seção 8).
- **Hospedagem 100% estática** compatível com GitHub Pages (sem backend, sem build obrigatório).
- Idioma: português do Brasil.

## 5. Stack técnica

- HTML, CSS e JavaScript puros (vanilla), sem framework.
- Sem etapa de build. Abrir `index.html` localmente deve funcionar.
- Fontes: no máximo uma fonte do Google Fonts; fallback para fontes do sistema.
- Estrutura de arquivos:
  - `index.html`
  - `css/styles.css`
  - `js/app.js` (motor de navegação e simulação)
  - `js/content.js` (todo o conteúdo roteirizado, separado da lógica)
  - `README.md` (instruções de uso e deploy)
- O conteúdo deve ficar totalmente em `content.js`, num formato de dados simples, para que o instrutor edite textos sem mexer na lógica.

## 6. Funcionalidades

### 6.1 Navegação por módulos
- Barra lateral (ou menu) com a lista de módulos e indicação do módulo atual.
- Botões "Anterior" e "Próximo".
- Navegação por teclado: setas esquerda/direita para módulos; barra de espaço ou Enter para avançar a conversa.
- Indicador de progresso (ex.: "Módulo 3 de 7").
- Progresso salvo em `localStorage` (retomar de onde parou).

### 6.2 Chat simulado
- Interface de chat com mensagens da usuária e do assistente.
- As mensagens aparecem ao clicar em "Avançar" (modo apresentação), não automaticamente.
- Mensagem da usuária: aparece com efeito de digitação no campo de entrada e depois é "enviada".
- Resposta do assistente: indicador de "pensando" curto, seguido de texto aparecendo progressivamente (efeito streaming).
- Botão "Pular animação" para exibir tudo de uma vez.
- Botão "Reiniciar conversa" por módulo.
- Suporte a formatação básica nas respostas (negrito, listas, quebras de linha).

### 6.3 Comparativo lado a lado
- Componente com duas colunas: "Antes" e "Depois".
- Cada coluna contém um mini chat simulado.
- Em telas pequenas, vira abas ("Antes" / "Depois").

### 6.4 Painel de artefato
- Algumas respostas abrem um painel lateral exibindo o resultado visual.
- Tipos necessários:
  - **Carrossel de Instagram:** slides quadrados navegáveis (setas), com texto de cada slide.
  - **Legenda de post:** card simulando um post de rede social (avatar genérico, texto, hashtags).
  - **E-mail/newsletter:** card com assunto e corpo.
- Botão "Copiar texto" em cada artefato.

### 6.5 Painel de Projeto simulado
- Visualização de um "Projeto" com: nome, instruções do projeto e lista de arquivos de conhecimento (ícones e nomes fictícios, como "guia-de-tom-de-voz.pdf").
- Usado no módulo de Projetos para mostrar onde o contexto fica guardado.

### 6.6 Visualizador de Skill
- Exibição de uma Skill como um "arquivo" com nome, descrição e instruções.
- Animação curta mostrando a Skill sendo "carregada" quando a tarefa correspondente aparece na conversa (ex.: um selo "Skill em uso: carrossel-cafe-serra").

### 6.7 Chamada para prática
- Ao final de cada módulo prático, um card "Agora tente no Claude" com:
  - O prompt sugerido para a usuária testar.
  - Botão "Copiar prompt".
  - Link para https://claude.ai abrindo em nova aba.

### 6.8 Modo apresentação vs. modo estudo
- **Apresentação:** conversas avançam por clique; ideal para o instrutor conduzir.
- **Estudo:** conversas aparecem completas, com notas explicativas visíveis.
- Alternância por botão no topo.

### 6.9 Notas explicativas
- Cada mensagem pode ter uma "nota do instrutor" opcional (ícone de "i") que explica por que aquele prompt funciona. Visível no modo estudo ou ao clicar.

## 7. Conteúdo: módulos

### Módulo 1: Boas-vindas
- Objetivo do treinamento e o que ela vai sair sabendo fazer.
- Visão geral dos módulos.

### Módulo 2: Conhecendo o ambiente
- Tour guiado pela interface simulada com destaques (tooltips) em: campo de mensagem, envio de arquivos, histórico de conversas, Projetos.
- Texto curto explicando que o Claude é um assistente de IA que conversa, escreve, analisa arquivos e pesquisa.

### Módulo 3: Pedir bem (comparativo)
- Antes: "faz um post sobre nosso café novo".
- Depois: prompt com contexto (público, objetivo, tom, tamanho, CTA, exemplo de referência).
- Mostrar a diferença de qualidade nas respostas.
- Card de princípios: dar contexto, ser específico, mostrar exemplos, iterar.
- Mini demonstração de iteração: "deixe mais curto", "troque o tom para mais divertido".
- Chamada para prática.

### Módulo 4: Projetos como base da marca
- Painel do Projeto "Café Serra – Conteúdo" com instruções e arquivos.
- Conversa dentro do Projeto em que o assistente já segue o tom de voz sem precisar repetir contexto.
- Explicação: Projeto guarda o *contexto* de um trabalho.

### Módulo 5: Skills
- Explicação: Skill é um pacote de instruções que ensina um *procedimento*, carregado automaticamente quando a tarefa aparece, utilizável em qualquer conversa.
- Comparativo Projeto vs. Skill em tabela simples.
- Visualizador da Skill "carrossel-cafe-serra" (ver exemplo na seção 8).
- Conversa: usuária pede ajuda para criar a Skill; assistente faz perguntas e monta a Skill.
- Conversa nova: usuária pede "um carrossel sobre o café de inverno"; selo "Skill em uso" aparece; artefato de carrossel abre no painel.
- Outras ideias de Skills listadas: revisão de tom de voz, briefing para designer, roteiro de Reels.
- Chamada para prática: "Me ajude a criar uma skill para [tarefa repetitiva]".

### Módulo 6: Reaproveitamento de conteúdo
- Conversa: usuária envia um artigo de blog fictício e pede um carrossel, três legendas e um e-mail.
- Três artefatos gerados, navegáveis.
- Chamada para prática.

### Módulo 7: Cuidados e próximos passos
- Conferir dados e estatísticas antes de publicar.
- Revisão humana do texto final; a voz da marca é responsabilidade dela.
- Não pedir reprodução de letras de música, personagens ou materiais de terceiros.
- Verificar a política da empresa antes de enviar dados de clientes.
- Desafio da semana: usar o Claude em uma tarefa real por dia e transformar uma tarefa repetitiva em Skill.
- Links: https://claude.ai, https://support.claude.com, https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview

## 8. Dados fictícios

**Marca:** Café Serra, cafeteria e torrefação artesanal mineira.
- Público: adultos de 25 a 45 anos que valorizam café especial e produção local.
- Tom de voz: acolhedor, próximo, com toques de mineiridade, sem exageros; frases curtas; evita jargão técnico de barista.
- Produtos de exemplo: Café de Inverno (blend com notas de chocolate e canela), Coado da Casa, Kit Presente.

**Exemplo de Skill (exibida no Módulo 5):**
- Nome: carrossel-cafe-serra
- Descrição: Use ao criar carrosséis de Instagram para a Café Serra.
- Instruções resumidas:
  - 6 a 8 slides.
  - Slide 1: gancho em até 8 palavras.
  - Slides intermediários: uma ideia por slide, até 25 palavras.
  - Último slide: CTA convidando a visitar a loja ou o site.
  - Seguir o tom de voz da marca.
  - Entregar também sugestão de legenda com até 3 hashtags.

## 9. Design

- Visual limpo, claro, com bastante espaço em branco.
- Paleta própria e neutra (ex.: off-white, cinza grafite, um tom de destaque terroso que remeta a café). Não usar a paleta oficial da Anthropic.
- Tema claro por padrão; tema escuro opcional (seguir preferência do sistema).
- Responsivo: funcionar bem em notebook (uso principal) e em celular (revisão posterior).
- Animações suaves e curtas; respeitar `prefers-reduced-motion` (desativar animações de digitação/streaming nesse caso).

## 10. Acessibilidade

- Contraste mínimo WCAG AA.
- Todos os controles acessíveis por teclado, com foco visível.
- `aria-live` na área de chat para leitores de tela.
- Textos alternativos em ícones e imagens.

## 11. Critérios de aceite

- [ ] Abre localmente com duplo clique em `index.html`, sem servidor.
- [ ] Funciona publicado no GitHub Pages sem ajustes.
- [ ] Nenhuma chamada de rede além de fonte opcional.
- [ ] Os 7 módulos estão implementados com o conteúdo descrito.
- [ ] Todo o texto editável está em `js/content.js`.
- [ ] Modos apresentação e estudo funcionam.
- [ ] Navegação por teclado funciona em todos os módulos.
- [ ] Progresso persiste após recarregar a página.
- [ ] Botões "Copiar" funcionam.
- [ ] Layout funciona em 375px e 1440px de largura.
- [ ] Nenhum logo, nome de produto estilizado ou paleta oficial da Anthropic.

## 12. Fora de escopo

- Integração com API real.
- Login, analytics ou coleta de dados.
- Editor visual de conteúdo.

## 13. Entregáveis

- Código-fonte conforme a estrutura da seção 5.
- `README.md` com: como rodar localmente, como editar o conteúdo em `content.js` (com exemplo de como adicionar uma mensagem ou módulo) e passo a passo de publicação no GitHub Pages.