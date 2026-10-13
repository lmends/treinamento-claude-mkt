<!--
Sync Impact Report
- Version change: (template) → 1.0.0
- Principles added: I. Estático e Sem Build; II. Zero Credenciais e Zero Rede; III. Conteúdo Separado
  da Lógica; IV. Identidade Própria e Dados Fictícios; V. Acessível e Responsivo por Padrão;
  VI. Simplicidade (YAGNI)
- Added sections: Restrições Adicionais; Fluxo de Desenvolvimento e Quality Gates; Governance
- Removed sections: none
- Templates: plan-template.md ✅ (Constitution Check genérico, compatível);
  spec-template.md ✅ (sem mudanças); tasks-template.md ✅ (sem mudanças)
- Deferred TODOs: none
-->

# Ambiente de Treinamento "Claude para Marketing" Constitution

## Core Principles

### I. Estático e Sem Build

O produto MUST ser HTML, CSS e JavaScript puros (vanilla), sem framework e sem etapa de build.
Abrir `index.html` com duplo clique (protocolo `file://`) MUST funcionar exatamente como
publicado no GitHub Pages. É PROIBIDO usar ES modules (`type="module"`), `fetch()` de arquivos
locais ou qualquer recurso que falhe em `file://`. Caminhos MUST ser relativos.

*Rationale*: o instrutor precisa abrir o material em qualquer notebook, e o deploy precisa ser
"subir os arquivos e pronto".

### II. Zero Credenciais e Zero Rede

O código MUST NOT conter chaves de API, tokens ou chamadas a serviços externos. A única
requisição de rede permitida é uma fonte opcional do Google Fonts, com fallback para fontes do
sistema. Nenhum analytics, login ou coleta de dados.

*Rationale*: o site é público; qualquer credencial vazaria.

### III. Conteúdo Separado da Lógica

Todo texto exibido ao usuário (módulos, mensagens, notas, artefatos, rótulos de interface
editáveis) MUST viver em `js/content.js`, num formato de dados simples e documentado.
`js/app.js` MUST NOT conter textos de conteúdo do treinamento. Adicionar uma mensagem ou um
módulo MUST exigir apenas edição de `content.js`.

*Rationale*: o instrutor edita o conteúdo sem entender a lógica.

### IV. Identidade Própria e Dados Fictícios

A interface MUST NOT usar logo, wordmark, nome estilizado ou paleta oficial da Anthropic/Claude.
O nome exibido é "Ambiente de Treinamento". Todos os exemplos MUST usar a marca fictícia
"Café Serra". Menções textuais ao Claude real são permitidas apenas como texto simples (ex.:
links para claude.ai).

*Rationale*: evitar confusão de marca e exposição de dados reais.

### V. Acessível e Responsivo por Padrão

Todo controle MUST ser operável por teclado com foco visível; contraste MUST atingir WCAG AA;
a área de chat MUST ter `aria-live`; ícones MUST ter texto alternativo. O layout MUST funcionar
de 375px a 1440px. `prefers-reduced-motion` MUST desativar digitação/streaming. Tema escuro MUST
seguir a preferência do sistema.

*Rationale*: o material é usado em apresentação e revisado depois em celular.

### VI. Simplicidade (YAGNI)

Implementar apenas o que o PRD pede. Sem dependências de terceiros em runtime. Preferir um
único motor de chat reutilizado por chat principal, comparativos e demais componentes.

*Rationale*: projeto pequeno, de vida longa como material de consulta, mantido por não-devs.

## Restrições Adicionais

- Idioma da interface e do conteúdo: português do Brasil.
- Estrutura de arquivos fixa: `index.html`, `css/styles.css`, `js/app.js`, `js/content.js`,
  `README.md`.
- Progresso do usuário persiste apenas em `localStorage`, com acesso protegido por try/catch.
- Ferramentas de teste (ex.: Playwright) podem existir apenas como dependência de
  desenvolvimento, fora dos arquivos servidos, e nunca são requeridas para usar o site.

## Fluxo de Desenvolvimento e Quality Gates

- Fluxo spec-kit: constitution → specify → plan → tasks → implement, com commits git a cada fase.
- Antes de concluir: validar em navegador real nas larguras 375px e 1440px, modo claro e escuro,
  via `file://`; verificar ausência de erros no console e de requisições de rede além da fonte.
- Os critérios de aceite da seção 11 do PRD são o gate final.

## Governance

Esta constituição prevalece sobre preferências de implementação. Emendas exigem atualização
deste arquivo, incremento de versão semântica (MAJOR: remoção/redefinição de princípio; MINOR:
princípio ou seção nova; PATCH: redação) e registro no Sync Impact Report. Todo plano MUST
passar pelo "Constitution Check" antes da implementação; violações MUST ser justificadas na
tabela de Complexity Tracking do plano.

**Version**: 1.0.0 | **Ratified**: 2026-10-13 | **Last Amended**: 2026-10-13
