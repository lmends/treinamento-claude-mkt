# Ambiente de Treinamento · IA para Marketing

Site estático e interativo que simula um assistente de IA para um treinamento individual de 1 hora
sobre o uso do Claude no marketing e na criação de conteúdo. Todas as conversas são
**roteirizadas**: não há API, chave ou coleta de dados. Os exemplos usam a marca fictícia
**Café Serra**.

São 7 módulos: Boas-vindas · Conhecendo o ambiente · Pedir bem · Projetos · Skills ·
Reaproveitamento de conteúdo · Cuidados e próximos passos.

---

## 1. Como usar localmente

1. Baixe ou clone esta pasta.
2. Dê **duplo clique em `index.html`**. Pronto: não precisa instalar nada nem rodar servidor.

### Atalhos e modos

| Ação | Como |
|------|------|
| Trocar de módulo | Setas **←** e **→**, botões *Anterior/Próximo* ou a lista lateral |
| Avançar a conversa | **Espaço** ou **Enter** (ou o botão *Avançar*) |
| Concluir a mensagem que está animando | **Espaço** de novo |
| Mostrar a conversa inteira | *Pular animação* |
| Recomeçar a conversa | *Reiniciar conversa* |
| Fechar painel/menu | **Esc** |

- **Modo apresentação** (padrão): as conversas avançam por clique; ideal para conduzir o treinamento.
- **Modo estudo**: conversas completas e notas do instrutor visíveis; ideal para revisão.
- O material lembra o módulo, o modo e o tema (claro/escuro) no próprio navegador.
- Cada módulo tem endereço próprio, por exemplo `index.html#skills`.

Dica para apresentar: use o navegador em tela cheia (**F11**). Em telas a partir de 1100 px,
os artefatos (carrossel, post, e-mail) abrem num painel ao lado da conversa automaticamente.

---

## 2. Como editar o conteúdo

**Todo o texto fica em [`js/content.js`](js/content.js).** Você não precisa mexer em
`app.js`, `styles.css` nem `index.html`. Abra `content.js` em qualquer editor de texto
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
| `nota` | Nota do instrutor, exibida no ícone **i** e no modo estudo |
| `anexo` | Só para a aluna: `{ nome: "briefing.pdf", conteudo: "texto opcional" }` |
| `skill` | Só para o assistente: mostra o selo "Skill em uso: …" |
| `artefatos` | Só para o assistente: lista de artefatos que abrem no painel |

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

O indicador "Módulo X de N" e a visão geral do Módulo 1 se atualizam sozinhos.

### Tipos de bloco disponíveis

| `tipo` | Campos principais |
|--------|-------------------|
| `texto` | `titulo`, `texto` |
| `destaque` | `icone`, `titulo`, `texto`, `cor: "verde"` (opcional) |
| `cards` | `titulo`, `itens: [{ icone, titulo, texto }]` |
| `visao-geral` | `titulo` (lista os módulos automaticamente) |
| `chat` | `tituloBloco`, `titulo`, `contexto`, `mensagens` |
| `comparativo` | `titulo`, `texto`, `antes: { rotulo, titulo, mensagens }`, `depois: { ... }` |
| `projeto` | `nome`, `descricao`, `instrucoes`, `arquivos: [{ nome, tamanho }]` |
| `skill` | `nome`, `descricao`, `instrucoes: ["..."]` |
| `tabela` | `titulo`, `colunas: [...]`, `linhas: [[...], ...]` |
| `tour` | `interfaceSimulada: { ... }`, `passos: [{ alvo, titulo, texto }]` (alvos: `campo-mensagem`, `anexar`, `historico`, `projetos`) |
| `pratica` | `titulo` (opcional), `texto`, `prompt`, `link` (padrão: https://claude.ai) |
| `links` | `titulo`, `itens: [{ rotulo, url, descricao }]` |

### Tipos de artefato

```js
{ tipo: "carrossel", titulo: "...", slides: ["...", "..."], legenda: "...", hashtags: ["#..."] }
{ tipo: "post", titulo: "...", posts: [{ texto: "...", hashtags: ["#..."], imagem: "descrição da imagem" }] }
{ tipo: "email", titulo: "...", assunto: "...", preCabecalho: "...", corpo: "...", botao: "..." }
```

Os textos de botões e avisos da interface ficam no início de `content.js`, em `interface`.

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
Para atualizar, basta editar `content.js` e enviar de novo (commit + push).

---

## 4. Estrutura

```text
index.html          estrutura da página
css/styles.css      visual (tema claro/escuro, responsivo)
js/content.js       TODO o conteúdo do treinamento  ← edite aqui
js/app.js           navegação e simulação das conversas
tests/              testes automatizados (opcional, só para desenvolvimento)
specs/, .specify/   documentação do desenvolvimento (spec-kit)
```

### Testes automatizados (opcional)

Requer Node.js 18+:

```bash
cd tests
npm install
npx playwright install chromium
npx playwright test
```

Os testes abrem o `index.html` via `file://` em 1440 px e 375 px e verificam navegação por
teclado, persistência, modos, comparativo, artefatos, cópia, tour, tema escuro, movimento
reduzido, ausência de rolagem horizontal e ausência de requisições além da fonte.

---

## Privacidade e marca

- Nenhuma chamada a APIs. A única requisição externa é a fonte *Inter* (Google Fonts); sem
  internet, o site usa a fonte do sistema.
- Nada é enviado a servidores. O progresso fica só no `localStorage` do seu navegador.
- A interface tem identidade visual própria e não usa logo, nome estilizado nem cores oficiais da
  Anthropic. "Café Serra" é uma marca fictícia criada para os exemplos.
