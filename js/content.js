/* ==========================================================================
   CONTEÚDO DO TREINAMENTO
   --------------------------------------------------------------------------
   Este é o ÚNICO arquivo que você precisa editar para mudar textos.
   Não é preciso entender programação: siga os modelos que já existem.

   Regras rápidas:
   - Textos ficam entre aspas "…". Para usar aspas dentro do texto, escreva \"assim\".
   - Para quebrar linha dentro de um texto, use \n  (duas quebras \n\n = novo parágrafo).
   - Formatação: **negrito**, *itálico*, linhas começando com "- " viram lista,
     linhas começando com "1. " viram lista numerada.
   - Separe itens de uma lista [ … ] com vírgula. Cuidado com a vírgula do último item.

   Estrutura:
   - interface:    textos dos botões e avisos da tela.
   - apresentacao: textos da capa do site e do primeiro slide.
   - marca:        dados da marca fictícia usada nos artefatos.
   - modulos:      lista de módulos. Cada módulo tem "blocos", exibidos em ordem.

   Os MESMOS blocos alimentam as duas páginas:
   - Estudo (estudo.html): cada bloco é uma seção da página do módulo.
   - Apresentação (apresentacao.html): cada módulo ganha um slide de abertura
     e cada bloco vira um slide.

   Tipos de bloco: texto, destaque, frase, cards, visao-geral, chat, comparativo,
   projeto, skill, tabela, tour, pratica, links. Veja exemplos de cada um abaixo
   e no README.md.

   Campos opcionais de qualquer bloco (só afetam os slides):
     slide: { … }        campos que substituem os do bloco NOS SLIDES
                         (ex.: um texto mais curto, ou até outro "tipo")
     slide: false        o bloco aparece só no estudo
     soNosSlides: true   o bloco aparece só nos slides
     passoAPasso: true   itens (cards, linhas, instruções) entram um a um
     nota: "…"           lembrete para o instrutor (tecla N na apresentação)

   Mensagens (dentro de chat/comparativo):
     { autor: "aluna" ou "assistente", texto: "…",
       nota: "nota do instrutor (opcional)",
       anexo: { nome: "arquivo.pdf", conteudo: "texto opcional" },   // só aluna
       skill: "nome-da-skill",                                        // só assistente
       artefatos: [ … ] }                                             // só assistente

   Artefatos: carrossel, post, email (veja exemplos nos Módulos 4, 5 e 6).
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
    capaModulosTitulo: "Os 7 módulos",
    capaProgresso: "{n} de {total} módulos concluídos",
    capaAbrirSlides: "Apresentar o módulo {n}",
    capaAtalhosTitulo: "Atalhos da apresentação",
    capaAtalhos: "[→] ou [Espaço] avança · [←] volta · [O] visão geral · [N] notas · [F] tela cheia · [B] tela preta · [1]–[7] módulos",

    /* Apresentação (apresentacao.html) */
    deckRotulo: "Apresentação em slides",
    slideRotulo: "slide",
    anuncioSlide: "Slide {atual} de {total}: {titulo}",
    contadorSlides: "{atual} / {total}",
    moduloDeTotal: "Módulo {n} de {total}",
    capaDeck: "Capa",
    aberturaModulo: "Abertura",
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
    copiarTexto: "Copiar texto",
    copiado: "Texto copiado!",
    erroCopiar: "Não foi possível copiar automaticamente. Selecione o texto e use Ctrl+C.",
    tipo_carrossel: "Carrossel de Instagram",
    tipo_post: "Legenda de post",
    tipo_email: "E-mail / newsletter",
    tipoCurto_carrossel: "Carrossel",
    tipoCurto_post: "Legendas",
    tipoCurto_email: "E-mail",
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

    /* Projeto, Skill, tabela, tour */
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
    subtitulo: "Um treinamento prático para criar conteúdo com um assistente de IA, usando a Café Serra, uma marca fictícia.",
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
      resumo: "Uma hora para transformar a IA em parceira de criação no seu dia a dia de marketing.",
      blocos: [
        {
          tipo: "destaque",
          icone: "☕",
          titulo: "O objetivo de hoje",
          slide: {
            tipo: "frase",
            texto: "Usar a IA como uma **colega de criação**.",
            apoio: "Rascunhos em segundos, ideias novas e cada texto no formato certo, do jeito da sua marca."
          },
          nota: "Combine as expectativas: tudo aqui é simulado, com a marca fictícia Café Serra. No fim de cada módulo ela pratica no Claude de verdade.",
          texto: "Sair daqui usando um assistente de IA como uma **colega de criação**: alguém que escreve rascunhos em segundos, sugere ideias, adapta textos para cada formato e segue o jeito da sua marca.\n\nTudo o que você vai ver aqui é uma **simulação**, com uma marca fictícia, a **Café Serra**. No fim de cada módulo, você pratica no Claude de verdade."
        },
        {
          tipo: "cards",
          titulo: "Você vai sair sabendo…",
          nota: "Pergunte qual destes itens ela mais quer dominar e dê ênfase a ele ao longo da hora.",
          itens: [
            { icone: "✍️", titulo: "Pedir bem", texto: "Escrever pedidos (os famosos *prompts*) que geram bons textos logo de primeira." },
            { icone: "🔁", titulo: "Ajustar sem recomeçar", texto: "Iterar: \"deixa mais curto\", \"muda o tom\", \"faz três versões\"." },
            { icone: "📁", titulo: "Guardar a marca num Projeto", texto: "Deixar tom de voz, público e arquivos salvos para não repetir tudo a cada conversa." },
            { icone: "🧩", titulo: "Criar uma Skill", texto: "Ensinar um procedimento (como montar um carrossel) que a IA aplica sozinha." },
            { icone: "♻️", titulo: "Reaproveitar conteúdo", texto: "Transformar um artigo em carrossel, legendas e newsletter de uma vez." },
            { icone: "🛡️", titulo: "Usar com segurança", texto: "Saber o que conferir antes de publicar e o que não enviar para a IA." }
          ]
        },
        {
          tipo: "visao-geral",
          titulo: "Roteiro do treinamento",
          nota: "Cerca de 8 minutos por módulo. Os módulos 3, 5 e 6 são os mais práticos."
        },
        {
          tipo: "destaque",
          icone: "🧭",
          cor: "verde",
          titulo: "Como usar este material",
          slide: false,
          texto: "- Nesta página de **estudo**, as conversas aparecem completas, com as notas do instrutor visíveis. Clique em **Ver animação** para assistir a qualquer conversa acontecendo.\n- Os resultados (carrosséis, legendas, e-mails) aparecem logo abaixo das respostas, com botão para copiar.\n- Use as **setas ← →** do teclado para trocar de módulo e marque **Concluí este módulo** ao terminar. O material lembra onde você parou."
        }
      ]
    },

    /* ============================ MÓDULO 2 ============================ */
    {
      id: "conhecendo-o-ambiente",
      titulo: "Conhecendo o ambiente",
      resumoCurto: "Tour pela interface",
      resumo: "Um passeio rápido pela tela de um assistente de IA: onde escrever, anexar, encontrar conversas e organizar projetos.",
      blocos: [
        {
          tipo: "texto",
          titulo: "O que é o Claude?",
          slide: {
            tipo: "cards",
            texto: "Um assistente de IA com quem você conversa em linguagem natural, como numa troca de mensagens.",
            passoAPasso: true,
            itens: [
              { icone: "💬", titulo: "Conversa", texto: "Sem comando secreto: você explica, ele responde." },
              { icone: "✍️", titulo: "Escreve", texto: "Posts, e-mails, roteiros e revisões." },
              { icone: "📎", titulo: "Analisa arquivos", texto: "PDFs, planilhas e imagens que você envia." },
              { icone: "🌐", titulo: "Pesquisa", texto: "Informações atualizadas na internet." }
            ]
          },
          nota: "Reforce: não existe jeito certo de falar com a IA. É uma conversa.",
          texto: "O Claude é um **assistente de IA** com quem você conversa em linguagem natural, como numa troca de mensagens. Ele **escreve** (posts, e-mails, roteiros), **revisa** textos, **analisa arquivos** que você envia (PDFs, planilhas, imagens) e pode **pesquisar** na internet para trazer informações atualizadas.\n\nNão existe comando secreto: você explica o que precisa, ele responde, e vocês vão ajustando juntos."
        },
        {
          tipo: "tour",
          titulo: "Tour pela interface",
          nota: "Se possível, mostre a mesma tela no Claude real logo depois do tour.",
          texto: "A tela abaixo é uma simulação simplificada. Os nomes e a disposição podem mudar um pouco no aplicativo real, mas os conceitos são os mesmos.",
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
              texto: "É aqui que você escreve o que precisa, como se mandasse uma mensagem para uma colega. Pode (e deve!) ser um texto longo, com detalhes. **Enter** envia; **Shift + Enter** quebra a linha."
            },
            {
              alvo: "anexar",
              titulo: "Envio de arquivos",
              texto: "O clipe permite anexar PDFs, documentos, planilhas e imagens. Por exemplo: o briefing da campanha, o guia da marca ou a foto de um produto para criar a legenda."
            },
            {
              alvo: "historico",
              titulo: "Histórico de conversas",
              texto: "Cada conversa fica salva aqui. Você pode voltar, continuar de onde parou ou renomear. Dica: **uma conversa por assunto** deixa tudo mais organizado."
            },
            {
              alvo: "projetos",
              titulo: "Projetos",
              texto: "Espaços que guardam **instruções e arquivos** de um trabalho, como a marca Café Serra. Toda conversa criada dentro de um projeto já começa sabendo esse contexto. Vamos ver isso no Módulo 4."
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
            { icone: "📊", titulo: "Analisar", texto: "Resumir relatórios, comparar campanhas, ler planilhas." }
          ]
        },
        {
          tipo: "destaque",
          icone: "🤝",
          titulo: "Pense numa colega muito rápida",
          slide: {
            tipo: "frase",
            texto: "Uma colega talentosa e rapidíssima, que ainda **não conhece a sua marca**.",
            apoio: "Quanto melhor o briefing, melhor o resultado. É isso que vamos treinar agora."
          },
          texto: "Imagine uma colega talentosa, que escreve muito rápido, mas acabou de chegar e **não conhece a sua marca**. Quanto melhor o briefing que você der, melhor o resultado. É exatamente isso que vamos treinar no próximo módulo."
        }
      ]
    },

    /* ============================ MÓDULO 3 ============================ */
    {
      id: "pedir-bem",
      titulo: "Pedir bem",
      resumoCurto: "Prompt fraco × prompt bom",
      resumo: "A diferença entre um resultado genérico e um texto pronto para publicar está no pedido.",
      blocos: [
        {
          tipo: "comparativo",
          titulo: "O mesmo pedido, de dois jeitos",
          nota: "Antes de avançar o \"Depois\", pergunte: o que você mudaria no pedido para melhorar o resultado?",
          texto: "Avance as duas conversas e compare as respostas.",
          antes: {
            rotulo: "Antes",
            titulo: "Pedido vago",
            mensagens: [
              {
                autor: "aluna",
                texto: "faz um post sobre nosso café novo",
                nota: "Falta quase tudo: qual café? Para qual rede? Para quem? Com que objetivo? A IA vai preencher as lacunas com suposições genéricas."
              },
              {
                autor: "assistente",
                texto: "Claro! Aqui está uma sugestão de post:\n\n**☕ Novidade fresquinha!**\n\nChegou o nosso novo café, perfeito para todos os momentos do seu dia! Com sabor único e aroma irresistível, ele vai transformar a sua rotina. Venha experimentar e descubra por que nossos clientes amam o nosso café!\n\n#café #novidade #coffee #cafeteria #amocafé #coffeelover #instacoffee #cafédamanhã",
                nota: "Texto genérico, que serviria para qualquer cafeteria do mundo: não fala do produto, não tem a voz da marca, não tem convite claro e exagera nas hashtags."
              }
            ]
          },
          depois: {
            rotulo: "Depois",
            titulo: "Pedido com contexto",
            mensagens: [
              {
                autor: "aluna",
                texto: "Sou responsável pelo marketing da Café Serra, uma cafeteria e torrefação artesanal de Minas Gerais.\n\nPreciso de uma **legenda para o Instagram** anunciando o lançamento do **Café de Inverno**, um blend com notas de chocolate e canela, disponível por tempo limitado.\n\n- **Público:** adultos de 25 a 45 anos que valorizam café especial e produção local.\n- **Objetivo:** levar as pessoas à loja no fim de semana de lançamento.\n- **Tom:** acolhedor e próximo, com um toque mineiro, sem exageros. Frases curtas, sem jargão de barista.\n- **Tamanho:** até 80 palavras.\n- **CTA:** convidar para provar na loja neste sábado.\n- **Hashtags:** no máximo 3.\n\nReferência de tom de que a gente gosta: \"Café passado na hora, pão de queijo saindo do forno. Aqui o tempo anda mais devagar.\"",
                nota: "**Contexto** (quem somos), **tarefa** clara (legenda de Instagram), **público**, **objetivo**, **tom**, **tamanho**, **CTA** e um **exemplo** de referência. Cada item elimina uma suposição da IA."
              },
              {
                autor: "assistente",
                texto: "Aqui vai uma proposta:\n\n**O frio chegou. E trouxe companhia.** ❄️☕\n\nO nosso Café de Inverno está de volta: notas de chocolate, um toque de canela e aquele aconchego de cozinha mineira.\n\nÉ por pouco tempo, então não deixa pra depois. Vem provar com a gente neste sábado, a xícara já está esperando.\n\n#CaféSerra #CaféDeInverno #CaféEspecial\n\nQuer que eu faça também uma versão mais curta para os Stories?",
                nota: "Mesmo assunto, outra qualidade: fala do produto real, conversa com o público certo, respeita o tom e termina com um convite concreto. E a IA ainda sugere um próximo passo."
              }
            ]
          }
        },
        {
          tipo: "cards",
          titulo: "Os 4 princípios de um bom pedido",
          passoAPasso: true,
          itens: [
            { icone: "🧭", titulo: "1. Dê contexto", texto: "Quem é a marca, para quem é o conteúdo e qual o objetivo. A IA não sabe nada que você não contar." },
            { icone: "🎯", titulo: "2. Seja específico", texto: "Formato, tamanho, tom, CTA, número de hashtags. O que não for dito, a IA vai adivinhar." },
            { icone: "🖼️", titulo: "3. Mostre exemplos", texto: "Um post de que vocês gostam vale mais do que três adjetivos sobre o tom." },
            { icone: "🔁", titulo: "4. Itere", texto: "A primeira resposta é um rascunho. Peça ajustes como faria a uma colega." }
          ]
        },
        {
          tipo: "destaque",
          icone: "🧪",
          cor: "verde",
          titulo: "Fórmula de bolso",
          nota: "Peça para ela identificar cada parte da fórmula no prompt do \"Depois\".",
          texto: "**Contexto** + **Tarefa** + **Público** + **Objetivo** + **Tom** + **Formato** + **Exemplo**\n\nNão precisa usar todos sempre. Mas, se a resposta veio genérica, provavelmente faltou algum."
        },
        {
          tipo: "chat",
          tituloBloco: "Iterar: ajuste em vez de recomeçar",
          nota: "Mostre que a conversa continua: nada de abrir uma conversa nova para cada ajuste.",
          titulo: "Continuação da conversa do \"Depois\"",
          contexto: "Mesma conversa: a IA lembra de tudo o que já foi dito.",
          mensagens: [
            {
              autor: "aluna",
              texto: "Gostei! Deixa mais curto, para caber nos Stories.",
              nota: "Não precisa repetir o contexto. Dentro da mesma conversa, a IA lembra de tudo o que foi combinado."
            },
            {
              autor: "assistente",
              texto: "**O frio chegou. E trouxe companhia.** ❄️\n\nCafé de Inverno: chocolate, canela e aconchego mineiro.\nÉ por pouco tempo. Prova com a gente neste sábado? ☕"
            },
            {
              autor: "aluna",
              texto: "Agora troca o tom para algo mais divertido, sem perder o jeitinho mineiro."
            },
            {
              autor: "assistente",
              texto: "**Uai, esfriou? A gente resolve.** 🧣☕\n\nO Café de Inverno chegou: chocolate, canela e um abraço em forma de xícara.\nÉ edição limitada, então corre, que esse trem é bão demais pra ficar esperando. Sábado tem degustação na loja!",
              nota: "Cada ajuste leva segundos. Peça variações, compare e fique com a melhor: **você continua sendo a editora**."
            }
          ]
        },
        {
          tipo: "pratica",
          texto: "Copie o modelo abaixo, troque o que está entre colchetes e envie. Depois, peça **dois ajustes**: um de tamanho e um de tom.",
          prompt: "Sou do marketing da [sua marca]. Crie uma legenda para o Instagram sobre [produto ou novidade].\n- Público: [quem é]\n- Objetivo: [o que a pessoa deve fazer depois de ler]\n- Tom: [ex.: acolhedor, divertido, sofisticado]\n- Tamanho: até [N] palavras\n- CTA: [convite final]\n- Hashtags: no máximo 3\nReferência de tom: \"[cole aqui um post de que você gosta]\""
        }
      ]
    },

    /* ============================ MÓDULO 4 ============================ */
    {
      id: "projetos",
      titulo: "Projetos como base da marca",
      resumoCurto: "Contexto salvo",
      resumo: "Pare de repetir quem é a marca em toda conversa: guarde o contexto num Projeto.",
      blocos: [
        {
          tipo: "texto",
          titulo: "O problema",
          slide: {
            tipo: "frase",
            texto: "Toda conversa nova começa **do zero**.",
            apoio: "O Projeto guarda as instruções e os arquivos de um trabalho. Toda conversa criada dentro dele já começa sabendo o contexto."
          },
          texto: "Toda conversa nova começa do zero. Explicar o tom de voz, o público e os produtos a cada pedido cansa e gera resultados inconsistentes.\n\nO **Projeto** resolve isso: é um espaço que guarda as **instruções** e os **arquivos** de um trabalho. Toda conversa criada dentro dele já começa sabendo o contexto."
        },
        {
          tipo: "projeto",
          titulo: "Por dentro de um Projeto",
          nota: "Destaque que as instruções são texto comum, escrito como um briefing para uma pessoa nova na equipe.",
          nome: "Café Serra – Conteúdo",
          descricao: "Redes sociais, e-mail e blog da Café Serra.",
          instrucoes: "Você é redator(a) da Café Serra, cafeteria e torrefação artesanal mineira.\n\n- **Público:** adultos de 25 a 45 anos que valorizam café especial e produção local.\n- **Tom de voz:** acolhedor, próximo, com toques de mineiridade, sem exageros.\n- Frases curtas. Evite jargão técnico de barista.\n- **Produtos:** Café de Inverno, Coado da Casa, Kit Presente.\n- Termine sempre com um convite claro (CTA).\n- Consulte os arquivos do projeto antes de responder.",
          arquivos: [
            { nome: "guia-de-tom-de-voz.pdf", tamanho: "1,2 MB" },
            { nome: "catalogo-de-produtos.pdf", tamanho: "3,4 MB" },
            { nome: "persona-cliente.pdf", tamanho: "640 KB" },
            { nome: "posts-que-funcionaram.docx", tamanho: "240 KB" },
            { nome: "calendario-editorial.xlsx", tamanho: "88 KB" }
          ]
        },
        {
          tipo: "chat",
          tituloBloco: "Conversando dentro do Projeto",
          nota: "Compare com o prompt longo do Módulo 3: aqui o pedido é curto porque o contexto já está no Projeto.",
          titulo: "Nova conversa",
          contexto: "📁 Dentro do Projeto: Café Serra – Conteúdo",
          mensagens: [
            {
              autor: "aluna",
              texto: "Preciso de 3 ideias de post para o Dia das Mães com o Kit Presente.",
              nota: "Repare: um pedido curto. Nada de explicar quem é a marca, o público ou o tom, porque isso já está no Projeto."
            },
            {
              autor: "assistente",
              texto: "Que data boa pra gente! Aqui vão três ideias com o Kit Presente:\n\n1. **\"Café com mãe é outro café\"**: carrossel com fotos de clientes e suas mães na loja. No último slide, o Kit Presente embrulhado, pronto pra levar.\n2. **Bilhete na caixa**: vídeo curto mostrando a equipe escrevendo à mão o bilhete que acompanha cada kit. Legenda: \"Porque carinho mineiro vem com recado.\"\n3. **\"O primeiro café do dia era dela\"**: post de memória afetiva, convidando o público a contar nos comentários quem passava o café em casa.\n\nCTA sugerido: *\"Encomende o Kit Presente até quinta e retire na loja.\"*\n\nQuer que eu desenvolva alguma delas?",
              nota: "A resposta já segue o tom acolhedor e mineiro, cita o produto certo e termina com CTA. As instruções do Projeto foram aplicadas automaticamente."
            },
            {
              autor: "aluna",
              texto: "Desenvolve a 3 como legenda."
            },
            {
              autor: "assistente",
              texto: "Fechado! A legenda está no painel ao lado. Sugeri também uma imagem para acompanhar.",
              nota: "Algumas respostas viram **artefatos**: conteúdos prontos que abrem num painel separado, fáceis de revisar e copiar.",
              artefatos: [
                {
                  tipo: "post",
                  titulo: "Legenda: Dia das Mães",
                  posts: [
                    {
                      texto: "O primeiro café do dia era dela.\n\nO cheirinho subindo da cozinha, a garrafa térmica na mesa, o \"senta aí que já tá pronto\".\n\nNeste Dia das Mães, conta pra gente: quem passava o café na sua casa? ☕💛\n\nE, se quiser retribuir esse carinho, o Kit Presente está te esperando. Encomende até quinta e retire na loja.",
                      hashtags: ["#CaféSerra", "#DiaDasMães", "#KitPresente"],
                      imagem: "mãos passando café no coador de pano, numa cozinha com luz da manhã"
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
            { icone: "📎", titulo: "Arquivos de conhecimento", texto: "Guia de marca, catálogo, persona, posts de referência, calendário editorial." },
            { icone: "🗂️", titulo: "Um Projeto por trabalho", texto: "Uma marca, um cliente ou uma campanha longa. Conversas de assuntos diferentes ficam em projetos diferentes." }
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
            apoio: "Quem somos, para quem falamos e como falamos."
          },
          texto: "**Projeto guarda o *contexto* de um trabalho:** quem somos, para quem falamos e como falamos."
        },
        {
          tipo: "pratica",
          texto: "Use este pedido para a IA entrevistar você e escrever as instruções. Depois, crie um Projeto, cole as instruções e anexe 2 ou 3 arquivos de referência.",
          prompt: "Me ajude a escrever as instruções de um Projeto para a marca [nome da sua marca]. Faça perguntas, uma de cada vez, sobre público, tom de voz, produtos e regras, até ter informação suficiente. No final, entregue as instruções prontas para colar."
        }
      ]
    },

    /* ============================ MÓDULO 5 ============================ */
    {
      id: "skills",
      titulo: "Skills",
      resumoCurto: "Procedimentos automáticos",
      resumo: "Ensine a IA a fazer uma tarefa do seu jeito, uma vez só, e ela aplica sozinha sempre que a tarefa aparecer.",
      blocos: [
        {
          tipo: "texto",
          titulo: "O que é uma Skill?",
          slide: {
            tipo: "frase",
            texto: "Se o Projeto guarda o **contexto**, a Skill guarda um **procedimento**.",
            apoio: "Ela é carregada automaticamente quando a tarefa aparece e funciona em qualquer conversa."
          },
          texto: "Se o Projeto guarda o **contexto**, a **Skill** guarda um **procedimento**: um pacote de instruções que ensina a IA a fazer uma tarefa específica do jeito certo, sempre igual.\n\nA Skill é **carregada automaticamente** quando a tarefa aparece na conversa e funciona **em qualquer conversa**, dentro ou fora de um Projeto."
        },
        {
          tipo: "tabela",
          titulo: "Projeto × Skill",
          passoAPasso: true,
          nota: "A analogia final costuma fixar o conceito: a pasta do cliente × a receita da casa.",
          colunas: ["", "Projeto", "Skill"],
          linhas: [
            ["O que guarda", "**Contexto**: quem é a marca, tom, arquivos", "**Procedimento**: o passo a passo de uma tarefa"],
            ["Quando atua", "Em toda conversa dentro do Projeto", "Automaticamente, quando a tarefa aparece"],
            ["Onde funciona", "Só dentro daquele Projeto", "Em qualquer conversa"],
            ["Exemplo", "Café Serra – Conteúdo", "carrossel-cafe-serra"],
            ["Analogia", "A pasta do cliente", "A receita da casa"]
          ]
        },
        {
          tipo: "skill",
          titulo: "Como uma Skill se parece",
          passoAPasso: true,
          nota: "Leia as instruções em voz alta: são as regras que ela já explica toda semana.",
          texto: "Uma Skill é, no fundo, um arquivo de texto com nome, descrição e instruções. A **descrição** é o que faz a IA lembrar de usá-la na hora certa.",
          nome: "carrossel-cafe-serra",
          descricao: "Use ao criar carrosséis de Instagram para a Café Serra.",
          instrucoes: [
            "6 a 8 slides.",
            "Slide 1: gancho em até 8 palavras.",
            "Slides intermediários: uma ideia por slide, até 25 palavras.",
            "Último slide: CTA convidando a visitar a loja ou o site.",
            "Seguir o tom de voz da marca.",
            "Entregar também sugestão de legenda com até 3 hashtags."
          ]
        },
        {
          tipo: "chat",
          tituloBloco: "Criando a Skill com a ajuda da IA",
          nota: "Ponto-chave: ela não precisa saber o formato técnico. A IA entrevista e monta.",
          titulo: "Conversa: criar uma skill",
          mensagens: [
            {
              autor: "aluna",
              texto: "Toda semana eu faço carrosséis para o Instagram da Café Serra e sempre explico as mesmas regras. Me ajuda a criar uma skill pra isso?",
              nota: "Você não precisa saber o formato técnico. Descreva a tarefa repetitiva e deixe a IA conduzir."
            },
            {
              autor: "assistente",
              texto: "Ótima candidata a skill: é repetitiva e tem regras claras. Antes de montar, me conta:\n\n1. Quantos slides costumam ter?\n2. Como deve ser o primeiro slide?\n3. Tem limite de texto por slide?\n4. Como o carrossel termina? Tem algum convite padrão?\n5. Precisa entregar a legenda junto?",
              nota: "A IA entrevista você para descobrir o procedimento. Responda como explicaria para uma pessoa nova na equipe."
            },
            {
              autor: "aluna",
              texto: "Entre 6 e 8 slides. O primeiro é um gancho curtinho, até 8 palavras. Nos do meio, uma ideia por slide, no máximo 25 palavras. O último sempre chama pra visitar a loja ou o site. E sim, quero a legenda com até 3 hashtags. Tudo no tom da marca."
            },
            {
              autor: "assistente",
              texto: "Perfeito! Montei a skill:\n\n**Nome:** carrossel-cafe-serra\n**Descrição:** Use ao criar carrosséis de Instagram para a Café Serra.\n\n**Instruções:**\n- 6 a 8 slides.\n- Slide 1: gancho em até 8 palavras.\n- Slides intermediários: uma ideia por slide, até 25 palavras.\n- Último slide: CTA convidando a visitar a loja ou o site.\n- Seguir o tom de voz da marca.\n- Entregar também sugestão de legenda com até 3 hashtags.\n\nÉ só salvar nas suas Skills. A partir de agora, quando você pedir um carrossel da Café Serra, eu sigo essas regras automaticamente.",
              nota: "Repare na **descrição**: ela diz *quando* a skill deve ser usada. É isso que permite que ela seja carregada sozinha depois."
            }
          ]
        },
        {
          tipo: "chat",
          tituloBloco: "Dias depois, numa conversa nova…",
          nota: "Peça para ela conferir as regras da Skill no carrossel: 7 slides, gancho curto, CTA no final, 3 hashtags.",
          titulo: "Nova conversa",
          contexto: "💬 Conversa nova, fora do Projeto",
          mensagens: [
            {
              autor: "aluna",
              texto: "Faz um carrossel sobre o café de inverno.",
              nota: "Pedido curtíssimo, numa conversa nova. Observe o selo que aparece na resposta."
            },
            {
              autor: "assistente",
              skill: "carrossel-cafe-serra",
              texto: "Usei a skill **carrossel-cafe-serra**. Ficaram 7 slides: gancho curto, uma ideia por slide e convite no final. A legenda sugerida está logo abaixo do carrossel, no painel.",
              nota: "O selo mostra que a skill foi carregada **sozinha**. O resultado segue todas as regras: 7 slides, gancho de 4 palavras, uma ideia por slide, CTA no final e legenda com 3 hashtags.",
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
          titulo: "Outras ideias de Skills para o marketing",
          itens: [
            { icone: "🗣️", titulo: "Revisão de tom de voz", texto: "Confere se um texto segue o guia da marca e sugere ajustes, apontando cada trecho." },
            { icone: "🎨", titulo: "Briefing para designer", texto: "Transforma uma ideia de post em briefing: formato, textos, referências visuais e prazo." },
            { icone: "🎬", titulo: "Roteiro de Reels", texto: "Gancho nos 3 primeiros segundos, cenas, falas, texto na tela e legenda, sempre no mesmo formato." }
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
            apoio: "Está na hora de virar uma Skill."
          },
          texto: "Explicou as mesmas instruções **três vezes**? Está na hora de virar uma Skill."
        },
        {
          tipo: "pratica",
          texto: "Pense numa tarefa que você faz toda semana. Use o pedido abaixo e responda às perguntas da IA.",
          prompt: "Me ajude a criar uma skill para [tarefa repetitiva, ex.: escrever roteiros de Reels]. Faça perguntas sobre o passo a passo, as regras e o formato de entrega antes de montar a skill."
        }
      ]
    },

    /* ============================ MÓDULO 6 ============================ */
    {
      id: "reaproveitamento",
      titulo: "Reaproveitamento de conteúdo",
      resumoCurto: "Um conteúdo, vários formatos",
      resumo: "Um bom texto rende muitos: transforme um artigo do blog em carrossel, legendas e newsletter.",
      blocos: [
        {
          tipo: "texto",
          slide: {
            tipo: "frase",
            icone: "♻️",
            texto: "Um bom texto rende **muitos**.",
            apoio: "Artigos, apresentações e roteiros antigos viram várias peças, cada uma no formato certo."
          },
          texto: "Você já tem conteúdo bom espalhado por aí: artigos do blog, apresentações, roteiros antigos. Com a IA, um único material vira várias peças, **cada uma no formato certo**, em minutos."
        },
        {
          tipo: "chat",
          tituloBloco: "Um artigo, três formatos",
          nota: "Quando os resultados aparecerem, navegue pelas abas: carrossel, legendas e e-mail.",
          titulo: "Nova conversa",
          contexto: "📁 Dentro do Projeto: Café Serra – Conteúdo",
          mensagens: [
            {
              autor: "aluna",
              texto: "Segue o artigo do blog desta semana. A partir dele, cria: um carrossel para o Instagram, três legendas curtas para os posts da semana e um e-mail para a nossa newsletter.",
              anexo: {
                nome: "blog-do-grao-a-xicara.docx",
                conteudo: "### Do grão à xícara: como nasce o Café de Inverno\n\nTodo ano, quando o frio chega na Serra da Mantiqueira, a gente começa a preparar o Café de Inverno. Os grãos vêm de três pequenos produtores parceiros, a menos de 80 km da nossa torrefação.\n\nA colheita é feita à mão, e os grãos secam devagar, ao sol, em terreiros suspensos. Depois, descansam por 30 dias antes da torra.\n\nNa torrefação, usamos uma torra média, que realça as notas de chocolate. A canela aparece no aroma, sem nenhum aditivo: é característica do próprio grão.\n\nO resultado é um café encorpado e doce, que pede uma mesa farta e uma conversa sem pressa. São só 600 pacotes por safra."
              },
              nota: "Anexar o material de origem dá à IA **fatos reais** para trabalhar e reduz as chances de ela inventar informações."
            },
            {
              autor: "assistente",
              texto: "Pronto! A partir do artigo, preparei três materiais:\n\n1. **Carrossel** com 7 slides contando a jornada do grão à xícara.\n2. **Três legendas** para os posts da semana, cada uma com um ângulo diferente.\n3. **E-mail da newsletter** com assunto, pré-cabeçalho e convite para a loja.\n\nTodos usam os dados do artigo (3 produtores, secagem ao sol, 600 pacotes). Vale conferir os números antes de publicar.",
              nota: "Repare no aviso final: **confira dados e números antes de publicar**. Vamos falar disso no Módulo 7.",
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
                      imagem: "xícara fumegante sobre mesa de madeira, com a janela embaçada ao fundo"
                    },
                    {
                      texto: "Conheça quem planta o seu café: três famílias da Mantiqueira, a menos de 80 km daqui. Café bom é café de vizinho. 💛",
                      hashtags: ["#CaféSerra", "#ProduçãoLocal"],
                      imagem: "produtor sorrindo no meio do cafezal, com a serra ao fundo"
                    },
                    {
                      texto: "Chocolate e canela, sem nenhum aditivo. É o grão que é assim mesmo, uai. Só 600 pacotes nesta safra!",
                      hashtags: ["#CaféSerra", "#CaféEspecial", "#CaféDeInverno"],
                      imagem: "pacote do Café de Inverno ao lado de grãos torrados e um pau de canela"
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
              texto: "Ficou ótimo! Só deixa o e-mail um pouco mais curto e troca o assunto por algo mais curioso.",
              nota: "Dá para pedir tudo de uma vez e depois **ajustar cada peça separadamente**."
            },
            {
              autor: "assistente",
              texto: "Claro! Sugestões de assunto mais curiosos:\n\n- **\"Por que esse café tem gosto de canela?\"**\n- \"600 pacotes. Nem um a mais.\"\n- \"O segredo está no terreiro (e no tempo)\"\n\nE encurtei o corpo do e-mail para três parágrafos, mantendo os dados principais e o convite. Quer que eu atualize o artefato com a primeira opção?"
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
          texto: "Escolha um texto que vocês já publicaram e cole no lugar indicado.",
          prompt: "Vou colar abaixo um texto que já publicamos. A partir dele, crie:\n1. um carrossel de 6 slides para o Instagram;\n2. três legendas curtas para os posts da semana;\n3. um e-mail de newsletter com assunto e pré-cabeçalho.\nUse apenas as informações do texto.\n\n[cole aqui o texto]"
        }
      ]
    },

    /* ============================ MÓDULO 7 ============================ */
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
          nota: "Pergunte qual é a política da empresa dela para dados de clientes.",
          itens: [
            { icone: "🔎", titulo: "Confira dados e números", texto: "A IA pode errar ou inventar informações com toda a confiança. Estatísticas, datas, preços e nomes: **sempre confira na fonte**." },
            { icone: "✅", titulo: "Revise como editora", texto: "O texto final é seu. A voz da marca é sua responsabilidade: leia em voz alta, ajuste e corte o que não soa como vocês." },
            { icone: "©️", titulo: "Respeite direitos de terceiros", texto: "Não peça para reproduzir letras de música, personagens, trechos de livros ou materiais de outras marcas." },
            { icone: "🔒", titulo: "Cuidado com dados de clientes", texto: "Antes de enviar listas, e-mails ou informações de clientes, **verifique a política da empresa**. Na dúvida, anonimize." }
          ]
        },
        {
          tipo: "pratica",
          titulo: "Agora tente no Claude: peça uma checagem",
          texto: "Um bom hábito é pedir para a própria IA apontar o que precisa ser conferido.",
          prompt: "Revise o texto abaixo antes da publicação. Liste todas as informações que eu deveria confirmar em uma fonte (números, datas, nomes, afirmações) e aponte qualquer trecho que fuja do tom de voz da marca.\n\n[cole aqui o texto]"
        },
        {
          tipo: "destaque",
          icone: "🏆",
          cor: "verde",
          titulo: "Desafio da semana",
          nota: "Combine uma data para ela mostrar a primeira Skill criada.",
          texto: "- **Todo dia:** use o Claude em uma tarefa real do seu trabalho (uma legenda, uma revisão, um brainstorm).\n- **Até sexta:** escolha uma tarefa repetitiva e transforme em uma Skill.\n- **Bônus:** crie o Projeto da sua marca com o guia de tom de voz e 2 ou 3 posts de referência."
        },
        {
          tipo: "links",
          titulo: "Para continuar aprendendo",
          itens: [
            { rotulo: "Claude", url: "https://claude.ai", descricao: "Onde você vai praticar todos os dias." },
            { rotulo: "Central de ajuda", url: "https://support.claude.com", descricao: "Tutoriais e respostas sobre recursos como Projetos e Skills." },
            { rotulo: "Guia de engenharia de prompt (em inglês)", url: "https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview", descricao: "Técnicas mais avançadas para pedir bem." }
          ]
        },
        {
          tipo: "destaque",
          icone: "☕",
          titulo: "Obrigado!",
          slide: {
            tipo: "frase",
            texto: "Obrigado!",
            apoio: "Este material continua disponível para consulta, com todas as conversas, notas e prompts de prática."
          },
          texto: "Este material continua disponível para consulta. Volte quando quiser à página de **estudo** para rever as conversas com as notas e copie os prompts de prática sempre que precisar."
        }
      ]
    }
  ]
};
