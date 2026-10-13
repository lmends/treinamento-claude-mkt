# Data Model: Apresentação em slides e subpáginas

## Bloco (content.js) — campos novos opcionais

| Campo | Tipo | Uso |
|---|---|---|
| `slide` | objeto ou `false` | Campos que substituem os do bloco no deck (ex.: texto mais curto, outro `tipo`). `false` oculta o bloco no deck. |
| `soNosSlides` | booleano | Bloco aparece só no deck. |
| `passoAPasso` | booleano | Itens (cards, linhas, instruções) revelados um por avanço no deck. |
| `nota` | texto | Lembrete do instrutor para o bloco: só no painel de notas (N) do deck. |

Tipos de bloco: `texto`, `destaque`, `cards`, `visao-geral`, `chat`, `comparativo`, `projeto`,
`skill`, `tabela`, `tour`, `pratica`, `links`, e novo `frase` (frase de impacto, só título grande
+ apoio opcional).

## Slide (derivado em runtime)

```
{ indice, modulo (índice), id ("pedir-bem/3"), tipo ("abertura" | "capa" | tipo do bloco),
  titulo (para visão geral e anúncio), bloco (efetivo, após override) }
```

Controlador: `{ elemento, avancar() → bool, concluido() → bool, completar(), notas() → [{titulo,
texto, atual}], destruir() }`.

## Estado salvo (`treinamento-cafe-serra:v2`)

```
{ tema: "auto" | "claro" | "escuro",
  deck:   { modulo: "pedir-bem", slide: 3 },
  estudo: { modulo: "projetos", concluidos: ["boas-vindas", …] } }
```

Hash: deck `#pedir-bem/3` (0 = abertura do módulo; capa geral = `#inicio`); estudo `#pedir-bem`.
