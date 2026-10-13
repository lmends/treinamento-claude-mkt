/* ==========================================================================
   CONTEÚDO DO TREINAMENTO
   --------------------------------------------------------------------------
   Este é o ÚNICO arquivo que você precisa editar para mudar textos.
   Não é preciso entender programação: siga os modelos que já existem.

   Regras rápidas:
   - Textos ficam entre aspas "…". Dentro do texto, prefira as aspas curvas “assim”
     (se usar as retas, escreva \"assim\").
   - Para quebrar linha dentro de um texto, use \n  (duas quebras \n\n = novo parágrafo).
   - Formatação: **negrito**, *itálico*, linhas começando com "- " viram lista,
     linhas começando com "1. " viram lista numerada.
   - Separe itens de uma lista [ … ] com vírgula. Cuidado com a vírgula do último item.

   Estrutura:
   - interface:    textos dos botões e avisos da tela.
   - apresentacao: textos da capa do site e do primeiro slide.
   - marca:        dados da marca fictícia usada nos artefatos.
   - modulos:      lista de módulos. Cada módulo tem "blocos", exibidos em ordem.
                   Campos do módulo: id, titulo, resumoCurto, resumo,
                   imagem e imagemAlt (opcionais: ilustração da abertura).

   Os MESMOS blocos alimentam as duas páginas:
   - Estudo (estudo.html): cada bloco é uma seção da página do módulo.
   - Apresentação (apresentacao.html): cada módulo ganha um slide de abertura
     e cada bloco vira um slide.

   Tipos de bloco: texto, destaque, frase, imagem, cards, visao-geral, chat,
   comparativo, antes-depois, proxima-palavra, visao, projeto, skill, tabela,
   tour, pratica, links. Veja exemplos de cada um abaixo e no README.md.

   Campos opcionais de qualquer bloco (só afetam os slides):
     slide: { … }        campos que substituem os do bloco NOS SLIDES
                         (ex.: um texto mais curto, ou até outro "tipo")
     slide: false        o bloco aparece só no estudo
     soNosSlides: true   o bloco aparece só nos slides
     passoAPasso: true   itens (cards, linhas, instruções) entram um a um
     nota: "…"           lembrete para o instrutor (tecla N na apresentação)

   Bloco "visao": marcacoes: [{ x, y, rotulo, lado }] — x e y em % da imagem;
   lado (opcional) = "direita", "esquerda", "cima" ou "baixo". Nas etapas,
   grade/numeros/marcacoes/resposta ligam cada efeito; "resposta" (texto do
   bloco) é digitada sobre a foto na etapa marcada com resposta: true.

   Bloco "video": prévia simulada de Reels. cenas: [{ tempo: "0–2 s",
   visual: "img/arquivo.svg", foco: "50% 80%", efeito: "zoom-in" | "zoom-out" |
   "pan-esquerda" | "pan-direita", origem: "ia" | "loja", textoTela, audio }].

   Mensagens (dentro de chat/comparativo):
     { autor: "aluna" ou "assistente", texto: "…",
       nota: "nota do instrutor (opcional)",
       anexo: { nome: "arquivo.pdf", conteudo: "texto opcional" },      // só aluna
       anexo: { nome: "foto.jpg", imagem: "img/arquivo.svg", alt: "…" }, // imagem
       skill: "nome-da-skill",                                           // só assistente
       conector: "Gerador de imagens",                                   // só assistente
       artefatos: [ … ] }                                                // só assistente

   Artefatos: carrossel, post, email, prompt-imagem, roteiro, imagem.

   Imagens: ficam na pasta img/. Para usar uma foto real, coloque o arquivo
   lá (ex.: img/minha-foto.jpg) e troque o caminho. Escreva sempre o "alt"
   (descrição da imagem para quem usa leitor de tela).
   ========================================================================== */

window.CONTEUDO = {

  /* ------------------------------------------------------------------
     Textos da interface
     ------------------------------------------------------------------ */
  interface: {
    nomeSite: "Ambiente de Treinamento",
    subtitulo: "IA para Marketing · Café Serra",
    pularParaConteudo: "Pular para o conteúdo",
    voltarCapa: "Voltar à capa",
    temaClaro: "Ativar tema claro",
    temaEscuro: "Ativar tema escuro",
    concluido: "concluído",

    /* Capa (index.html) */
    capaApresentarTitulo: "Apresentar",
    capaApresentarTexto: "Slides em tela cheia para conduzir o treinamento, com conversas animadas e resultados aparecendo ao vivo.",
    capaEstudarTitulo: "Estudar",
    capaEstudarTexto: "Material de consulta para revisar no seu ritmo, com conversas completas, notas do instrutor e prompts para copiar.",
    comecar: "Começar",
    continuarSlide: "Continuar do slide {n}",
    continuarModulo: "Continuar em “{titulo}”",
    capaModulosTitulo: "Os módulos",
    capaProgresso: "{n} de {total} módulos concluídos",
    capaAbrirSlides: "Apresentar o módulo {n}",
    capaAtalhosTitulo: "Atalhos da apresentação",
    capaAtalhos: "[→] ou [Espaço] avança · [←] volta · [O] visão geral · [N] notas · [F] tela cheia · [B] tela preta · [1]–[9] e [0] pulam para o módulo",

    /* Apresentação (apresentacao.html) */
    deckRotulo: "Apresentação em slides",
    slideRotulo: "slide",
    anuncioSlide: "Slide {atual} de {total}: {titulo}",
    contadorSlides: "{atual} / {total}",
    moduloDeTotal: "Módulo {n} de {total}",
    capaDeck: "Capa",
    aberturaModulo: "Abertura",
    maisN: "+ {n} tópicos",
    slideAnteriorDeck: "Voltar",
    proximoSlideDeck: "Avançar",
    visaoGeral: "Visão geral dos slides",
    notas: "Notas do instrutor",
    semNotas: "Nenhuma nota para este slide.",
    telaCheia: "Tela cheia",
    sairTelaCheia: "Sair da tela cheia",
    telaPreta: "Tela em pausa. Pressione qualquer tecla para voltar.",
    fechar: "Fechar",
    resultado: "Resultado",
    resultadoVazio: "O resultado aparece aqui quando a resposta terminar.",
    dicaAvancar: "[→] ou [Espaço] para avançar",
    dicaComecar: "Pressione [→] para começar · [F] para tela cheia",
    dicaComecarToque: "Deslize para o lado ou toque em › para avançar",
    progressoDeck: "Progresso por módulo",
    irParaModulo: "Ir para o módulo {n}: {titulo}",
    estudarEsteModulo: "Estudar este módulo",

    /* Estudo (estudo.html) */
    tituloModulos: "Módulos",
    navegacaoModulos: "Navegação entre módulos",
    dicaTeclado: "Atalhos: [←] [→] trocam de módulo",
    moduloN: "Módulo {n}",
    moduloDe: "Módulo {atual} de {total}",
    anterior: "Anterior",
    proximo: "Próximo",
    abrirMenu: "Abrir lista de módulos",
    nestaPagina: "Nesta página",
    tempoLeitura: "~{n} min de leitura",
    apresentarModulo: "Apresentar este módulo",
    apresentarCurto: "Slides",
    verAnimacao: "Ver animação",
    mostrarTudo: "Mostrar tudo",
    concluirModulo: "Concluí este módulo",
    moduloConcluido: "Módulo concluído",
    desmarcarConcluido: "Clique para desmarcar",
    marcadoConcluido: "Módulo marcado como concluído.",
    proximoModulo: "Próximo módulo",
    moduloAnterior: "Módulo anterior",
    fimTreinamentoTitulo: "Você chegou ao fim do treinamento!",
    fimTreinamentoTexto: "Volte sempre que quiser revisar. Os prompts de prática estão no fim de cada módulo.",
    progressoLeitura: "Progresso de leitura",
    concluidosN: "concluídos: {n}",

    /* Conversas */
    conversa: "Conversa simulada",
    mensagens: "Mensagens",
    avancar: "Avançar",
    concluirMensagem: "Concluir mensagem",
    pularAnimacao: "Pular animação",
    reiniciar: "Reiniciar conversa",
    fimConversa: "Fim da conversa",
    campoPlaceholder: "Escreva sua mensagem…",
    voce: "Você",
    iniciaisVoce: "VC",
    assistente: "Assistente",
    pensando: "Pensando…",
    carregandoSkill: "Carregando skill…",
    skillEmUso: "Skill em uso:",
    conectorEmUso: "Conector em uso:",
    acionandoConector: "Acionando conector…",
    notaInstrutor: "Nota do instrutor",
    mostrarNota: "Mostrar ou ocultar nota do instrutor",
    anexoVerConteudo: "Ver conteúdo do arquivo",
    arquivoTipo: "Arquivo {tipo}",

    antes: "Antes",
    depois: "Depois",
    comparativo: "Comparativo antes e depois",

    /* Artefatos */
    artefato: "Artefato",
    verArtefato: "ver resultado",
    artefatosGerados: "Artefatos gerados",
    copiar: "Copiar",
    copiarTexto: "Copiar texto",
    copiado: "Texto copiado!",
    erroCopiar: "Não foi possível copiar automaticamente. Selecione o texto e use Ctrl+C.",
    tipo_carrossel: "Carrossel de Instagram",
    tipo_post: "Legenda de post",
    tipo_email: "E-mail / newsletter",
    "tipo_prompt-imagem": "Prompt de imagem",
    tipo_imagem: "Imagem gerada",
    tipo_roteiro: "Roteiro de vídeo",
    tipoCurto_carrossel: "Carrossel",
    tipoCurto_post: "Legendas",
    tipoCurto_email: "E-mail",
    "tipoCurto_prompt-imagem": "Prompt",
    tipoCurto_imagem: "Imagem",
    tipoCurto_roteiro: "Roteiro",
    carrossel: "carrossel",
    slideAnterior: "Slide anterior",
    slideProximo: "Próximo slide",
    irParaSlide: "Ir para o slide {n}",
    slideDe: "Slide {atual} de {total}",
    slideN: "Slide {n}",
    legenda: "Legenda sugerida",
    legendaN: "Legenda {n} de {total}",
    sugestaoImagem: "Sugestão de imagem",
    emailDe: "De",
    emailAssunto: "Assunto",
    emailPre: "Pré-cabeçalho",
    promptPortugues: "Prompt em português",
    promptIngles: "Prompt em inglês",
    promptEvitar: "Evitar:",
    promptUsado: "Prompt usado",
    resultadoGerador: "Resultado ilustrativo de um gerador de imagens",
    cenaN: "Cena {n}",
    cenaTempo: "Tempo",
    cenaImagem: "Imagem",
    cenaTexto: "Na tela",
    cenaAudio: "Áudio",
    cenaPrompt: "Prompt para o gerador de vídeo",

    /* Projeto, Skill, tabela, tour, demonstrações */
    projeto: "Projeto",
    instrucoesProjeto: "Instruções do projeto",
    arquivosConhecimento: "Arquivos de conhecimento",
    skill: "Skill",
    skillArquivo: "SKILL.md",
    skillNome: "Nome",
    skillDescricao: "Descrição",
    skillInstrucoes: "Instruções",
    aspecto: "Aspecto",

    interfaceSimulada: "Interface simulada do assistente",
    tourTitulo: "Tour guiado",
    tourIntroTitulo: "Vamos conhecer a tela?",
    tourIntroTexto: "Avance para destacar, um por vez, os quatro pontos principais da interface.",
    tourPasso: "Destaque {atual} de {total}",

    ppRodada: "Passo {n}",
    ppDeTotal: "de {total}",
    ppLacuna: "próxima palavra",
    visaoEtapa: "Etapa {atual} de {total}",
    visaoEnviando: "Enviando foto…",

    /* Vídeo simulado */
    videoPrevia: "Prévia simulada do vídeo",
    videoTocar: "Assistir",
    videoPausar: "Pausar",
    videoRecomecar: "Recomeçar",
    videoAviso: "Prévia simulada · sem áudio",
    videoCenas: "Cenas do vídeo",
    origem_ia: "Gerado com IA",
    origem_loja: "Gravado na loja",

    /* Busca (estudo) */
    buscaRotulo: "Buscar no material",
    buscaPlaceholder: "Buscar no material…",
    buscaAtalho: "/",
    buscaAbrir: "Abrir busca",
    buscaFechar: "Fechar busca",
    buscaResultados: "{n} resultados",
    buscaUmResultado: "1 resultado",
    buscaSemResultados: "Nada encontrado para “{q}”. Tente outra palavra.",
    buscaDica: "Digite pelo menos 2 letras. Use ↑ ↓ e Enter para escolher.",
    buscaInicioModulo: "Início do módulo",

    /* Prática */
    agoraTente: "Agora tente no Claude",
    copiarPrompt: "Copiar prompt",
    promptCopiado: "Prompt copiado! Agora cole no Claude.",
    abrirClaude: "Abrir o Claude",
    novaAba: "(abre em nova aba)",

    blocoDesconhecido: "Bloco desconhecido",
    erroConteudo: "Erro: js/content.js não foi carregado ou não tem módulos."
  },

  /* ------------------------------------------------------------------
     Capa do site e primeiro slide da apresentação
     ------------------------------------------------------------------ */
  apresentacao: {
    kicker: "Ambiente de Treinamento",
    titulo: "IA para Marketing",
    subtitulo: "Um treinamento mão na massa para criar textos, fotos e vídeos com a ajuda de um assistente de IA. Os exemplos usam a Café Serra, uma marca inventada.",
    rodape: "Simulação: nenhuma IA real é chamada neste material. Para praticar de verdade, use o Claude."
  },

  /* ------------------------------------------------------------------
     Marca fictícia
     ------------------------------------------------------------------ */
  marca: {
    nome: "Café Serra",
    usuario: "@cafeserra",
    iniciais: "CS"
  },

  /* ------------------------------------------------------------------
     Módulos
     ------------------------------------------------------------------ */
  modulos: [

    /* ============================ MÓDULO 1 ============================ */
    {
      id: "boas-vindas",
      titulo: "Boas-vindas",
      resumoCurto: "Objetivo e roteiro",
      resumo: "Pra começar: o que você vai levar daqui e como a gente vai trabalhar.",
      blocos: [
        {
          tipo: "destaque",
          icone: "☕",
          titulo: "O objetivo de hoje",
          slide: {
            tipo: "frase",
            texto: "A ideia é transformar a IA numa **colega de criação**.",
            apoio: "Alguém que rascunha em segundos, dá ideias, revisa com você e ajuda a planejar fotos e vídeos."
          },
          nota: "Combine as regras do jogo: tudo é simulado, a marca é inventada e cada módulo termina com prática no Claude de verdade. Pergunte quais ferramentas de imagem e vídeo ela usa hoje. (Módulo 1: ~5 min)",
          texto: "Ao fim do treinamento, você vai usar a IA como uma **colega de criação**: alguém que rascunha em segundos, sugere caminhos, revisa seu texto e ajuda a planejar fotos e vídeos.\n\nTudo aqui é uma **simulação** com uma marca inventada, a **Café Serra**. No fim de cada módulo tem um exercício pra você fazer no Claude de verdade."
        },
        {
          tipo: "imagem",
          titulo: "Conheça a Café Serra",
          texto: "Nossa marca de exemplo é uma cafeteria e torrefação artesanal do interior de Minas.\n\n- **Público:** gente de 25 a 45 anos que gosta de café especial e de produto local.\n- **Jeito de falar:** acolhedor, próximo, com um toque mineiro, sem exagero.\n- **Produtos:** Café de Inverno, Coado da Casa e Kit Presente.",
          src: "img/cafeteria.svg",
          alt: "Ilustração do interior da Café Serra: balcão de madeira com bolo e pão de queijo, quadro com o cardápio, prateleira com pacotes de café e janela com vista para a serra.",
          legenda: "A Café Serra é inventada. Use o mesmo raciocínio com a sua marca.",
          nota: "Peça para ela imaginar a marca dela no lugar da Café Serra ao longo de todos os exemplos."
        },
        {
          tipo: "cards",
          titulo: "Você vai sair sabendo…",
          nota: "Pergunte qual destes itens ela mais quer dominar e dê ênfase a ele ao longo do treinamento.",
          itens: [
            { icone: "🧠", titulo: "Como a IA funciona", texto: "O suficiente pra saber quando confiar e quando conferir." },
            { icone: "✍️", titulo: "Pedir bem", texto: "Briefings que geram bons textos logo de primeira." },
            { icone: "🔁", titulo: "Ajustar com precisão", texto: "O segundo pedido que transforma um rascunho em algo publicável." },
            { icone: "📸", titulo: "Trabalhar com imagens", texto: "Mandar fotos e prints pra IA analisar, legendar e comparar." },
            { icone: "🎬", titulo: "Criar fotos e vídeos", texto: "Gerar direto no Claude com conectores e Skills, ou planejar prompts e roteiros para seus geradores." },
            { icone: "🧩", titulo: "Automatizar o repetitivo", texto: "Projetos e Skills pra não explicar tudo de novo a cada conversa." }
          ]
        },
        {
          tipo: "visao-geral",
          titulo: "Roteiro do treinamento",
          nota: "São cerca de 90 minutos. Os módulos 5, 6 e 7 são os mais práticos; se o tempo apertar, encurte o 3 e o 8."
        },
        {
          tipo: "destaque",
          icone: "🧭",
          cor: "verde",
          titulo: "Como usar este material",
          slide: false,
          texto: "- Nesta página de **estudo**, as conversas aparecem completas, com as notas do instrutor visíveis. Clique em **Ver animação** para assistir a qualquer conversa acontecendo.\n- Os resultados (carrosséis, legendas, prompts, roteiros) aparecem logo abaixo das respostas, com botão para copiar.\n- Use as **setas ← →** do teclado para trocar de módulo e marque **Concluí este módulo** ao terminar. O material lembra onde você parou."
        }
      ]
    },

    /* ============================ MÓDULO 2 ============================ */
    {
      id: "o-que-e-ia",
      titulo: "O que é uma IA, afinal?",
      resumoCurto: "Como ela funciona por dentro",
      resumo: "Sem jargão: como um assistente de IA escreve, por que às vezes erra e o que isso muda no seu jeito de usar.",
      imagem: "img/ia.svg",
      imagemAlt: "Ilustração: páginas de texto viram palavras que entram numa rede de pontos conectados, que escolhe a próxima palavra.",
      blocos: [
        {
          tipo: "texto",
          titulo: "Um especialista em continuar frases",
          slide: {
            tipo: "frase",
            icone: "🧠",
            texto: "No fundo, uma IA como o Claude é **especialista em prever a próxima palavra**.",
            apoio: "Ela aprendeu com uma quantidade enorme de textos e, a partir do que você escreve, monta a resposta palavra por palavra."
          },
          nota: "Fale devagar aqui: essa ideia sustenta o treinamento inteiro. (Módulo 2: ~10 min)",
          texto: "O Claude é um **modelo de linguagem**: um programa treinado com uma quantidade gigantesca de textos (livros, sites, artigos) pra aprender como as palavras costumam se combinar.\n\nQuando você manda uma mensagem, ele não procura a resposta pronta em lugar nenhum. Ele **gera** a resposta, uma palavra de cada vez, escolhendo a continuação que faz mais sentido para aquele contexto."
        },
        {
          tipo: "proxima-palavra",
          titulo: "Vamos ver isso acontecendo",
          texto: "A cada passo, o modelo calcula quais palavras combinam com o que veio antes e escolhe uma delas.",
          nota: "Os números são ilustrativos: mostram o mecanismo, não a conta real. Antes de cada escolha, pergunte qual palavra ela acha que vem.",
          rodadas: [
            {
              frase: "Nada como um café passado na",
              opcoes: [
                { palavra: "hora", chance: 61 },
                { palavra: "manhã", chance: 14 },
                { palavra: "cozinha", chance: 9 },
                { palavra: "garrafa", chance: 6 },
                { palavra: "coador", chance: 4 }
              ],
              escolhida: 0
            },
            {
              frase: "Nada como um café passado na hora com",
              opcoes: [
                { palavra: "pão", chance: 48 },
                { palavra: "bolo", chance: 22 },
                { palavra: "leite", chance: 12 },
                { palavra: "açúcar", chance: 7 },
                { palavra: "carinho", chance: 5 }
              ],
              escolhida: 0
            },
            {
              frase: "Nada como um café passado na hora com pão de",
              opcoes: [
                { palavra: "queijo", chance: 83 },
                { palavra: "forma", chance: 8 },
                { palavra: "mel", chance: 3 },
                { palavra: "milho", chance: 2 }
              ],
              escolhida: 0
            }
          ],
          conclusao: "Ninguém programou a frase “café com pão de queijo”. O modelo **aprendeu** que essas palavras andam juntas. É por isso que o contexto que você dá muda tanto a resposta: cada palavra do seu pedido mexe nessas chances."
        },
        {
          tipo: "cards",
          titulo: "O que isso explica no dia a dia",
          passoAPasso: true,
          itens: [
            { icone: "🎲", titulo: "Cada resposta sai diferente", texto: "Ela nem sempre escolhe a palavra mais provável. Por isso o mesmo pedido gera versões diferentes, o que é ótimo pra ter opções." },
            { icone: "🧭", titulo: "Contexto muda tudo", texto: "Quanto mais você conta, mais certeiras ficam as escolhas. Pedido vago, resposta genérica." },
            { icone: "🤥", titulo: "Ela pode inventar", texto: "Se não sabe, pode gerar algo que *parece* certo. Dados, nomes, datas e números sempre precisam de conferência." },
            { icone: "🗓️", titulo: "O conhecimento tem data", texto: "Ela aprendeu até certo ponto no tempo. Pra novidades, peça para pesquisar na web ou mande o material." }
          ]
        },
        {
          tipo: "tabela",
          titulo: "Buscador × assistente de IA",
          passoAPasso: true,
          nota: "Muita gente usa a IA como Google. Mostre a diferença com um exemplo dela.",
          colunas: ["", "Buscador", "Assistente de IA"],
          linhas: [
            ["O que faz", "**Encontra** páginas que já existem", "**Escreve** uma resposta nova pra você"],
            ["Melhor para", "Achar uma fonte, um endereço, uma notícia", "Rascunhar, resumir, adaptar, revisar, ter ideias"],
            ["Como pedir", "Palavras-chave: “café inverno receita”", "Uma conversa: contexto, objetivo e formato"],
            ["Cuidado", "A página pode não ser confiável", "A resposta pode ter erros: confira os fatos"]
          ]
        },
        {
          tipo: "cards",
          titulo: "O que o Claude lê e o que ele cria",
          nota: "Explique o último card com calma: sozinho, o modelo responde em texto; com conectores e Skills ele passa a gerar imagens e vídeos. Isso prepara o módulo 7.",
          itens: [
            { icone: "📄", titulo: "Lê textos e arquivos", texto: "PDFs, documentos, planilhas e apresentações que você anexa." },
            { icone: "🖼️", titulo: "Lê imagens", texto: "Fotos, prints, gráficos e artes prontas. Vamos ver isso no módulo 6." },
            { icone: "✍️", titulo: "Cria texto (e mais)", texto: "Legendas, roteiros, e-mails, tabelas e até páginas e gráficos simples." },
            { icone: "🔌", titulo: "Fotos e vídeos, com ajuda", texto: "Sozinho, o modelo responde em texto. Com **conectores** e **Skills**, ele gera imagens e vídeos dentro da conversa." }
          ]
        },
        {
          tipo: "frase",
          icone: "🤝",
          texto: "Pense numa estagiária brilhante que leu quase tudo… mas **nunca trabalhou na sua empresa**.",
          apoio: "Ela é rápida e criativa, mas só sabe da sua marca o que você contar. É isso que vamos treinar daqui pra frente."
        },
        {
          tipo: "pratica",
          titulo: "Agora tente no Claude: o teste da variação",
          texto: "Um jeito rápido de sentir como a IA funciona por dentro.",
          passos: [
            "Abra o Claude e mande o pedido abaixo.",
            "Peça de novo: use o botão de tentar novamente ou mande o mesmo pedido numa conversa nova.",
            "Compare as duas respostas. O que mudou? O que se repetiu?"
          ],
          prompt: "Me dá 3 ideias de post para uma cafeteria no inverno."
        }
      ]
    },

    /* ============================ MÓDULO 3 ============================ */
    {
      id: "conhecendo-o-ambiente",
      titulo: "Conhecendo o ambiente",
      resumoCurto: "Tour pela interface",
      resumo: "Um passeio rápido pela tela: onde escrever, anexar, achar conversas antigas e organizar projetos.",
      blocos: [
        {
          tipo: "tour",
          titulo: "Tour pela interface",
          texto: "A tela abaixo é uma simulação simplificada. Os nomes e a posição dos botões podem mudar um pouco no aplicativo real, mas a lógica é a mesma.",
          nota: "Se der, abra o Claude de verdade logo depois do tour e mostre os mesmos quatro pontos. (Módulo 3: ~5 min)",
          interfaceSimulada: {
            nomeApp: "Assistente de IA",
            novaConversa: "Nova conversa",
            projetosRotulo: "Projetos",
            projetos: ["📁 Café Serra – Conteúdo", "📁 Campanha de Inverno"],
            historicoRotulo: "Recentes",
            historico: ["💬 Ideias para o Dia do Café", "💬 Legenda do Kit Presente", "💬 Revisão da newsletter"],
            saudacao: "Bom dia! Como posso ajudar hoje?",
            placeholder: "Como posso ajudar você hoje?",
            anexarRotulo: "Anexar"
          },
          passos: [
            {
              alvo: "campo-mensagem",
              titulo: "Campo de mensagem",
              texto: "É aqui que você escreve, como se mandasse mensagem pra uma colega. Pode (e deve!) ser um texto longo, com detalhes. **Enter** envia; **Shift + Enter** pula linha."
            },
            {
              alvo: "anexar",
              titulo: "Anexar arquivos e imagens",
              texto: "O clipe serve pra mandar PDFs, documentos, planilhas, **fotos e prints**. Por exemplo: o briefing da campanha, o guia da marca ou a foto do produto pra criar a legenda."
            },
            {
              alvo: "historico",
              titulo: "Histórico de conversas",
              texto: "Toda conversa fica salva aqui. Dá pra voltar, continuar de onde parou ou renomear. Dica de ouro: **uma conversa por assunto**."
            },
            {
              alvo: "projetos",
              titulo: "Projetos",
              texto: "Espaços que guardam **instruções e arquivos** de um trabalho, como a marca Café Serra. Toda conversa criada ali dentro já começa sabendo o contexto. Vamos ver isso no módulo 8."
            }
          ]
        },
        {
          tipo: "cards",
          titulo: "No marketing, ele ajuda a…",
          itens: [
            { icone: "💡", titulo: "Ter ideias", texto: "Pautas, ganchos, temas para datas comemorativas." },
            { icone: "📝", titulo: "Escrever rascunhos", texto: "Legendas, roteiros, e-mails e textos de blog." },
            { icone: "🔍", titulo: "Revisar", texto: "Ortografia, clareza, tom de voz e tamanho." },
            { icone: "📊", titulo: "Analisar", texto: "Relatórios, planilhas, prints de métricas e fotos." }
          ]
        },
        {
          tipo: "pratica",
          titulo: "Agora tente no Claude: primeiro contato",
          passos: [
            "Abra o Claude e encontre os quatro pontos do tour: campo de mensagem, clipe, histórico e Projetos.",
            "Mande a mensagem abaixo.",
            "Renomeie a conversa no histórico para “Testes do treinamento”."
          ],
          prompt: "Oi! Trabalho com marketing de uma cafeteria e faço muito post, foto e vídeo. Em 3 frases, me conta como você pode me ajudar no dia a dia?"
        }
      ]
    },

    /* ============================ MÓDULO 4 ============================ */
    {
      id: "pedir-bem",
      titulo: "Pedir bem",
      resumoCurto: "Prompt fraco × prompt bom",
      resumo: "A diferença entre um texto genérico e um texto pronto pra publicar começa no pedido.",
      blocos: [
        {
          tipo: "comparativo",
          titulo: "O mesmo pedido, de dois jeitos",
          texto: "Avance as duas conversas e compare as respostas.",
          nota: "Antes de avançar o “Depois”, pergunte: o que você mudaria nesse pedido pra ter um resultado melhor? (Módulo 4: ~10 min)",
          antes: {
            rotulo: "Antes",
            titulo: "Pedido vago",
            mensagens: [
              {
                autor: "aluna",
                texto: "faz um post sobre nosso café novo",
                nota: "Falta quase tudo: qual café? Pra qual rede? Pra quem? Com que objetivo? A IA vai preencher as lacunas com o que é mais comum, ou seja, genérico."
              },
              {
                autor: "assistente",
                texto: "Aqui vai uma sugestão de post:\n\n**☕ Novidade fresquinha!**\n\nChegou o nosso novo café, perfeito para todos os momentos do seu dia! Com sabor único e aroma irresistível, ele vai transformar a sua rotina. Venha experimentar e descubra por que nossos clientes amam o nosso café!\n\n#café #novidade #coffee #cafeteria #amocafé #coffeelover #instacoffee #cafédamanhã",
                nota: "Serviria pra qualquer cafeteria do mundo: não fala do produto, não tem a voz da marca, o convite é vago e sobra hashtag."
              }
            ]
          },
          depois: {
            rotulo: "Depois",
            titulo: "Pedido com contexto",
            mensagens: [
              {
                autor: "aluna",
                texto: "Oi! Sou do marketing da Café Serra, uma cafeteria e torrefação artesanal aqui de Minas.\n\nPreciso de uma **legenda pro Instagram** anunciando a volta do **Café de Inverno** (blend com notas de chocolate e canela, só por tempo limitado).\n\n- **Pra quem:** pessoas de 25 a 45 anos que curtem café especial e produto local\n- **Objetivo:** trazer o pessoal pra loja no sábado do lançamento\n- **Tom:** acolhedor, próximo, com um toque mineiro, sem exagero. Frases curtas, nada de termo técnico de barista\n- **Tamanho:** até 80 palavras\n- **Fechamento:** convite pra provar na loja no sábado\n- **Hashtags:** no máximo 3\n\nUm post nosso que eu adoro, pra você pegar o jeito: “Café passado na hora, pão de queijo saindo do forno. Aqui o tempo anda mais devagar.”",
                nota: "**Contexto** (quem somos), **tarefa** (legenda de Instagram), **público**, **objetivo**, **tom**, **tamanho**, **fechamento** e um **exemplo**. Cada item tira uma suposição da IA."
              },
              {
                autor: "assistente",
                texto: "Pegando o jeito daquele post de vocês, ficou assim:\n\n**O frio chegou. E trouxe companhia.** ❄️☕\n\nO Café de Inverno voltou: notas de chocolate, um toque de canela e aquele aconchego de cozinha mineira.\n\nÉ por pouco tempo, então não deixa pra depois. Sábado tem xícara te esperando aqui na loja.\n\n#CaféSerra #CaféDeInverno #CaféEspecial\n\nSe quiser, faço uma versão mais curtinha pros Stories.",
                nota: "Mesmo assunto, outro nível: fala do produto, conversa com o público certo, respeita o tom e termina com um convite concreto."
              }
            ]
          }
        },
        {
          tipo: "cards",
          titulo: "Os 4 princípios de um bom pedido",
          passoAPasso: true,
          itens: [
            { icone: "🧭", titulo: "1. Dê contexto", texto: "Quem é a marca, pra quem é o conteúdo e qual o objetivo. A IA não sabe nada que você não contar." },
            { icone: "🎯", titulo: "2. Seja específica", texto: "Formato, tamanho, tom, convite final, número de hashtags. O que não for dito, a IA adivinha." },
            { icone: "🖼️", titulo: "3. Mostre exemplos", texto: "Um post de que vocês gostam vale mais do que três adjetivos sobre o tom." },
            { icone: "🔁", titulo: "4. Ajuste depois", texto: "A primeira resposta é rascunho. O próximo módulo é inteiro sobre isso." }
          ]
        },
        {
          tipo: "destaque",
          icone: "🧪",
          cor: "verde",
          titulo: "Fórmula de bolso",
          nota: "Peça pra ela achar cada parte da fórmula no pedido do “Depois”.",
          texto: "**Contexto** + **Tarefa** + **Público** + **Objetivo** + **Tom** + **Formato** + **Exemplo**\n\nNão precisa usar tudo sempre. Mas, se a resposta veio genérica, quase sempre faltou alguma dessas partes."
        },
        {
          tipo: "pratica",
          titulo: "Agora tente no Claude: seu primeiro briefing",
          texto: "Copie o modelo, troque o que está entre colchetes e mande. Guarde a resposta: você vai usá-la no próximo módulo.",
          passos: [
            "Escolha um post de verdade que você precisa fazer esta semana.",
            "Preencha o modelo abaixo com os dados da sua marca.",
            "Mande e leia a resposta com olhar de editora: o que você manteria?"
          ],
          prompt: "Sou do marketing da [sua marca]. Crie uma legenda para o Instagram sobre [produto ou novidade].\n- Pra quem: [público]\n- Objetivo: [o que a pessoa deve fazer depois de ler]\n- Tom: [ex.: acolhedor, divertido, sofisticado]\n- Tamanho: até [N] palavras\n- Fechamento: [convite final]\n- Hashtags: no máximo 3\nUm post nosso que eu gosto, pra você pegar o jeito: “[cole aqui]”"
        }
      ]
    },

    /* ============================ MÓDULO 5 ============================ */
    {
      id: "ajustar",
      titulo: "Ajustar sem recomeçar",
      resumoCurto: "A arte do segundo pedido",
      resumo: "O primeiro resultado quase nunca é o final. O que separa um texto genérico de um texto bom é o jeito de pedir o ajuste.",
      blocos: [
        {
          tipo: "texto",
          titulo: "O texto bom nasce no segundo pedido",
          slide: {
            tipo: "frase",
            icone: "🔁",
            texto: "O primeiro resultado é **rascunho**. O texto bom nasce no segundo pedido.",
            apoio: "E o segundo pedido precisa ser tão bem feito quanto o primeiro."
          },
          nota: "Pergunte se ela já se frustrou com “melhora isso” e recebeu algo pior. Quase todo mundo já. (Módulo 5: ~15 min)",
          texto: "Na prática, quase ninguém acerta de primeira: nem a IA, nem a gente. O primeiro resultado serve pra você **reagir**: ver o que funcionou, o que ficou estranho e o que faltou.\n\nO problema é que a maioria das pessoas ajusta com pedidos vagos, como “melhora” ou “não gostei”. Aí a IA chuta o que mudar e o texto fica diferente, mas não necessariamente melhor."
        },
        {
          tipo: "comparativo",
          titulo: "O mesmo ajuste, de dois jeitos",
          texto: "As duas conversas partem da mesma legenda do Café de Inverno. Só muda o segundo pedido.",
          nota: "Leia em voz alta as duas respostas. A diferença de qualidade costuma convencer mais que qualquer explicação.",
          antes: {
            rotulo: "Antes",
            titulo: "Ajuste vago",
            mensagens: [
              {
                autor: "aluna",
                texto: "hmm não curti muito. melhora aí",
                nota: "“Melhora” o quê? Sem saber o que incomodou, a IA muda coisas no escuro."
              },
              {
                autor: "assistente",
                texto: "Aqui vai uma versão mais caprichada:\n\n**✨ O inverno ficou ainda mais especial! ✨**\n\nApresentamos o nosso incrível Café de Inverno, uma experiência sensorial única, com notas marcantes de chocolate e um toque irresistível de canela! ☕🍫❄️\n\nVenha viver momentos inesquecíveis com a gente! Corre que é por tempo limitado! 🏃‍♀️💨\n\n#CaféSerra #CaféDeInverno #CaféEspecial #Inverno #Novidade",
                nota: "Mudou bastante e ficou pior: mais longo, cheio de adjetivo e emoji, com cara de propaganda. A IA “melhorou” sem saber o que você queria."
              }
            ]
          },
          depois: {
            rotulo: "Depois",
            titulo: "Ajuste específico",
            mensagens: [
              {
                autor: "aluna",
                texto: "Gostei do começo, “O frio chegou. E trouxe companhia.” Pode manter.\n\nO meio ficou genérico: “aconchego de cozinha mineira” qualquer um fala. Troca por uma cena real da nossa loja, tipo a janela embaçada ou o pão de queijo saindo do forno.\n\nE o convite tá fraco. Quero algo concreto: sábado, a partir das 9h, a primeira xícara do Café de Inverno é por nossa conta.\n\nMantém até 60 palavras e as 3 hashtags.",
                nota: "Diz **o que manter**, **o que mudar**, **por quê** e **como**, com exemplos concretos e o limite de tamanho."
              },
              {
                autor: "assistente",
                texto: "Ficou assim:\n\n**O frio chegou. E trouxe companhia.** ❄️☕\n\nJanela embaçada, pão de queijo saindo do forno e o Café de Inverno de volta no coador: chocolate, canela e aquele cheirinho que atravessa a rua.\n\nSábado, a partir das 9h, a primeira xícara é por nossa conta.\n\n#CaféSerra #CaféDeInverno #CaféEspecial",
                nota: "Manteve o que ela gostou, trocou só o que ela apontou e o convite ficou irresistível. Isso é ajustar bem."
              }
            ]
          }
        },
        {
          tipo: "cards",
          titulo: "Anatomia de um bom segundo pedido",
          passoAPasso: true,
          nota: "Não precisa usar os seis sempre. Os três primeiros já resolvem a maioria dos casos.",
          itens: [
            { icone: "✅", titulo: "1. O que funcionou", texto: "Diga o que manter. Senão a IA pode jogar fora justamente a parte boa." },
            { icone: "🎯", titulo: "2. O que mudar", texto: "Aponte o trecho exato: “o segundo parágrafo”, “o título”, “o convite final”." },
            { icone: "💬", titulo: "3. Por quê", texto: "“Ficou com cara de propaganda”, “tá formal demais”. O motivo ajuda a IA a acertar o resto também." },
            { icone: "🧩", titulo: "4. Um exemplo", texto: "Uma frase, uma referência, uma cena real. Exemplo vale mais que adjetivo." },
            { icone: "📏", titulo: "5. O limite", texto: "Tamanho, formato, número de hashtags. O que não for dito pode mudar." },
            { icone: "🎲", titulo: "6. Peça opções", texto: "“Me dá 3 versões” e escolha. É mais fácil reconhecer o bom do que descrever." }
          ]
        },
        {
          tipo: "tabela",
          titulo: "Troque isto… por isto",
          passoAPasso: true,
          nota: "Peça pra ela dizer qual desses pedidos vagos ela mais usa hoje.",
          colunas: ["Em vez de…", "Experimente…"],
          linhas: [
            ["“Melhora.”", "“O gancho tá fraco. Me dá 3 opções de primeira frase que criem curiosidade, com até 8 palavras.”"],
            ["“Deixa mais criativo.”", "“Usa uma imagem do inverno em Minas, tipo neblina na serra ou fogão a lenha, no lugar de ‘aconchego’.”"],
            ["“Tá muito formal.”", "“Escreve como a gente fala no balcão: ‘você’, frases curtas, pode usar ‘uai’ uma vez.”"],
            ["“Não gostei.”", "“Ficou com cara de anúncio. Quero que pareça uma amiga contando uma novidade.”"],
            ["“Faz outro.”", "“Mantém a estrutura, mas muda o foco do produto pra experiência de tomar o café aqui na loja.”"]
          ]
        },
        {
          tipo: "chat",
          tituloBloco: "Na prática: ajuste em rodadas",
          titulo: "Continuação da conversa",
          contexto: "Mesma conversa: a IA lembra de tudo o que já foi dito.",
          nota: "Destaque o truque da primeira mensagem: pedir a crítica antes de pedir a reescrita.",
          mensagens: [
            {
              autor: "aluna",
              texto: "Antes de mexer de novo: me diz, com sinceridade, o que ainda tá fraco nessa legenda?",
              nota: "Truque poderoso: peça para a IA **criticar antes de reescrever**. Ela costuma enxergar os pontos fracos, e você decide o que aceitar."
            },
            {
              autor: "assistente",
              texto: "Três coisas que eu mudaria:\n\n1. **“Aquele cheirinho que atravessa a rua”** é bonito, mas deixa a frase longa. Dá pra cortar sem perder o clima.\n2. **Falta urgência.** O Café de Inverno é por tempo limitado e a legenda não diz isso.\n3. **O convite não diz onde.** Quem ainda não conhece a loja fica sem saber aonde ir.\n\nQuer que eu aplique as três ou prefere escolher?"
            },
            {
              autor: "aluna",
              texto: "Aplica a 2 e a 3. A 1 eu gosto, deixa. O endereço é Rua da Serra, 120 e o café fica até 31 de julho. Faz também uma versão curtinha pros Stories.",
              nota: "Ela aceitou parte da crítica e recusou outra: **você continua sendo a editora**. E repare que ela deu o endereço e a data. Sem isso, a IA poderia inventar."
            },
            {
              autor: "assistente",
              texto: "Feito, com as duas versões:\n\n**Feed**\n**O frio chegou. E trouxe companhia.** ❄️☕\nJanela embaçada, pão de queijo saindo do forno e o Café de Inverno de volta no coador: chocolate, canela e aquele cheirinho que atravessa a rua.\nÉ só até 31 de julho. Sábado, a partir das 9h, a primeira xícara é por nossa conta, na Rua da Serra, 120.\n#CaféSerra #CaféDeInverno #CaféEspecial\n\n**Stories**\nO Café de Inverno voltou ❄️☕\nSábado, 9h: a primeira xícara é por nossa conta.\n📍 Rua da Serra, 120"
            }
          ]
        },
        {
          tipo: "destaque",
          icone: "🔄",
          cor: "verde",
          titulo: "E quando vale recomeçar?",
          texto: "- A conversa ficou longa e a IA começou a misturar versões antigas.\n- Você mudou de ideia sobre o objetivo.\n- Depois de três ou quatro ajustes, ainda não chegou lá.\n\nNesses casos, abra uma conversa nova e cole **o melhor resultado até agora + o que você aprendeu** (“o que funcionou foi X, evite Y”). É um recomeço com vantagem."
        },
        {
          tipo: "pratica",
          titulo: "Agora tente no Claude: o segundo pedido",
          texto: "Pegue a legenda do módulo anterior (ou uma que você já publicou) e treine o ajuste fino.",
          passos: [
            "Cole a legenda no Claude e peça uma crítica sincera (prompt 1).",
            "Decida **o que manter** e **o que mudar** e escreva o ajuste com o modelo (prompt 2).",
            "Peça 3 versões do trecho que ainda não ficou bom e escolha uma.",
            "Compare com a primeira versão: o que melhorou?"
          ],
          prompts: [
            { rotulo: "Prompt 1 · crítica", texto: "Antes de reescrever qualquer coisa, me diz com sinceridade: o que está fraco nesta legenda? Aponte trechos específicos e explique o porquê.\n\n[cole aqui a legenda]" },
            { rotulo: "Prompt 2 · ajuste", texto: "Gostei de [o que manter]. Pode manter.\n[Trecho] ficou [o problema]. Troca por [o que você quer, com um exemplo concreto].\nMantém [limite: tamanho, tom, hashtags]." }
          ]
        }
      ]
    },

    /* ============================ MÓDULO 6 ============================ */
    {
      id: "imagens",
      titulo: "Como o Claude “vê” imagens",
      resumoCurto: "Fotos, prints e gráficos",
      resumo: "Você pode mandar fotos, prints e artes pro Claude. Entender como ele lê uma imagem ajuda a pedir melhor e a saber onde conferir.",
      imagem: "img/cafe-inverno.svg",
      imagemAlt: "Foto do Café de Inverno: pacote kraft com rótulo, xícara de café fumegante, pão de queijo, canela e grãos numa mesa de madeira.",
      blocos: [
        {
          tipo: "visao",
          titulo: "O que acontece quando você manda uma foto",
          src: "img/cafe-inverno.svg",
          alt: "Foto do Café de Inverno: pacote kraft com o rótulo “Café de Inverno”, xícara de café fumegante, pão de queijo, canela em pau e grãos de café sobre uma mesa de madeira, com luz de janela vindo da esquerda.",
          nota: "É uma explicação simplificada, mas fiel: a imagem é quebrada em pedaços que viram números, assim como as palavras. Ele não “olha” como a gente. Avance devagar: cada toque mostra uma parte do processo. (Módulo 6: ~15 min)",
          arquivo: "cafe-inverno.jpg",
          resposta: "Vejo um pacote kraft com o rótulo “Café de Inverno”, uma xícara de café quente com vapor, pão de queijo e canela em pau sobre uma mesa de madeira, com luz natural vindo da janela à esquerda.",
          etapas: [
            { titulo: "A foto chega inteira", texto: "Você anexa a imagem e escreve o pedido. Pro Claude, imagem e texto viram uma coisa só: o contexto da conversa." },
            { titulo: "Ela vira pedacinhos", texto: "A imagem é dividida em pequenos quadrados, como um mosaico.", grade: true },
            { titulo: "Cada pedaço vira números", texto: "Cor, brilho, formas: tudo em cada quadrado é traduzido em números que o modelo sabe interpretar, do mesmo jeito que faz com as palavras.", grade: true, numeros: true },
            { titulo: "Ele junta as peças", texto: "Olhando os pedaços em conjunto, ele reconhece objetos, lê textos e percebe cores, luz e composição. Avance pra ver o que ele identifica.", grade: true, marcacoes: true },
            { titulo: "E responde a partir disso", texto: "Tudo isso entra no raciocínio junto com o seu pedido. Por isso vale dizer **o que você quer que ele observe**: o rótulo, a luz, o enquadramento.", semGrade: true, resposta: true }
          ],
          marcacoes: [
            { x: 20, y: 18, lado: "direita", rotulo: "Luz natural vindo da esquerda" },
            { x: 33, y: 55, lado: "esquerda", rotulo: "Lê o rótulo: “Café de Inverno”" },
            { x: 70, y: 66, lado: "cima", rotulo: "Xícara de café quente (tem vapor)" },
            { x: 90, y: 73, lado: "baixo", rotulo: "Pão de queijo num pratinho" },
            { x: 24, y: 87, lado: "direita", rotulo: "Canela em pau, cortada na borda" }
          ]
        },
        {
          tipo: "chat",
          tituloBloco: "Na prática: mande a foto e diga o que quer",
          titulo: "Nova conversa",
          nota: "Destaque que ela pediu três coisas específicas. “O que acha dessa foto?” renderia uma descrição genérica.",
          mensagens: [
            {
              autor: "aluna",
              anexo: { nome: "cafe-inverno.jpg", imagem: "img/cafe-inverno.svg", alt: "Foto do Café de Inverno com xícara, pão de queijo e canela sobre mesa de madeira." },
              texto: "Essa é a foto que a gente fez pro lançamento do Café de Inverno. Me ajuda com três coisas:\n1. o que funciona nela e o que dá pra melhorar\n2. uma legenda curta pro feed\n3. um texto alternativo pra acessibilidade",
              nota: "Foto + o que ela quer saber. Sem os três itens, a IA provavelmente só descreveria a imagem."
            },
            {
              autor: "assistente",
              texto: "**1. O que funciona e o que dá pra melhorar**\n- A luz natural vinda da janela deixa tudo quente e convidativo, combina com inverno.\n- O rótulo aparece bem e o nome “Café de Inverno” está legível.\n- O vapor da xícara passa a sensação de café passado na hora.\n- Ponto de atenção: a canela está bem na frente e cortada na borda. Um pouco mais pra dentro do quadro ficaria mais intencional.\n- O pão de queijo ficou pequeno no canto. Se ele faz parte da mensagem, vale aproximar.\n\n**2. Legenda**\nO Café de Inverno chegou com tudo que o frio pede: chocolate, canela e pão de queijo quentinho do lado. ☕❄️\n\n**3. Texto alternativo**\nPacote kraft do Café de Inverno, da Café Serra, sobre uma mesa de madeira, ao lado de uma xícara de café fumegante, pão de queijo, canela em pau e grãos de café, com luz suave de janela.",
              nota: "Ele descreve o que **está na foto** e opina sobre composição. Mesmo assim, confira detalhes pequenos: textos minúsculos e contagens são pontos fracos."
            }
          ]
        },
        {
          tipo: "chat",
          tituloBloco: "Prints e gráficos também",
          titulo: "Nova conversa",
          nota: "Esse uso costuma ser o que mais economiza tempo: ler painel de métricas e transformar em plano.",
          mensagens: [
            {
              autor: "aluna",
              anexo: { nome: "print-painel-setembro.png", imagem: "img/metricas.svg", alt: "Print do painel do Instagram de setembro: seguidores, salvamentos, engajamento médio e gráfico de alcance por publicação." },
              texto: "print das métricas de setembro. o que você tira daí? e o que eu faço em outubro?"
            },
            {
              autor: "assistente",
              texto: "Lendo o painel:\n\n- **Os carrosséis dominaram:** 8,9 mil e 7,6 mil de alcance, mais que o dobro de qualquer outro formato.\n- **As fotos únicas foram as mais fracas:** 1,2 mil e 0,9 mil.\n- **Os Reels ficaram no meio:** 3,4 mil e 2,8 mil.\n- Os **salvamentos subiram 48%**, o que costuma acompanhar conteúdo útil, como os carrosséis.\n- O **engajamento médio caiu 0,4 ponto**, provavelmente puxado pelas fotos com pouco alcance.\n\n**Pra outubro, eu sugeriria:**\n1. Dois carrosséis por semana, com conteúdo que dá vontade de salvar (receitas, dicas de preparo).\n2. Trocar as fotos únicas por carrosséis curtos de 3 slides.\n3. Testar Reels com um gancho mais forte nos 3 primeiros segundos.\n\nSó um cuidado: um mês é pouco pra cravar conclusão. Vale comparar com agosto antes de mudar tudo.",
              nota: "Ele leu números, rótulos e o gráfico. Ainda assim: **confira os números no painel original** antes de levar pra uma reunião."
            }
          ]
        },
        {
          tipo: "tabela",
          titulo: "Onde ele vai bem e onde ter cuidado",
          passoAPasso: true,
          colunas: ["", "Vai bem", "Tenha cuidado"],
          linhas: [
            ["Textos", "Lê títulos, rótulos, prints e slides", "Letras muito pequenas, borradas ou à mão"],
            ["Cenas e objetos", "Descreve o que aparece e o clima da imagem", "Contagens exatas (“quantos grãos tem?”)"],
            ["Gráficos", "Compara barras, acha tendências e destaques", "Valores sem rótulo: ele estima"],
            ["Pessoas", "Descreve roupas, expressões e cenário", "Não identifica quem é a pessoa pelo rosto"],
            ["Detalhes", "Comenta luz, cor, composição e enquadramento", "Às vezes “vê” algo que não está lá: confira"]
          ]
        },
        {
          tipo: "cards",
          titulo: "Dicas pra mandar imagens",
          itens: [
            { icone: "🔍", titulo: "Boa resolução", texto: "Imagem nítida, sem cortar o que importa. Print da tela em vez de foto da tela." },
            { icone: "✂️", titulo: "Recorte o essencial", texto: "Se o foco é o rótulo, mande o rótulo. Menos ruído, resposta melhor." },
            { icone: "🗣️", titulo: "Diga o que olhar", texto: "“Analise a luz e o enquadramento” rende muito mais que “o que acha?”." },
            { icone: "🖼️", titulo: "Compare lado a lado", texto: "Mande duas ou três opções e peça pra ele escolher e explicar o porquê." }
          ]
        },
        {
          tipo: "pratica",
          titulo: "Agora tente no Claude: mande uma imagem",
          passos: [
            "Escolha uma foto que você vai postar ou um print de métricas.",
            "Anexe no Claude pelo clipe e use um dos prompts.",
            "Confira se tudo o que ele descreveu está mesmo na imagem."
          ],
          prompts: [
            { rotulo: "Para uma foto", texto: "Vou postar esta foto no Instagram da [sua marca]. Me diga:\n1. o que funciona e o que eu poderia melhorar na composição e na luz;\n2. duas opções de legenda curta, no tom [tom da marca];\n3. um texto alternativo para acessibilidade." },
            { rotulo: "Para um print de métricas", texto: "Esse é o print das nossas métricas de [mês]. Me explique em tópicos o que mais chama atenção, o que provavelmente explica esses números e três ações para o próximo mês. Se faltar informação pra concluir algo, me diga." }
          ]
        }
      ]
    },

    /* ============================ MÓDULO 7 ============================ */
    {
      id: "fotos-e-videos",
      titulo: "Fotos e vídeos com IA",
      resumoCurto: "Prompts, roteiros e ajustes",
      resumo: "Com conectores e Skills, o Claude gera imagens e vídeos na própria conversa. E, quando a ferramenta está fora dele, é o parceiro que planeja, escreve os prompts e revisa o resultado.",
      imagem: "img/cafezal.svg",
      imagemAlt: "Ilustração de um cafezal ao amanhecer, com montanhas da serra ao fundo e uma casinha.",
      blocos: [
        {
          tipo: "texto",
          titulo: "O papel do Claude nas fotos e vídeos",
          slide: {
            tipo: "frase",
            icone: "🎬",
            texto: "Com **conectores** e **Skills**, o Claude também gera fotos e vídeos.",
            apoio: "E, quando a ferramenta não está conectada, ele planeja, escreve os prompts e revisa o resultado com você."
          },
          nota: "Pergunte quais geradores ela usa hoje e qual a maior frustração com eles. Quase sempre é “o resultado não sai do jeito que eu imaginei”. Os conectores disponíveis dependem do plano e do que a empresa liberou: confira antes do treinamento quais ela tem. (Módulo 7: ~20 min)",
          texto: "Sozinho, o modelo do Claude responde em texto. Mas ele pode **usar outras ferramentas**:\n\n- **Conectores** ligam o Claude a aplicativos de imagem, vídeo e design. Você pede na conversa, ele aciona a ferramenta e traz o resultado.\n- **Skills** ensinam procedimentos e podem incluir código, como montar artes no padrão da marca, redimensionar formatos ou criar animações simples.\n\nE, mesmo quando a ferramenta fica fora do Claude, ele é ótimo pra **escrever o prompt**, montar o **roteiro** e **analisar o resultado**. O ciclo fica: **Claude planeja → a ferramenta cria → Claude revisa → a ferramenta refaz.**"
        },
        {
          tipo: "cards",
          titulo: "Três jeitos de criar imagem e vídeo com o Claude",
          passoAPasso: true,
          nota: "Os três convivem: muita gente gera rascunhos pelo conector e faz a peça final no gerador preferido.",
          itens: [
            { icone: "🔌", titulo: "Conectores", texto: "O Claude aciona um app de imagem, vídeo ou design conectado à sua conta e mostra o resultado na conversa." },
            { icone: "🧩", titulo: "Skills", texto: "Procedimentos prontos (às vezes com código) que geram artes no padrão da marca, ajustam formatos e criam animações simples." },
            { icone: "📋", titulo: "Prompt para outra ferramenta", texto: "Quando o gerador não está conectado: o Claude escreve o prompt, você cola lá e volta com o resultado." }
          ]
        },
        {
          tipo: "cards",
          titulo: "O ciclo de criação",
          passoAPasso: true,
          itens: [
            { icone: "💡", titulo: "1. Planeje no Claude", texto: "Conte a ideia, o objetivo e onde vai ser postado." },
            { icone: "📝", titulo: "2. Peça o prompt", texto: "Detalhado, em português e em inglês, com o que evitar." },
            { icone: "🎨", titulo: "3. Gere", texto: "Pelo conector, direto na conversa, ou colando o prompt no seu gerador." },
            { icone: "🔁", titulo: "4. Revise com o Claude", texto: "Mande o resultado e peça o que ajustar no prompt." }
          ]
        },
        {
          tipo: "antes-depois",
          titulo: "Por que o prompt importa tanto",
          texto: "O mesmo pedido de foto, escrito de dois jeitos, no mesmo gerador de imagens.",
          nota: "As imagens são ilustrações para o exemplo; o efeito é o mesmo em qualquer gerador.",
          antes: {
            rotulo: "Prompt vago",
            prompt: "foto de café",
            src: "img/foto-generica.svg",
            alt: "Imagem genérica: caneca branca com café sobre um fundo cinza liso.",
            comentario: "Saiu uma caneca qualquer num fundo cinza. Serve pra qualquer marca, ou seja, não serve pra nenhuma."
          },
          depois: {
            rotulo: "Prompt estruturado",
            prompt: "Foto realista de produto: pacote kraft de café com rótulo “Café de Inverno” sobre mesa de madeira rústica, xícara de café fumegante, pão de queijo e canela em pau ao lado. Luz natural suave de janela vindo da esquerda, clima aconchegante de inverno, tons quentes. Lente 50 mm, proporção 4:5.",
            src: "img/cafe-inverno.svg",
            alt: "Imagem detalhada: pacote do Café de Inverno, xícara fumegante, pão de queijo e canela sobre mesa de madeira com luz de janela.",
            comentario: "Cena, objetos, luz, clima, estilo e formato. Agora a imagem tem cara de Café Serra."
          }
        },
        {
          tipo: "cards",
          titulo: "Anatomia de um prompt de imagem",
          passoAPasso: true,
          itens: [
            { icone: "🎯", titulo: "Assunto", texto: "O que aparece: produto, pessoa, cena." },
            { icone: "🏡", titulo: "Cenário", texto: "Onde está: mesa de madeira, cozinha mineira, balcão da loja." },
            { icone: "💡", titulo: "Luz", texto: "Natural de janela, fim de tarde, luz quente de luminária." },
            { icone: "📐", titulo: "Enquadramento", texto: "Close, de cima, plano aberto, lente 50 mm." },
            { icone: "🎨", titulo: "Estilo e clima", texto: "Foto realista, aconchegante, tons quentes, minimalista." },
            { icone: "📱", titulo: "Formato", texto: "4:5 no feed; 9:16 nos Stories e Reels." }
          ]
        },
        {
          tipo: "chat",
          tituloBloco: "Pedindo um prompt de imagem",
          titulo: "Nova conversa",
          contexto: "📁 Dentro do Projeto: Café Serra – Conteúdo",
          nota: "Mostre os campos separados no resultado: dá pra ajustar só a luz, só o cenário… sem reescrever tudo.",
          mensagens: [
            {
              autor: "aluna",
              texto: "quero gerar uma foto pro post do Kit Presente de Dia das Mães. a ideia é algo afetivo, tipo café da manhã de domingo em família. me monta um prompt bom pro gerador de imagens? manda em inglês também, que lá funciona melhor",
              nota: "Ela conta a ideia e o sentimento e já pede em inglês, que costuma render melhor em muitos geradores."
            },
            {
              autor: "assistente",
              texto: "Montei pensando no feed (4:5) e no clima afetivo que você descreveu. Separei por partes pra você mexer só no que quiser antes de gerar, e deixei a versão completa em português e em inglês.",
              nota: "Repare no “sem rostos”: além de evitar rostos estranhos, deixa quem vê se imaginar na cena.",
              artefatos: [
                {
                  tipo: "prompt-imagem",
                  titulo: "Prompt: Kit Presente · Dia das Mães",
                  ferramenta: "Para colar no seu gerador de imagens",
                  campos: [
                    { rotulo: "Assunto", valor: "Kit Presente da Café Serra: caixa kraft com laço verde, pacote de café e caneca" },
                    { rotulo: "Cenário", valor: "Mesa de café da manhã de domingo numa cozinha mineira, toalha de crochê, bolo de fubá e flores do campo" },
                    { rotulo: "Pessoas", valor: "Mãos de mãe e filha se encontrando ao entregar o kit, **sem mostrar rostos**" },
                    { rotulo: "Luz", valor: "Luz natural da manhã entrando pela janela, suave e quente" },
                    { rotulo: "Enquadramento", valor: "Plano médio levemente de cima, foco no kit, fundo desfocado" },
                    { rotulo: "Estilo", valor: "Fotografia realista e afetiva, tons quentes e terrosos" },
                    { rotulo: "Formato", valor: "Proporção 4:5 (feed do Instagram)" }
                  ],
                  prompt: "Foto realista de um café da manhã de domingo numa cozinha mineira: sobre uma mesa com toalha de crochê, mãos de mãe e filha se encontram ao entregar uma caixa kraft com laço verde, com um pacote de café e uma caneca dentro. Ao redor, bolo de fubá e flores do campo. Luz natural suave da manhã entrando pela janela, tons quentes e terrosos, plano médio levemente de cima, foco no presente, fundo desfocado. Sem rostos visíveis. Proporção 4:5.",
                  promptIngles: "Realistic photo of a Sunday breakfast in a rustic Brazilian countryside kitchen: on a table with a crochet tablecloth, the hands of a mother and her adult daughter meet while handing over a kraft gift box with a green ribbon, holding a coffee bag and a mug. Around it, cornmeal cake and wildflowers. Soft warm morning light from a window, warm earthy tones, medium shot from slightly above, focus on the gift, blurred background. No visible faces. Aspect ratio 4:5.",
                  evitar: "texto escrito na imagem, logotipos, rostos, aparência de banco de imagens"
                }
              ]
            }
          ]
        },
        {
          tipo: "chat",
          tituloBloco: "Revisando o que o gerador entregou",
          titulo: "Nova conversa",
          contexto: "📁 Dentro do Projeto: Café Serra – Conteúdo",
          nota: "Esse é o ciclo completo: gerar, mandar pro Claude, ajustar o prompt, gerar de novo. Cada volta chega mais perto do que ela imaginou.",
          mensagens: [
            {
              autor: "aluna",
              anexo: { nome: "cafe-inverno-v1.png", imagem: "img/cafe-inverno.svg", alt: "Imagem gerada: pacote do Café de Inverno, xícara fumegante, pão de queijo e canela sobre mesa de madeira." },
              texto: "gerei essa com o prompt do café de inverno. gostei, mas sinto que falta alguma coisa pro feed. o que eu mudo no prompt?",
              nota: "Ela manda a imagem **e** diz pra onde ela vai (feed). Isso orienta a crítica."
            },
            {
              autor: "assistente",
              texto: "Ficou bonita: luz quente, rótulo legível e o vapor dá vida à cena. Pro feed, eu mexeria em três pontos:\n\n1. **Espaço pra texto.** O pacote está bem no centro. Se você for colocar título no post, peça espaço livre na parte de cima.\n2. **Canela cortada na borda.** Peça todos os objetos inteiros dentro do quadro.\n3. **Gente na cena.** Uma mão segurando a xícara traz calor humano e costuma chamar mais atenção no feed.\n\n**Prompt ajustado (inglês):**\nRealistic product still life: kraft coffee bag labeled “Café de Inverno” on a rustic wooden table, a hand holding a steaming cup of coffee next to it, cheese bread and cinnamon sticks, all objects fully inside the frame, soft natural window light from the left, cozy winter mood, warm tones, empty space at the top for text, 50mm lens, 4:5 aspect ratio.",
              nota: "Ele aponta problemas **visíveis na imagem** e devolve o prompt já corrigido. Ela só precisa colar e gerar de novo."
            }
          ]
        },
        {
          tipo: "chat",
          tituloBloco: "Gerando direto na conversa",
          titulo: "Continuação da conversa",
          contexto: "🔌 Conector de geração de imagens ativo nesta conta",
          nota: "Mostre o selo “Conector em uso”: o Claude acionou a ferramenta conectada e trouxe a imagem pra conversa. O nome e as opções do conector variam de acordo com a ferramenta que vocês usam.",
          mensagens: [
            {
              autor: "aluna",
              texto: "ficou ótimo esse prompt ajustado. gera a imagem aqui mesmo pelo conector? quero ver como fica antes de mandar pra designer",
              nota: "Com um conector ativo, não precisa copiar e colar: ela pede e a imagem vem pra conversa."
            },
            {
              autor: "assistente",
              conector: "Gerador de imagens",
              texto: "Gerei com o prompt ajustado: objetos inteiros no quadro e espaço livre em cima pro título. Se quiser, faço variações com luz de fim de tarde ou com a mão segurando a xícara mais perto da câmera.",
              nota: "A partir daqui vale tudo o que você aprendeu no módulo 5: peça ajustes específicos (“mais espaço em cima”, “luz mais quente”), não “melhora”.",
              artefatos: [
                {
                  tipo: "imagem",
                  titulo: "Café de Inverno · feed 4:5",
                  src: "img/cafe-inverno.svg",
                  alt: "Imagem gerada: pacote do Café de Inverno, xícara fumegante, pão de queijo e canela sobre mesa de madeira, com luz de janela.",
                  ferramenta: "Gerada pelo conector de imagens (ilustração do exemplo)",
                  prompt: "Realistic product still life: kraft coffee bag labeled “Café de Inverno” on a rustic wooden table, a hand holding a steaming cup of coffee next to it, cheese bread and cinnamon sticks, all objects fully inside the frame, soft natural window light from the left, cozy winter mood, warm tones, empty space at the top for text, 50mm lens, 4:5 aspect ratio."
                }
              ]
            }
          ]
        },
        {
          tipo: "chat",
          tituloBloco: "Do roteiro ao vídeo",
          titulo: "Nova conversa",
          contexto: "📁 Dentro do Projeto: Café Serra – Conteúdo",
          nota: "Misturar cenas geradas e gravadas é um ótimo caminho: a IA cobre o que é difícil de filmar (a fazenda) e a loja traz a verdade da marca.",
          mensagens: [
            {
              autor: "aluna",
              texto: "agora vídeo: quero um Reels de 15 segundos sobre a jornada do Café de Inverno, do pé de café até a xícara. vou gerar algumas cenas com IA e gravar outras aqui na loja. me monta o roteiro?"
            },
            {
              autor: "assistente",
              texto: "Dividi em 5 cenas e marquei quais dá pra gerar com IA e quais vale gravar de verdade na loja. As cenas geradas já têm prompt em inglês: dá pra usar no seu gerador de vídeo ou, se tiver um conector de vídeo ativo, eu gero aqui mesmo. A legenda vai junto.",
              artefatos: [
                {
                  tipo: "roteiro",
                  titulo: "Reels: do pé à xícara",
                  formato: "Reels · 9:16 · 15 segundos",
                  cenas: [
                    { tempo: "0–2 s", imagem: "Close de frutos vermelhos no pé de café, com neblina na serra ao fundo. **Gerar com IA.**", textoTela: "De onde vem o seu café?", audio: "Passarinhos e vento leve", promptVideo: "Slow close-up of ripe red coffee cherries on a coffee plant, morning mist over green mountains in the background, soft golden light, gentle breeze, realistic, vertical 9:16" },
                    { tempo: "2–5 s", imagem: "Mãos colhendo os frutos e colocando no balaio. **Gerar com IA.**", textoTela: "Colhido à mão na serra", audio: "Entra um violão suave", promptVideo: "Close-up of a farmer's hands gently picking red coffee cherries into a woven basket, shallow depth of field, warm natural light, realistic, vertical 9:16" },
                    { tempo: "5–9 s", imagem: "Grãos girando no torrador da loja. **Gravar na loja.**", textoTela: "Torra média, em pequenos lotes", audio: "Grãos estalando + violão" },
                    { tempo: "9–13 s", imagem: "Café passando no coador de pano, vapor subindo. **Gravar na loja.**", textoTela: "Chocolate e canela, sem aditivo", audio: "Violão continua" },
                    { tempo: "13–15 s", imagem: "Pacote do Café de Inverno ao lado da xícara, câmera se aproximando devagar. **Gravar na loja.**", textoTela: "Café de Inverno · só nesta estação", audio: "Violão termina num acorde" }
                  ],
                  legenda: "Do pé de café, lá na serra, até a sua xícara. ☕ O Café de Inverno é colhido à mão e torrado aqui, em pequenos lotes. Só nesta estação!",
                  hashtags: ["#CaféSerra", "#CaféDeInverno", "#DoPéÀXícara"]
                }
              ]
            }
          ]
        },
        {
          tipo: "video",
          titulo: "E o vídeo fica assim",
          texto: "Prévia montada com as cenas do roteiro: as do cafezal geradas com IA, as da loja gravadas no celular. Clique numa cena para ir direto a ela.",
          nota: "Deixe tocar uma vez inteira e depois volte cena a cena comentando: o que foi gerado, o que foi gravado e o texto na tela. Lembre que é uma simulação para visualizar o roteiro.",
          alt: "Prévia simulada de um Reels vertical do Café de Inverno, do cafezal até a xícara, em cinco cenas.",
          cenas: [
            { tempo: "0–2 s", visual: "img/cafezal.svg", foco: "48% 92%", efeito: "zoom-in", origem: "ia", textoTela: "De onde vem o seu café?", audio: "Passarinhos e vento leve" },
            { tempo: "2–5 s", visual: "img/cafezal.svg", foco: "30% 70%", efeito: "pan-direita", origem: "ia", textoTela: "Colhido à mão na serra", audio: "Entra um violão suave" },
            { tempo: "5–9 s", visual: "img/torra.svg", foco: "52% 60%", efeito: "zoom-out", origem: "loja", textoTela: "Torra média, em pequenos lotes", audio: "Grãos estalando + violão" },
            { tempo: "9–13 s", visual: "img/coador.svg", foco: "50% 55%", efeito: "zoom-in", origem: "loja", textoTela: "Chocolate e canela, sem aditivo", audio: "Violão continua" },
            { tempo: "13–15 s", visual: "img/cafe-inverno.svg", foco: "45% 60%", efeito: "pan-esquerda", origem: "loja", textoTela: "Café de Inverno · só nesta estação", audio: "Violão termina num acorde" }
          ]
        },
        {
          tipo: "pratica",
          titulo: "Agora tente: sua próxima foto e seu próximo vídeo",
          passos: [
            "Veja quais conectores de imagem e vídeo estão ativos na sua conta do Claude.",
            "Peça um prompt de imagem para um post real da sua marca (prompt 1) e gere: pelo conector, se tiver, ou no seu gerador favorito.",
            "Volte ao Claude, anexe a imagem e peça os ajustes (prompt 2).",
            "Para vídeo, peça um roteiro com prompts por cena (prompt 3)."
          ],
          prompts: [
            { rotulo: "1 · Prompt de imagem", texto: "Quero criar uma imagem para [post / campanha] da [sua marca]. A ideia é [descreva a cena e o sentimento]. Vai ser publicada no [feed 4:5 / Stories 9:16].\nMonte um prompt detalhado para um gerador de imagens, separando assunto, cenário, luz, enquadramento, estilo e formato. Entregue em português e em inglês e diga o que evitar." },
            { rotulo: "2 · Revisão da imagem gerada", texto: "Gerei esta imagem com o prompt abaixo. Ela vai para [onde]. O que está funcionando e o que você mudaria? Reescreva o prompt com os ajustes.\n\n[cole o prompt usado]" },
            { rotulo: "3 · Roteiro de vídeo", texto: "Monte um roteiro de Reels de [15/30] segundos sobre [tema] para a [sua marca]. Divida em cenas com tempo, o que aparece, texto na tela e áudio. Marque quais cenas posso gerar com IA e quais devo gravar, e escreva um prompt em inglês para cada cena gerada." }
          ]
        }
      ]
    },

    /* ============================ MÓDULO 8 ============================ */
    {
      id: "projetos",
      titulo: "Projetos como base da marca",
      resumoCurto: "Contexto salvo",
      resumo: "Pare de explicar quem é a marca em toda conversa: guarde o contexto num Projeto.",
      blocos: [
        {
          tipo: "texto",
          titulo: "O problema",
          slide: {
            tipo: "frase",
            icone: "📁",
            texto: "Toda conversa nova começa **do zero**.",
            apoio: "O Projeto guarda as instruções e os arquivos de um trabalho. Toda conversa criada dentro dele já começa sabendo o contexto."
          },
          nota: "Pergunte quantas vezes por semana ela explica o tom da marca pra alguém (ou pra IA). (Módulo 8: ~10 min)",
          texto: "Toda conversa nova começa do zero. Explicar o tom de voz, o público e os produtos a cada pedido cansa e deixa os resultados inconsistentes.\n\nO **Projeto** resolve isso: é um espaço que guarda as **instruções** e os **arquivos** de um trabalho. Toda conversa criada dentro dele já começa sabendo o contexto."
        },
        {
          tipo: "projeto",
          titulo: "Por dentro de um Projeto",
          nome: "Café Serra – Conteúdo",
          descricao: "Redes sociais, e-mail e blog da Café Serra.",
          nota: "Destaque que as instruções são texto comum, escrito como um briefing pra uma pessoa nova na equipe.",
          instrucoes: "Você escreve para a Café Serra, cafeteria e torrefação artesanal do interior de Minas.\n\n- **Público:** pessoas de 25 a 45 anos que valorizam café especial e produto local.\n- **Tom de voz:** acolhedor, próximo, com toques de mineiridade, sem exagero.\n- Frases curtas. Nada de jargão técnico de barista.\n- **Produtos:** Café de Inverno, Coado da Casa, Kit Presente.\n- **Visual:** luz natural, madeira, tons quentes. Nada de foto com cara de banco de imagens.\n- Termine sempre com um convite claro.\n- Consulte os arquivos do projeto antes de responder.",
          arquivos: [
            { nome: "guia-de-tom-de-voz.pdf", tamanho: "1,2 MB" },
            { nome: "catalogo-de-produtos.pdf", tamanho: "3,4 MB" },
            { nome: "persona-cliente.pdf", tamanho: "640 KB" },
            { nome: "posts-que-funcionaram.docx", tamanho: "240 KB" },
            { nome: "referencias-visuais.pdf", tamanho: "5,8 MB" },
            { nome: "calendario-editorial.xlsx", tamanho: "88 KB" }
          ]
        },
        {
          tipo: "chat",
          tituloBloco: "Conversando dentro do Projeto",
          titulo: "Nova conversa",
          contexto: "📁 Dentro do Projeto: Café Serra – Conteúdo",
          nota: "Compare com o pedido longo do módulo 4: aqui ele é curto porque o contexto já está no Projeto.",
          mensagens: [
            {
              autor: "aluna",
              texto: "preciso de 3 ideias de post pro Dia das Mães com o Kit Presente",
              nota: "Repare: pedido curtinho. Nada de explicar marca, público ou tom, porque isso já está no Projeto."
            },
            {
              autor: "assistente",
              texto: "Com o Kit Presente dá pra brincar bastante com memória afetiva. Três caminhos:\n\n1. **“Café com mãe é outro café”**: carrossel com fotos de clientes e suas mães aqui na loja. No último slide, o Kit Presente embrulhado, pronto pra levar.\n2. **Bilhete na caixa**: vídeo curtinho da equipe escrevendo à mão o bilhete que vai em cada kit. Legenda: “Porque carinho mineiro vem com recado.”\n3. **“O primeiro café do dia era dela”**: post de memória, chamando o pessoal pra contar nos comentários quem passava o café em casa.\n\nConvite pra qualquer um deles: *“Encomende o Kit Presente até quinta e retire na loja.”*\n\nQual você quer que eu desenvolva?",
              nota: "Tom acolhedor e mineiro, produto certo e convite no final: as instruções do Projeto foram aplicadas sozinhas."
            },
            {
              autor: "aluna",
              texto: "a 3! faz a legenda e me sugere a foto"
            },
            {
              autor: "assistente",
              texto: "Segue a legenda, com uma sugestão de foto pra acompanhar. Pensei numa cena de cozinha, bem no clima de memória.",
              nota: "Algumas respostas viram **artefatos**: conteúdos prontos, fáceis de revisar e copiar.",
              artefatos: [
                {
                  tipo: "post",
                  titulo: "Legenda: Dia das Mães",
                  posts: [
                    {
                      texto: "O primeiro café do dia era dela.\n\nO cheirinho subindo da cozinha, a garrafa térmica na mesa, o “senta aí que já tá pronto”.\n\nNeste Dia das Mães, conta pra gente: quem passava o café na sua casa? ☕💛\n\nE se quiser retribuir esse carinho, o Kit Presente está te esperando. Encomende até quinta e retire na loja.",
                      hashtags: ["#CaféSerra", "#DiaDasMães", "#KitPresente"],
                      foto: "img/coador.svg",
                      imagem: "Café passando no coador de pano sobre um bule esmaltado, numa cozinha com luz da manhã"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          tipo: "cards",
          titulo: "O que colocar num Projeto",
          itens: [
            { icone: "📋", titulo: "Instruções", texto: "Quem é a marca, público, tom de voz, produtos e regras (o que fazer e o que evitar)." },
            { icone: "📎", titulo: "Arquivos de conhecimento", texto: "Guia de marca, catálogo, persona, posts de referência, referências visuais, calendário." },
            { icone: "🗂️", titulo: "Um Projeto por trabalho", texto: "Uma marca, um cliente ou uma campanha longa. Assuntos diferentes ficam em projetos diferentes." }
          ]
        },
        {
          tipo: "destaque",
          icone: "📁",
          cor: "verde",
          titulo: "Resumindo",
          slide: {
            tipo: "frase",
            texto: "Projeto guarda o **contexto** de um trabalho.",
            apoio: "Quem somos, pra quem falamos e como falamos."
          },
          texto: "**Projeto guarda o *contexto* de um trabalho:** quem somos, pra quem falamos e como falamos."
        },
        {
          tipo: "pratica",
          titulo: "Agora tente no Claude: o Projeto da sua marca",
          passos: [
            "Use o prompt abaixo pra IA te entrevistar e escrever as instruções.",
            "Crie um Projeto com o nome da sua marca e cole as instruções.",
            "Anexe 2 ou 3 arquivos: guia de marca, posts que funcionaram, referências visuais.",
            "Abra uma conversa dentro do Projeto e faça um pedido curtinho. Repare na diferença."
          ],
          prompt: "Me ajude a escrever as instruções de um Projeto para a marca [nome da sua marca]. Faça perguntas, uma de cada vez, sobre público, tom de voz, produtos, estilo visual e regras, até ter informação suficiente. No final, entregue as instruções prontas para colar."
        }
      ]
    },

    /* ============================ MÓDULO 9 ============================ */
    {
      id: "skills",
      titulo: "Skills",
      resumoCurto: "Procedimentos automáticos",
      resumo: "Ensine a IA a fazer uma tarefa do seu jeito uma vez só, e ela aplica sozinha sempre que a tarefa aparecer.",
      blocos: [
        {
          tipo: "texto",
          titulo: "O que é uma Skill?",
          slide: {
            tipo: "frase",
            icone: "🧩",
            texto: "Se o Projeto guarda o **contexto**, a Skill guarda um **procedimento**.",
            apoio: "Ela é carregada sozinha quando a tarefa aparece e funciona em qualquer conversa."
          },
          nota: "(Módulo 9: ~10 min)",
          texto: "Se o Projeto guarda o **contexto**, a **Skill** guarda um **procedimento**: um pacote de instruções que ensina a IA a fazer uma tarefa específica do jeito certo, sempre igual.\n\nA Skill é **carregada sozinha** quando a tarefa aparece na conversa e funciona **em qualquer conversa**, dentro ou fora de um Projeto."
        },
        {
          tipo: "tabela",
          titulo: "Projeto × Skill",
          passoAPasso: true,
          nota: "A analogia final costuma fixar o conceito: a pasta do cliente × a receita da casa.",
          colunas: ["", "Projeto", "Skill"],
          linhas: [
            ["O que guarda", "**Contexto**: quem é a marca, tom, arquivos", "**Procedimento**: o passo a passo de uma tarefa"],
            ["Quando atua", "Em toda conversa dentro do Projeto", "Sozinha, quando a tarefa aparece"],
            ["Onde funciona", "Só dentro daquele Projeto", "Em qualquer conversa"],
            ["Exemplo", "Café Serra – Conteúdo", "carrossel-cafe-serra"],
            ["Analogia", "A pasta do cliente", "A receita da casa"]
          ]
        },
        {
          tipo: "skill",
          titulo: "Como uma Skill se parece",
          texto: "No fundo, uma Skill é um arquivo de texto com nome, descrição e instruções. A **descrição** é o que faz a IA lembrar de usá-la na hora certa.",
          passoAPasso: true,
          nota: "Leia as instruções em voz alta: são as regras que ela já explica toda semana pra quem faz os carrosséis.",
          nome: "carrossel-cafe-serra",
          descricao: "Use ao criar carrosséis de Instagram para a Café Serra.",
          instrucoes: [
            "6 a 8 slides.",
            "Slide 1: gancho com até 8 palavras.",
            "Slides do meio: uma ideia por slide, até 25 palavras.",
            "Último slide: convite pra visitar a loja ou o site.",
            "Seguir o tom de voz da marca.",
            "Entregar também uma legenda com até 3 hashtags."
          ]
        },
        {
          tipo: "chat",
          tituloBloco: "Criando a Skill com a ajuda da IA",
          titulo: "Conversa: criar uma skill",
          nota: "Ponto-chave: ela não precisa saber o formato técnico. A IA entrevista e monta.",
          mensagens: [
            {
              autor: "aluna",
              texto: "toda semana eu faço carrossel pro Instagram da Café Serra e sempre explico as mesmas regras. dá pra transformar isso numa skill?",
              nota: "Não precisa saber o formato técnico. Descreva a tarefa repetitiva e deixe a IA conduzir."
            },
            {
              autor: "assistente",
              texto: "Dá sim, e é uma ótima candidata: tarefa repetitiva com regras claras. Antes de montar, me conta:\n\n1. Quantos slides costumam ter?\n2. Como é o primeiro slide?\n3. Tem limite de texto por slide?\n4. Como o carrossel termina?\n5. A legenda vai junto?",
              nota: "A IA entrevista você pra descobrir o procedimento. Responda como explicaria pra alguém novo na equipe."
            },
            {
              autor: "aluna",
              texto: "entre 6 e 8 slides. o primeiro é um gancho curtinho, até 8 palavras. nos do meio, uma ideia por slide, no máximo 25 palavras. o último sempre chama pra visitar a loja ou o site. e sim, quero a legenda com até 3 hashtags. tudo no tom da marca"
            },
            {
              autor: "assistente",
              texto: "Montei a skill:\n\n**Nome:** carrossel-cafe-serra\n**Descrição:** Use ao criar carrosséis de Instagram para a Café Serra.\n\n**Instruções:**\n- 6 a 8 slides.\n- Slide 1: gancho com até 8 palavras.\n- Slides do meio: uma ideia por slide, até 25 palavras.\n- Último slide: convite pra visitar a loja ou o site.\n- Seguir o tom de voz da marca.\n- Entregar também uma legenda com até 3 hashtags.\n\nÉ só salvar nas suas Skills. Daqui pra frente, quando você pedir um carrossel da Café Serra, eu sigo essas regras sem você precisar repetir.",
              nota: "Repare na **descrição**: ela diz *quando* a skill deve ser usada. É isso que faz ela ser carregada sozinha depois."
            }
          ]
        },
        {
          tipo: "chat",
          tituloBloco: "Dias depois, numa conversa nova…",
          titulo: "Nova conversa",
          contexto: "💬 Conversa nova, fora do Projeto",
          nota: "Peça pra ela conferir as regras da Skill no carrossel: 7 slides, gancho curto, convite no final, 3 hashtags.",
          mensagens: [
            {
              autor: "aluna",
              texto: "faz um carrossel sobre o café de inverno",
              nota: "Pedido curtíssimo, numa conversa nova. Observe o selo que aparece na resposta."
            },
            {
              autor: "assistente",
              skill: "carrossel-cafe-serra",
              texto: "Usei a skill **carrossel-cafe-serra**: ficaram 7 slides, com gancho curto, uma ideia por slide e convite no final. A legenda vai junto.",
              nota: "O selo mostra que a skill foi carregada **sozinha**. E o resultado segue todas as regras.",
              artefatos: [
                {
                  tipo: "carrossel",
                  titulo: "Carrossel: Café de Inverno",
                  slides: [
                    "Tem café que abraça.",
                    "O Café de Inverno é um blend da casa, torrado aqui em Minas, em pequenos lotes.",
                    "Nas notas, chocolate e um toque de canela. Doce na medida, sem precisar de açúcar.",
                    "Fica bom no coador de pano, na prensa ou naquela cafeteira que já é da família.",
                    "Combina com pão de queijo, bolo de fubá e prosa comprida na mesa da cozinha.",
                    "É edição de inverno: quando a estação vai embora, ele vai junto.",
                    "Vem provar na loja ou garanta o seu no site. A xícara já tá quentinha. ☕"
                  ],
                  legenda: "O frio chegou e o Café de Inverno também. Chocolate, canela e aquele aconchego que só café mineiro tem. Corre, que é por pouco tempo! ☕",
                  hashtags: ["#CaféSerra", "#CaféDeInverno", "#CaféEspecial"]
                }
              ]
            }
          ]
        },
        {
          tipo: "cards",
          titulo: "Outras ideias de Skills pro seu dia a dia",
          itens: [
            { icone: "📸", titulo: "Imagem no padrão da marca", texto: "Transforma qualquer ideia numa imagem (ou num prompt) com o estilo visual da marca: luz, cores, proporção e o que evitar." },
            { icone: "🎬", titulo: "Roteiro de Reels", texto: "Gancho nos 3 primeiros segundos, cenas, texto na tela, áudio e legenda, sempre no mesmo formato." },
            { icone: "🗣️", titulo: "Revisão de tom de voz", texto: "Confere se um texto segue o guia da marca e aponta cada trecho que fugiu do tom." },
            { icone: "🎨", titulo: "Briefing pra designer", texto: "Transforma uma ideia de post num briefing com formato, textos, referências e prazo." }
          ]
        },
        {
          tipo: "destaque",
          icone: "🧩",
          cor: "verde",
          titulo: "Regra de bolso",
          slide: {
            tipo: "frase",
            texto: "Explicou as mesmas instruções **três vezes**?",
            apoio: "Tá na hora de virar uma Skill."
          },
          texto: "Explicou as mesmas instruções **três vezes**? Tá na hora de virar uma Skill."
        },
        {
          tipo: "pratica",
          titulo: "Agora tente no Claude: sua primeira Skill",
          texto: "Pense numa tarefa que você faz toda semana, como prompts de imagem ou roteiros de Reels.",
          passos: [
            "Mande o prompt abaixo e responda às perguntas da IA com calma.",
            "Revise a skill que ela montar: as regras estão completas?",
            "Salve nas suas Skills e teste numa conversa nova com um pedido curtinho."
          ],
          prompt: "Me ajude a criar uma skill para [tarefa repetitiva, ex.: escrever prompts de imagem no estilo da minha marca]. Faça perguntas sobre o passo a passo, as regras e o formato de entrega antes de montar a skill."
        }
      ]
    },

    /* ============================ MÓDULO 10 ============================ */
    {
      id: "reaproveitamento",
      titulo: "Reaproveitamento de conteúdo",
      resumoCurto: "Um conteúdo, vários formatos",
      resumo: "Um bom texto rende muitos: transforme um artigo do blog em carrossel, legendas e newsletter.",
      imagem: "img/coador.svg",
      imagemAlt: "Ilustração de café passando no coador de pano sobre um bule esmaltado, com uma xícara ao lado.",
      blocos: [
        {
          tipo: "texto",
          slide: {
            tipo: "frase",
            icone: "♻️",
            texto: "Um bom texto rende **muitos**.",
            apoio: "Artigos, apresentações e roteiros antigos viram várias peças, cada uma no formato certo."
          },
          nota: "(Módulo 10: ~8 min)",
          texto: "Você já tem conteúdo bom espalhado por aí: artigos do blog, apresentações, roteiros antigos. Com a IA, um único material vira várias peças, **cada uma no formato certo**, em minutos."
        },
        {
          tipo: "chat",
          tituloBloco: "Um artigo, três formatos",
          titulo: "Nova conversa",
          contexto: "📁 Dentro do Projeto: Café Serra – Conteúdo",
          nota: "Quando os resultados aparecerem, navegue pelas abas: carrossel, legendas e e-mail.",
          mensagens: [
            {
              autor: "aluna",
              texto: "segue o artigo do blog desta semana. a partir dele, cria: um carrossel pro Instagram, três legendas curtas pros posts da semana e um e-mail pra newsletter",
              anexo: {
                nome: "blog-do-grao-a-xicara.docx",
                conteudo: "### Do grão à xícara: como nasce o Café de Inverno\n\nTodo ano, quando o frio chega na Serra da Mantiqueira, a gente começa a preparar o Café de Inverno. Os grãos vêm de três pequenos produtores parceiros, a menos de 80 km da nossa torrefação.\n\nA colheita é feita à mão, e os grãos secam devagar, ao sol, em terreiros suspensos. Depois, descansam por 30 dias antes da torra.\n\nNa torrefação, usamos uma torra média, que realça as notas de chocolate. A canela aparece no aroma, sem nenhum aditivo: é característica do próprio grão.\n\nO resultado é um café encorpado e doce, que pede uma mesa farta e uma conversa sem pressa. São só 600 pacotes por safra."
              },
              nota: "Mandar o material de origem dá à IA **fatos reais** pra trabalhar e reduz a chance de ela inventar."
            },
            {
              autor: "assistente",
              texto: "Preparei os três a partir do artigo:\n\n1. **Carrossel** com 7 slides contando a jornada do grão à xícara.\n2. **Três legendas**, cada uma com um ângulo diferente, já com sugestão de foto.\n3. **E-mail da newsletter** com assunto, pré-cabeçalho e convite pra loja.\n\nTodos usam os dados do artigo (3 produtores, secagem ao sol, 600 pacotes). Vale conferir os números antes de publicar.",
              nota: "Repare no aviso final: **confira dados e números antes de publicar**. A gente volta nisso no último módulo.",
              artefatos: [
                {
                  tipo: "carrossel",
                  titulo: "Carrossel: Do grão à xícara",
                  slides: [
                    "Do grão à xícara, sem pressa.",
                    "O Café de Inverno nasce na Serra da Mantiqueira, com três pequenos produtores parceiros.",
                    "Tudo pertinho: as fazendas ficam a menos de 80 km da nossa torrefação.",
                    "A colheita é feita à mão. Os grãos secam devagar, ao sol.",
                    "Depois, descansam 30 dias antes de ir para a torra.",
                    "Torra média, que realça o chocolate. E a canela? Vem do próprio grão.",
                    "São só 600 pacotes por safra. Garanta o seu na loja ou no site. ☕"
                  ],
                  legenda: "Já pensou em tudo o que acontece antes do café chegar na sua xícara? Arrasta pro lado e vem com a gente, da serra até a mesa.",
                  hashtags: ["#CaféSerra", "#DoGrãoÀXícara", "#CaféDeInverno"]
                },
                {
                  tipo: "post",
                  titulo: "Legendas da semana",
                  posts: [
                    {
                      texto: "Segunda-feira pede café sem pressa. O nosso secou ao sol, descansou 30 dias e chegou no ponto pra começar a sua semana do jeito certo. ☕",
                      hashtags: ["#CaféSerra", "#CaféDeInverno"],
                      foto: "img/coador.svg",
                      imagem: "Café passando no coador de pano, com uma xícara ao lado e luz da manhã"
                    },
                    {
                      texto: "Conheça quem planta o seu café: três famílias da Mantiqueira, a menos de 80 km daqui. Café bom é café de vizinho. 💛",
                      hashtags: ["#CaféSerra", "#ProduçãoLocal"],
                      foto: "img/cafezal.svg",
                      imagem: "Cafezal ao amanhecer, com a serra ao fundo e uma casinha"
                    },
                    {
                      texto: "Chocolate e canela, sem nenhum aditivo. É o grão que é assim mesmo, uai. Só 600 pacotes nesta safra!",
                      hashtags: ["#CaféSerra", "#CaféEspecial", "#CaféDeInverno"],
                      foto: "img/cafe-inverno.svg",
                      imagem: "Pacote do Café de Inverno ao lado de uma xícara, pão de queijo e canela"
                    }
                  ]
                },
                {
                  tipo: "email",
                  titulo: "Newsletter: Do grão à xícara",
                  assunto: "Do grão à xícara: a história do Café de Inverno ☕",
                  preCabecalho: "Três produtores, secagem ao sol e só 600 pacotes.",
                  corpo: "Oi, tudo bem?\n\nO frio chegou na Serra da Mantiqueira e, com ele, o nosso **Café de Inverno**.\n\nEste ano, ele vem de três pequenos produtores parceiros, a menos de 80 km da torrefação. A colheita é feita à mão, os grãos secam devagar ao sol e descansam 30 dias antes da torra.\n\nNa xícara, você vai sentir:\n- notas de chocolate, realçadas pela torra média;\n- um toque de canela que vem do próprio grão;\n- corpo encorpado e doçura natural.\n\nSão só **600 pacotes** nesta safra. Passa na loja pra provar ou garanta o seu no site.\n\nUm abraço quentinho,\nEquipe Café Serra",
                  botao: "Quero o meu Café de Inverno"
                }
              ]
            },
            {
              autor: "aluna",
              texto: "ficou ótimo! só deixa o e-mail mais curto e troca o assunto por algo mais curioso",
              nota: "Dá pra pedir tudo de uma vez e depois **ajustar cada peça separadamente**, com a mesma lógica do módulo 5."
            },
            {
              autor: "assistente",
              texto: "Três opções de assunto mais curiosas:\n\n- **“Por que esse café tem gosto de canela?”**\n- “600 pacotes. Nem um a mais.”\n- “O segredo está no terreiro (e no tempo)”\n\nE enxuguei o corpo pra três parágrafos, mantendo os números e o convite. Quer que eu atualize o e-mail com a primeira opção?"
            }
          ]
        },
        {
          tipo: "cards",
          titulo: "Por que isso funciona",
          itens: [
            { icone: "📌", titulo: "Uma fonte, uma verdade", texto: "Todas as peças partem do mesmo material, então a mensagem fica consistente." },
            { icone: "📐", titulo: "Formato certo", texto: "Carrossel é visual e curto; e-mail pode contar mais; legenda puxa conversa." },
            { icone: "⏱️", titulo: "Tempo de sobra", texto: "O tempo que você gastaria escrevendo vai para revisar, ajustar e planejar." }
          ]
        },
        {
          tipo: "pratica",
          titulo: "Agora tente no Claude: um texto, várias peças",
          texto: "Escolha um texto que vocês já publicaram e cole no lugar indicado.",
          passos: [
            "Cole o texto e peça as três peças com o prompt abaixo.",
            "Escolha a peça mais fraca e ajuste com um segundo pedido bem feito.",
            "Peça também um prompt de imagem pra acompanhar o carrossel."
          ],
          prompt: "Vou colar abaixo um texto que já publicamos. A partir dele, crie:\n1. um carrossel de 6 slides para o Instagram;\n2. três legendas curtas para os posts da semana, cada uma com uma sugestão de foto;\n3. um e-mail de newsletter com assunto e pré-cabeçalho.\nUse apenas as informações do texto.\n\n[cole aqui o texto]"
        }
      ]
    },

    /* ============================ MÓDULO 11 ============================ */
    {
      id: "cuidados-e-proximos-passos",
      titulo: "Cuidados e próximos passos",
      resumoCurto: "Segurança e desafio",
      resumo: "A IA acelera o trabalho, mas a responsabilidade pelo que vai ao ar continua sendo sua.",
      blocos: [
        {
          tipo: "cards",
          titulo: "Antes de publicar",
          passoAPasso: true,
          nota: "Pergunte qual é a política da empresa dela para dados de clientes e para imagens geradas por IA. (Módulo 11: ~8 min)",
          itens: [
            { icone: "🔎", titulo: "Confira dados e números", texto: "A IA pode errar ou inventar com toda a confiança. Estatísticas, datas, preços e nomes: **sempre confira na fonte**." },
            { icone: "✅", titulo: "Revise como editora", texto: "O texto final é seu. Leia em voz alta, ajuste e corte o que não soa como a marca." },
            { icone: "©️", titulo: "Respeite direitos", texto: "Nada de letra de música, personagens, trechos de livros, logos de outras marcas ou “no estilo de” artistas vivos." },
            { icone: "🔒", titulo: "Cuidado com dados de clientes", texto: "Antes de enviar listas, e-mails ou informações de clientes, **verifique a política da empresa**. Na dúvida, anonimize." },
            { icone: "🧑‍🤝‍🧑", titulo: "Pessoas em imagens", texto: "Foto de cliente ou funcionário só com autorização. Em imagem gerada, evite rostos parecidos com pessoas reais." },
            { icone: "🏷️", titulo: "Transparência", texto: "Se a plataforma pedir, sinalize conteúdo gerado por IA. Na dúvida, prefira ser transparente." }
          ]
        },
        {
          tipo: "pratica",
          titulo: "Agora tente no Claude: peça uma checagem",
          texto: "Um bom hábito é pedir pra própria IA apontar o que precisa ser conferido.",
          prompt: "Revise o texto abaixo antes da publicação. Liste todas as informações que eu deveria confirmar em uma fonte (números, datas, nomes, afirmações) e aponte qualquer trecho que fuja do tom de voz da marca.\n\n[cole aqui o texto]"
        },
        {
          tipo: "pratica",
          titulo: "Desafio da semana: um conteúdo do começo ao fim",
          texto: "Um exercício por dia, usando tudo o que você viu hoje num conteúdo real da sua marca.",
          nota: "Combine uma data pra ela mostrar o resultado do desafio e a primeira Skill criada.",
          passos: [
            "**Segunda:** escolha um tema real e peça uma legenda com o briefing completo (módulo 4).",
            "**Terça:** faça pelo menos dois ajustes usando a anatomia do segundo pedido (módulo 5).",
            "**Quarta:** peça o prompt da imagem, gere no seu gerador e volte com ela pra revisão (módulos 6 e 7).",
            "**Quinta:** transforme o post num roteiro de Reels de 15 segundos (módulo 7).",
            "**Sexta:** peça a checagem final e transforme o passo que mais se repetiu numa Skill (módulos 9 e 11)."
          ]
        },
        {
          tipo: "links",
          titulo: "Para continuar aprendendo",
          itens: [
            { rotulo: "Claude", url: "https://claude.ai", descricao: "Onde você vai praticar todos os dias." },
            { rotulo: "Central de ajuda", url: "https://support.claude.com", descricao: "Tutoriais e respostas sobre recursos como Projetos, Skills e envio de imagens." },
            { rotulo: "Guia de engenharia de prompt (em inglês)", url: "https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview", descricao: "Técnicas mais avançadas pra pedir bem." }
          ]
        },
        {
          tipo: "destaque",
          icone: "☕",
          titulo: "Obrigado!",
          slide: {
            tipo: "frase",
            texto: "Obrigado!",
            apoio: "Este material continua disponível pra consulta, com todas as conversas, notas e prompts de prática."
          },
          texto: "Este material continua disponível pra consulta. Volte quando quiser à página de **estudo** pra rever as conversas com as notas e copiar os prompts de prática sempre que precisar."
        }
      ]
    }
  ]
};
