# Data Model: Ambiente de Treinamento

Todo o modelo vive em `window.CONTEUDO` (arquivo `js/content.js`). Chaves em português para
facilitar a edição pelo instrutor. Contrato detalhado: [contracts/content-schema.md](./contracts/content-schema.md).

## Entidades

### Conteudo (raiz)
| Campo | Tipo | Regra |
|-------|------|-------|
| `interface` | objeto de rótulos | textos de botões/avisos da UI; todos com valor padrão no código só como fallback técnico |
| `marca` | `{ nome, usuario, iniciais }` | usada nos artefatos de post |
| `modulos` | `Modulo[]` | 1+; ordem = ordem de navegação |

### Modulo
| Campo | Tipo | Regra |
|-------|------|-------|
| `id` | string | único, só `a-z0-9-`; usado no hash da URL e no progresso |
| `titulo` | string | obrigatório |
| `resumo` | string | subtítulo; aparece na lista e na visão geral |
| `blocos` | `Bloco[]` | renderizados em ordem |

### Bloco (união por `tipo`)
`texto`, `cards`, `visao-geral`, `chat`, `comparativo`, `projeto`, `skill`, `tabela`, `tour`,
`pratica`, `links`, `destaque`. Campos por tipo no contrato.

### Conversa (`chat` e colunas do `comparativo`)
| Campo | Tipo | Regra |
|-------|------|-------|
| `titulo` | string? | cabeçalho do mini chat |
| `contexto` | string? | faixa acima das mensagens (ex.: "Dentro do Projeto …") |
| `mensagens` | `Mensagem[]` | 1+ |

### Mensagem
| Campo | Tipo | Regra |
|-------|------|-------|
| `autor` | `"aluna"` \| `"assistente"` | obrigatório |
| `texto` | string (mini-markdown) | obrigatório |
| `nota` | string? | nota do instrutor (ícone "i") |
| `anexo` | `{ nome, conteudo? }`? | só para `aluna` |
| `skill` | string? | só para `assistente`; mostra selo "Skill em uso" |
| `artefatos` | `Artefato[]`? | só para `assistente`; abre painel |

### Artefato (união por `tipo`)
- `carrossel`: `titulo`, `slides: string[]`, `legenda?`, `hashtags?: string[]`
- `post`: `titulo`, `posts: { texto, hashtags?: string[], imagem? }[]`
- `email`: `titulo`, `assunto`, `preCabecalho?`, `corpo` (mini-markdown), `botao?`

### Progresso (localStorage `treinamento-cafe-serra:v1`)
`{ modulo: <id>, modo: "apresentacao"|"estudo", tema: "auto"|"claro"|"escuro" }`

## Estados da Conversa

```text
inicial ──avançar──▶ animando ──conclui/pular──▶ ocioso(n mensagens) ──…──▶ concluída
   ▲                                                                            │
   └───────────────────────────── reiniciar ◀───────────────────────────────────┘
modo estudo / reduced-motion: inicial ─▶ concluída (render direto)
```

## Regras de validação (aplicadas em tempo de execução, com tolerância)
- Módulo salvo inexistente → índice 0.
- Bloco de tipo desconhecido → aviso visível "Bloco desconhecido: <tipo>" (ajuda o editor).
- Campos opcionais ausentes não quebram a renderização.
