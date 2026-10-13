# Contrato: `window.CONTEUDO` (v2)

Compatível com a v1 (feature 001). Acréscimos:

```js
window.CONTEUDO = {
  interface: { /* rótulos; novos: capa, deck e estudo (ver content.js) */ },
  marca: { nome, usuario, iniciais },
  apresentacao: {            // NOVO: slide de capa do deck e textos da capa do site
    kicker, titulo, subtitulo, rodape
  },
  modulos: [{
    id, titulo, resumoCurto, resumo,
    blocos: [{
      tipo, /* campos do tipo */,
      nota?,                 // NOVO
      passoAPasso?,          // NOVO
      soNosSlides?,          // NOVO
      slide?: false | { /* campos que substituem os do bloco no deck */ }   // NOVO
    }]
  }]
};
```

Novo tipo `frase`: `{ tipo: "frase", texto: "Frase grande", apoio?: "texto menor", icone? }`.

Regras:
- `slide` é mesclado superficialmente (`Object.assign({}, bloco, bloco.slide)`).
- Um bloco `chat` cujas mensagens têm `artefatos` ganha coluna de resultado no deck.
- Nenhum outro arquivo pode conter textos do treinamento.
