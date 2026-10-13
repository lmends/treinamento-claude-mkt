# Contrato: formato de `js/content.js`

`content.js` MUST atribuir um único objeto a `window.CONTEUDO`. `app.js` só lê esse objeto.

## Mini-markdown aceito em campos `texto`/`corpo`

| Sintaxe | Resultado |
|---------|-----------|
| `**negrito**` | **negrito** |
| `*itálico*` | *itálico* |
| linha começando com `- ` | item de lista com marcador |
| linha começando com `1. ` | item de lista numerada |
| linha em branco | novo parágrafo |
| quebra de linha simples | quebra de linha |
| `### Título` | subtítulo |

HTML digitado no conteúdo é exibido como texto (escapado).

## Blocos

```js
{ tipo: "texto", titulo?: "…", texto: "mini-markdown" }
{ tipo: "destaque", icone?: "💡", titulo?: "…", texto: "…" }          // caixa de destaque
{ tipo: "cards", titulo?: "…", itens: [{ icone?, titulo, texto }] }
{ tipo: "visao-geral", titulo?: "…" }                                  // lista automática dos módulos
{ tipo: "chat", titulo?, contexto?, mensagens: [Mensagem] }
{ tipo: "comparativo", titulo?, texto?,
  antes:  { rotulo?: "Antes",  titulo?, mensagens: [Mensagem] },
  depois: { rotulo?: "Depois", titulo?, mensagens: [Mensagem] } }
{ tipo: "projeto", nome, descricao?, instrucoes: "…", arquivos: [{ nome, tamanho? }] }
{ tipo: "skill", nome, descricao, instrucoes: ["…"] }
{ tipo: "tabela", titulo?, colunas: ["…"], linhas: [["…"]] }
{ tipo: "tour", titulo?, texto?, interfaceSimulada: {…}, passos: [{ alvo, titulo, texto }] }
   // alvo ∈ "campo-mensagem" | "anexar" | "historico" | "projetos"
{ tipo: "pratica", titulo?, texto?, prompt: "…", link?: "https://claude.ai" }
{ tipo: "links", titulo?, itens: [{ rotulo, url, descricao? }] }
```

## Mensagem

```js
{ autor: "aluna" | "assistente", texto: "…",
  nota?: "…", anexo?: { nome, conteudo? }, skill?: "nome-da-skill",
  artefatos?: [Artefato] }
```

## Artefatos

```js
{ tipo: "carrossel", titulo, slides: ["…"], legenda?: "…", hashtags?: ["#…"] }
{ tipo: "post", titulo, posts: [{ texto, hashtags?: ["#…"], imagem?: "descrição da imagem" }] }
{ tipo: "email", titulo, assunto, preCabecalho?, corpo: "mini-markdown", botao?: "…" }
```

## Texto "Copiar texto" gerado por artefato
- carrossel: `Slide N: <texto>` por linha, depois `Legenda: …` e hashtags.
- post: cada post com texto + hashtags, separados por linha em branco.
- email: `Assunto: …`, `Pré-cabeçalho: …`, corpo em texto puro, botão.
