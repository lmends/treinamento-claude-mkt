# Quickstart: validar o Ambiente de Treinamento

## Pré-requisitos
- Um navegador moderno. Para os testes automatizados: Node.js 18+.

## Uso manual
1. Dê duplo clique em `index.html` (abre via `file://`).
2. Pressione `→` até o Módulo 3; pressione `Espaço` várias vezes: as colunas "Antes" e
   "Depois" avançam uma mensagem por vez.
3. Recarregue a página: continua no Módulo 3.
4. Clique em "Modo estudo": todas as conversas aparecem completas com notas.
5. Módulo 6: clique em "Ver artefatos"; navegue o carrossel e use "Copiar texto".
6. Redimensione para 375 px: o comparativo vira abas e o painel vira sobreposição.

## Testes automatizados
```bash
cd tests
npm install
npx playwright install chromium
npx playwright test
```

Resultados esperados: todos os testes passam, cobrindo navegação por teclado, persistência,
modos, comparativo em abas (375 px), artefatos, cópia, ausência de rolagem horizontal e
zero requisições de rede além do Google Fonts.
