# Ambiente de Treinamento · IA para Marketing

Site estático e interativo que simula um assistente de IA para um treinamento individual de 1 hora
sobre o uso do Claude no marketing e na criação de conteúdo. Todas as conversas são
**roteirizadas**: não há API, chave ou coleta de dados. Os exemplos usam a marca fictícia
**Café Serra**.

São 11 módulos (cerca de 90 minutos): Boas-vindas · O que é uma IA · Conhecendo o ambiente ·
Pedir bem · Ajustar sem recomeçar · Como o Claude “vê” imagens · Fotos e vídeos com IA ·
Projetos · Skills · Reaproveitamento de conteúdo · Cuidados e próximos passos.

---

## 1. Como usar localmente

1. Baixe ou clone esta pasta.
2. Dê **duplo clique em `index.html`**. Pronto: não precisa instalar nada nem rodar servidor.

O site tem três páginas:

| Página | Para quê |
|--------|----------|
| `index.html` (capa) | Escolher entre **Apresentar** e **Estudar**, ver os módulos e o progresso |
| `apresentacao.html` | **Slides em tela cheia** para conduzir o treinamento |
| `estudo.html` | **Material de consulta**, um módulo por vez |

### Apresentação em slides

Cada módulo começa com um slide de abertura, e cada bloco do conteúdo vira um slide. Os
elementos entram com animação, as conversas acontecem dentro do slide (digitação, "pensando",
texto aparecendo) e os resultados (carrossel, legendas, e-mail) surgem ao lado do chat.

| Ação | Tecla |
|------|-------|
| Avançar (próximo item, próxima mensagem ou próximo slide) | **→**, **Espaço**, **Enter** ou **PageDown** |
| Voltar ao slide anterior | **←**, **PageUp** ou **Backspace** |
| Ir para o módulo 1–10 | **1** a **9** e **0** (módulo 10); os demais pela visão geral |
| Primeiro / último slide | **Home** / **End** |
| Visão geral de todos os slides | **O** |
| Notas do instrutor | **N** |
| Tela cheia | **F** |
| Tela preta (pausa) | **B** (qualquer tecla volta) |

- Avançar enquanto uma mensagem está sendo digitada conclui a mensagem na hora.
- No celular ou tablet, **deslize para o lado** ou use os botões da barra inferior.
- Com o mouse parado, a barra de controles some sozinha; mexa o mouse para ela voltar.
- A barra fina no rodapé mostra o progresso de cada módulo; clique num trecho para pular.
- Cada slide tem endereço próprio (ex.: `apresentacao.html#skills/5`) e a apresentação lembra
  onde parou.

### Estudo

- Conversas completas, com as **notas do instrutor** visíveis.
- **Ver animação** reproduz qualquer conversa no lugar; **Mostrar tudo** encerra a animação.
- Os resultados aparecem logo abaixo da resposta, com abas e botão **Copiar texto**.
- Índice "Nesta página", tempo estimado de leitura e barra de progresso de leitura.
- **Busca rápida** no topo (atalho **/** ou **Ctrl+K**): procura em todos os módulos, ignora
  acentos ("cafe" encontra "café"), mostra o trecho com o termo destacado e leva direto à seção.
  Use **↑ ↓** e **Enter** para escolher; **Esc** fecha.
- **Concluí este módulo** marca o módulo (✓ na lista lateral e na capa).
- Setas **←** **→** trocam de módulo. Endereço por módulo, ex.: `estudo.html#skills`.

O tema claro/escuro segue o sistema e pode ser trocado pelo botão de sol/lua em qualquer página.

---

## 2. Como editar o conteúdo

**Todo o texto fica em [`js/content.js`](js/content.js).** Você não precisa mexer em
nenhum outro arquivo: os slides e a página de estudo são gerados a partir dele. Abra `content.js` em qualquer editor de texto
(Bloco de Notas, VS Code etc.), altere e recarregue a página.

### Regras básicas

- Textos ficam entre aspas: `"assim"`. Para usar aspas dentro do texto: `\"assim\"`.
- `\n` quebra a linha; `\n\n` começa um novo parágrafo.
- Formatação: `**negrito**`, `*itálico*`, linhas começando com `- ` viram lista e com `1. ` viram
  lista numerada.
- Itens de uma lista `[ ... ]` são separados por vírgula.
- Se algo sumir da tela depois de editar, quase sempre é uma vírgula ou aspa faltando. Abra o
  console do navegador (**F12**) para ver o erro e a linha.

### Exemplo: adicionar uma mensagem a uma conversa

Procure a conversa (bloco com `tipo: "chat"`) e acrescente um item na lista `mensagens`:

```js
mensagens: [
  { autor: "aluna", texto: "Desenvolve a 3 como legenda." },
  { autor: "assistente", texto: "Fechado! A legenda está no painel ao lado." },

  // ↓ nova mensagem
  {
    autor: "aluna",
    texto: "Agora faz uma versão para o LinkedIn.",
    nota: "Mostre que dá para reaproveitar a mesma ideia em outra rede."
  }
]
```

Campos de uma mensagem:

| Campo | Para quê |
|-------|----------|
| `autor` | `"aluna"` ou `"assistente"` (obrigatório) |
| `texto` | O conteúdo da mensagem (obrigatório) |
| `nota` | Nota do instrutor: visível no estudo e no painel de notas (**N**) dos slides |
| `anexo` | Só para a aluna: `{ nome: "briefing.pdf", conteudo: "texto opcional" }` ou, para imagem, `{ nome: "foto.jpg", imagem: "img/foto.jpg", alt: "descrição" }` |
| `skill` | Só para o assistente: mostra o selo "Skill em uso: …" |
| `conector` | Só para o assistente: mostra o selo "Conector em uso: …" (ex.: um gerador de imagens conectado) |
| `artefatos` | Só para o assistente: resultados (carrossel, legendas, e-mail) exibidos ao lado do chat nos slides e abaixo da resposta no estudo |

### Exemplo: adicionar um módulo

Em `modulos: [ ... ]`, acrescente um objeto (a ordem da lista é a ordem de navegação):

```js
{
  id: "datas-comemorativas",            // só letras minúsculas, números e hífens
  titulo: "Datas comemorativas",
  resumoCurto: "Planejamento do mês",    // aparece na lista lateral
  resumo: "Como montar um calendário de posts com a ajuda da IA.",
  blocos: [
    { tipo: "texto", titulo: "Por que planejar", texto: "Planejar evita correria..." },
    {
      tipo: "chat",
      titulo: "Nova conversa",
      mensagens: [
        { autor: "aluna", texto: "Liste as datas de dezembro relevantes para uma cafeteria." },
        { autor: "assistente", texto: "Claro! Aqui vão algumas:\n\n- Natal\n- Réveillon" }
      ]
    },
    { tipo: "pratica", prompt: "Monte um calendário de posts para [mês] da [sua marca]." }
  ]
},
```

O novo módulo aparece sozinho na capa, no estudo e nos slides (com slide de abertura, atalho
numérico e trecho na barra de progresso).

### Ajustar um bloco só para os slides

Os mesmos blocos alimentam o estudo e os slides. Quando um texto é longo demais para projetar,
use o campo `slide` para trocar só o que aparece na apresentação:

```js
{
  tipo: "texto",
  titulo: "O problema",
  texto: "Toda conversa nova começa do zero. Explicar o tom de voz...",   // estudo
  slide: {                                                                 // slides
    tipo: "frase",
    texto: "Toda conversa nova começa **do zero**.",
    apoio: "O Projeto guarda as instruções e os arquivos de um trabalho."
  },
  nota: "Pergunte quantas vezes por semana ela explica o tom da marca."    // tecla N
}
```

| Campo do bloco | Efeito |
|----------------|--------|
| `slide: { ... }` | Campos que substituem os do bloco **só nos slides** (pode até trocar o `tipo`) |
| `slide: false` | O bloco aparece só no estudo |
| `soNosSlides: true` | O bloco aparece só nos slides |
| `passoAPasso: true` | Cards, linhas da tabela ou instruções da skill entram **um por avanço** |
| `nota: "..."` | Lembrete para o instrutor no painel de notas (**N**) |

### Tipos de bloco disponíveis

| `tipo` | Campos principais |
|--------|-------------------|
| `texto` | `titulo`, `texto` |
| `destaque` | `icone`, `titulo`, `texto`, `cor: "verde"` (opcional) |
| `frase` | `texto` (frase de impacto), `apoio` (opcional), `icone` (opcional) |
| `imagem` | `titulo`, `texto` (opcional, fica ao lado da imagem), `src`, `alt`, `legenda` |
| `proxima-palavra` | `titulo`, `texto`, `rodadas: [{ frase, opcoes: [{ palavra, chance }], escolhida }]`, `conclusao` |
| `visao` | `titulo`, `src`, `alt`, `arquivo`, `resposta`, `etapas: [{ titulo, texto, grade, numeros, marcacoes, resposta, semGrade }]`, `marcacoes: [{ x, y, rotulo, lado }]` (x e y em %) |
| `video` | `titulo`, `texto`, `alt`, `cenas: [{ tempo, visual, foco, efeito, origem, textoTela, audio }]` — prévia simulada de Reels; `efeito`: `zoom-in`, `zoom-out`, `pan-esquerda`, `pan-direita`; `origem`: `ia` ou `loja` |
| `antes-depois` | `titulo`, `texto`, `antes: { rotulo, prompt, src, alt, comentario }`, `depois: { … }` |
| `cards` | `titulo`, `itens: [{ icone, titulo, texto }]` |
| `visao-geral` | `titulo` (lista os módulos automaticamente) |
| `chat` | `tituloBloco`, `titulo`, `contexto`, `mensagens` |
| `comparativo` | `titulo`, `texto`, `antes: { rotulo, titulo, mensagens }`, `depois: { ... }` |
| `projeto` | `nome`, `descricao`, `instrucoes`, `arquivos: [{ nome, tamanho }]` |
| `skill` | `nome`, `descricao`, `instrucoes: ["..."]` |
| `tabela` | `titulo`, `colunas: [...]`, `linhas: [[...], ...]` |
| `tour` | `interfaceSimulada: { ... }`, `passos: [{ alvo, titulo, texto }]` (alvos: `campo-mensagem`, `anexar`, `historico`, `projetos`) |
| `pratica` | `titulo` (opcional), `texto`, `passos: ["…"]`, `prompt` **ou** `prompts: [{ rotulo, texto }]`, `link` (padrão: https://claude.ai) |
| `links` | `titulo`, `itens: [{ rotulo, url, descricao }]` |

### Tipos de artefato

```js
{ tipo: "carrossel", titulo: "...", slides: ["...", "..."], legenda: "...", hashtags: ["#..."] }
{ tipo: "post", titulo: "...", posts: [{ texto: "...", hashtags: ["#..."], imagem: "descrição da imagem" }] }
{ tipo: "email", titulo: "...", assunto: "...", preCabecalho: "...", corpo: "...", botao: "..." }
{ tipo: "prompt-imagem", titulo: "...", campos: [{ rotulo, valor }], prompt: "...", promptIngles: "...", evitar: "..." }
{ tipo: "roteiro", titulo: "...", formato: "Reels · 9:16 · 15 s", cenas: [{ tempo, imagem, textoTela, audio, promptVideo }], legenda, hashtags }
{ tipo: "imagem", titulo: "...", src: "img/...", alt: "...", ferramenta: "...", prompt: "..." }
```

Nos posts, use `foto: "img/arquivo.svg"` para mostrar uma imagem e `imagem: "descrição"` como texto
alternativo.

### Imagens

As ilustrações ficam em `img/` (arquivos SVG próprios, sem fotos de banco e sem internet). Para usar
fotos reais da sua marca, copie o arquivo para `img/` (ex.: `img/minha-foto.jpg`) e troque o
caminho no `content.js`. Escreva sempre o `alt`, a descrição da imagem para quem usa leitor de tela.
Um módulo pode ter `imagem` e `imagemAlt` para ganhar ilustração no slide de abertura e no topo da
página de estudo.

Os textos de botões e avisos ficam no início de `content.js`, em `interface`. O título e o
subtítulo da capa (e do primeiro slide) ficam em `apresentacao`.

---

## 3. Publicar no GitHub Pages

1. Crie um repositório no GitHub (ex.: `treinamento-ia-marketing`).
2. Envie os arquivos desta pasta:
   ```bash
   git remote add origin https://github.com/SEU-USUARIO/treinamento-ia-marketing.git
   git push -u origin main
   ```
   (Ou, pelo site do GitHub, use **Add file → Upload files** e arraste a pasta.)
3. No repositório, vá em **Settings → Pages**.
4. Em **Build and deployment → Source**, escolha **Deploy from a branch**.
5. Selecione a branch **main** e a pasta **/ (root)** e clique em **Save**.
6. Em 1 ou 2 minutos o site estará em `https://SEU-USUARIO.github.io/treinamento-ia-marketing/`.

Não há etapa de build. O arquivo `.nojekyll` faz o GitHub Pages servir os arquivos como estão.
Para atualizar, basta editar `content.js` e enviar de novo (commit + push). Os endereços
ficam `.../index.html`, `.../apresentacao.html` e `.../estudo.html`.

---

## 4. Estrutura

```text
index.html            capa (leve: não carrega o motor de conversas)
apresentacao.html     slides
estudo.html           material de estudo
css/base.css          cores, tema claro/escuro, botões
css/componentes.css   chat, cards, artefatos e demais componentes
css/inicio.css        capa
css/apresentacao.css  slides (transições, tipografia de palco)
img/                  ilustrações usadas nos slides e no estudo
css/estudo.css        página de estudo
js/content.js         TODO o conteúdo do treinamento  ← edite aqui
js/comum.js           utilitários compartilhados (textos, tema, progresso salvo)
js/componentes.js     simulação das conversas, artefatos e componentes
js/inicio.js          capa
js/apresentacao.js    motor dos slides
js/estudo.js          página de estudo
tests/                testes automatizados (opcional, só para desenvolvimento)
specs/, .specify/     documentação do desenvolvimento (spec-kit)
```

### Testes automatizados (opcional)

Requer Node.js 18+:

```bash
cd tests
npm install
npx playwright install chromium
npx playwright test
```

Os testes abrem as três páginas via `file://` em 1440 px e 375 px e verificam: todos os slides e
módulos sem erros nem rolagem horizontal, teclado e controles dos slides, revelação passo a
passo, conversas animadas, artefatos e cópia, visão geral, notas, tela preta, movimento
reduzido, estudo (animação, conclusão, abas), tema e ausência de requisições além da fonte.

---

## Privacidade e marca

- Nenhuma chamada a APIs. A única requisição externa é a fonte *Inter* (Google Fonts); sem
  internet, o site usa a fonte do sistema.
- Nada é enviado a servidores. O progresso fica só no `localStorage` do seu navegador.
- A interface tem identidade visual própria e não usa logo, nome estilizado nem cores oficiais da
  Anthropic. "Café Serra" é uma marca fictícia criada para os exemplos.
