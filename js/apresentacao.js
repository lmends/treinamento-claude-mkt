/* ==========================================================================
   Ambiente de Treinamento — apresentação em slides
   Gera o deck a partir dos módulos de js/content.js: uma capa, um slide de
   abertura por módulo e um slide por bloco. Apenas lógica; nenhum texto aqui.
   ========================================================================== */
(function () {
  'use strict';

  var T = window.Treino;
  var palco = document.getElementById('palco');
  if (!T || !T.MODULOS.length) {
    palco.innerHTML = '<p class="aviso">' + (T ? T.t('erroConteudo') : 'Erro: js/content.js') + '</p>';
    return;
  }

  var t = T.t, el = T.el, $ = T.$, icone = T.icone, md = T.md;
  var MODULOS = T.MODULOS;
  var APRES = T.C.apresentacao || {};
  var DURACAO_TRANSICAO = 560;
  var OCIOSO_MS = 2600;
  var empilhado = window.matchMedia('(max-width: 760px)');

  /* ---------- Montagem do deck ---------- */

  function tituloDoBloco(b) {
    if (b.tituloBloco) return b.tituloBloco;
    if (b.titulo) return b.titulo;
    if (b.tipo === 'frase' || b.tipo === 'texto') return T.textoPuro(b.texto).split('\n')[0];
    if (b.tipo === 'pratica') return t('agoraTente');
    return t(b.tipo);
  }

  var SLIDES = [];
  SLIDES.push({ tipo: 'capa', modulo: -1, id: 'inicio', titulo: APRES.titulo || t('nomeSite') });
  MODULOS.forEach(function (mod, mi) {
    SLIDES.push({ tipo: 'abertura', modulo: mi, id: mod.id, titulo: mod.titulo });
    T.blocosDoModulo(mod, 'deck').forEach(function (b, bi) {
      SLIDES.push({ tipo: b.tipo, modulo: mi, id: mod.id + '/' + (bi + 1), titulo: tituloDoBloco(b), bloco: b });
    });
  });
  SLIDES.forEach(function (s, i) { s.indice = i; });

  function indiceDoId(id) {
    for (var i = 0; i < SLIDES.length; i++) if (SLIDES[i].id === id) return i;
    return -1;
  }
  function primeiroDoModulo(mi) {
    for (var i = 0; i < SLIDES.length; i++) if (SLIDES[i].modulo === mi) return i;
    return 0;
  }
  function slidesDoModulo(mi) { return SLIDES.filter(function (s) { return s.modulo === mi; }); }

  /* ---------- Utilitários de slide ---------- */

  // Entrada escalonada: o elemento sobe e aparece com atraso proporcional a "i"
  function st(e, i) {
    if (!e) return e;
    e.classList.add('st');
    e.style.setProperty('--i', String(i || 0));
    return e;
  }

  // Revelação passo a passo
  function fragmentos(lista) {
    var n = 0;
    lista.forEach(function (f) { f.classList.add('frag'); });
    return {
      avancar: function () {
        if (n >= lista.length) return false;
        lista[n].classList.add('is-visivel');
        n += 1;
        return true;
      },
      concluido: function () { return n >= lista.length; },
      completar: function () { lista.forEach(function (f) { f.classList.add('is-visivel'); }); n = lista.length; }
    };
  }

  function controlador(base) {
    return {
      avancar: base.avancar || function () { return false; },
      concluido: base.concluido || function () { return true; },
      completar: base.completar || function () {},
      notas: base.notas || function () { return []; },
      destruir: base.destruir || function () {}
    };
  }

  function notaDoBloco(b) { return b && b.nota ? [{ titulo: t('notaInstrutor'), texto: b.nota }] : []; }

  function trilhaModulo(mi) {
    return t('moduloN', { n: mi + 1 }) + ' · ' + MODULOS[mi].titulo;
  }

  // Cabeçalho padrão: rótulo do módulo, título e introdução opcional
  function cabecalho(desc, titulo, intro) {
    var cab = el('header', { class: 'slide-cab' });
    if (desc.modulo >= 0) cab.appendChild(st(el('p', { class: 'slide-kicker', text: trilhaModulo(desc.modulo) }), 0));
    if (titulo) cab.appendChild(st(el('h2', { class: 'slide-titulo', text: titulo }), 1));
    if (intro) cab.appendChild(st(md(intro, 'slide-intro'), 2));
    return cab;
  }

  /* ---------- Construtores por tipo ---------- */

  var CONSTRUTORES = {

    capa: function (desc, ctx) {
      ctx.classe('slide-capa');
      ctx.inner.appendChild(el('div', { class: 'capa' }, [
        st(el('div', { class: 'capa-marca' }, [T.marcaSite(72)]), 0),
        st(el('p', { class: 'capa-kicker', text: APRES.kicker || t('nomeSite') }), 1),
        st(el('h1', { class: 'capa-titulo', text: APRES.titulo || '' }), 2),
        APRES.subtitulo ? st(el('p', { class: 'capa-sub', text: APRES.subtitulo }), 3) : null,
        st(el('p', { class: 'capa-dica so-teclado', html: T.comTeclas(t('dicaComecar')) }), 4),
        st(el('p', { class: 'capa-dica so-toque', text: t('dicaComecarToque') }), 4),
        APRES.rodape ? st(el('p', { class: 'capa-rodape', text: APRES.rodape }), 5) : null
      ]));
      return controlador({});
    },

    abertura: function (desc, ctx) {
      var mod = MODULOS[desc.modulo];
      var n = desc.modulo + 1;
      ctx.classe('slide-abertura');
      var blocos = T.blocosDoModulo(mod, 'deck');
      var LIMITE_ETAPAS = 6;
      var visiveis = blocos.length > LIMITE_ETAPAS + 1 ? blocos.slice(0, LIMITE_ETAPAS) : blocos;
      var etapas = el('ol', { class: 'abertura-etapas' }, visiveis.map(function (b, i) {
        return st(el('li', { text: tituloDoBloco(b) }), 5 + i * 0.6);
      }));
      if (visiveis.length < blocos.length) {
        etapas.appendChild(st(el('li', { class: 'is-mais', text: t('maisN', { n: blocos.length - visiveis.length }) }), 5 + visiveis.length * 0.6));
      }
      var trilho = el('div', { class: 'abertura-trilho', 'aria-hidden': 'true' }, MODULOS.map(function (_, i) {
        return el('span', { class: i < desc.modulo ? 'is-feito' : i === desc.modulo ? 'is-atual' : '' });
      }));
      ctx.inner.appendChild(el('div', { class: 'abertura' + (mod.imagem ? ' com-imagem' : '') }, [
        st(el('span', { class: 'abertura-num', 'aria-hidden': 'true', text: (n < 10 ? '0' : '') + n }), 0),
        el('div', { class: 'abertura-texto' }, [
          st(el('p', { class: 'slide-kicker', text: t('moduloDeTotal', { n: n, total: MODULOS.length }) }), 1),
          st(el('h1', { class: 'abertura-titulo', text: mod.titulo }), 2),
          mod.resumo ? st(el('p', { class: 'abertura-resumo', text: mod.resumo }), 3) : null,
          st(trilho, 4),
          etapas
        ]),
        mod.imagem ? st(el('figure', { class: 'abertura-imagem' }, [T.imagem(mod.imagem, mod.imagemAlt || '')]), 3) : null
      ]));
      return controlador({});
    },

    frase: function (desc, ctx) {
      var b = desc.bloco;
      ctx.classe('slide-frase' + (b.cor === 'verde' ? ' is-verde' : ''));
      ctx.inner.appendChild(el('div', { class: 'frase' }, [
        desc.modulo >= 0 ? st(el('p', { class: 'slide-kicker', text: trilhaModulo(desc.modulo) }), 0) : null,
        b.icone ? st(el('span', { class: 'frase-icone', 'aria-hidden': 'true', text: b.icone }), 1) : null,
        st(el('h2', { class: 'frase-texto', html: T.inline(b.texto || '') }), 2),
        b.apoio ? st(el('p', { class: 'frase-apoio', html: T.inline(b.apoio) }), 3) : null
      ]));
      return controlador({ notas: function () { return notaDoBloco(b); } });
    },

    texto: function (desc, ctx) {
      var b = desc.bloco;
      ctx.inner.appendChild(cabecalho(desc, b.titulo));
      ctx.inner.appendChild(st(md(b.texto, 'slide-paragrafo'), 2));
      return controlador({ notas: function () { return notaDoBloco(b); } });
    },

    destaque: function (desc, ctx) {
      var b = desc.bloco;
      ctx.classe('slide-destaque');
      ctx.inner.appendChild(cabecalho(desc, null));
      ctx.inner.appendChild(st(T.renderDestaque(b, 'h2'), 1));
      return controlador({ notas: function () { return notaDoBloco(b); } });
    },

    cards: function (desc, ctx) {
      var b = desc.bloco;
      ctx.inner.appendChild(cabecalho(desc, b.titulo, b.texto));
      var grade = T.renderCards(b.itens);
      ctx.inner.appendChild(grade);
      var cards = Array.prototype.slice.call(grade.children);
      var f = null;
      if (b.passoAPasso) f = fragmentos(cards);
      else cards.forEach(function (c, i) { st(c, 2 + i * 0.7); });
      return controlador({
        avancar: f && f.avancar, concluido: f && f.concluido, completar: f && f.completar,
        notas: function () { return notaDoBloco(b); }
      });
    },

    'visao-geral': function (desc, ctx) {
      var b = desc.bloco;
      ctx.inner.appendChild(cabecalho(desc, b.titulo, b.texto));
      var agenda = T.renderAgenda({
        href: function (mod) { return '#' + mod.id; },
        aoClicar: function (i, e) { e.preventDefault(); irPara(primeiroDoModulo(i)); }
      });
      agenda.classList.add('agenda');
      Array.prototype.forEach.call(agenda.children, function (li, i) { st(li, 2 + i * 0.5); });
      ctx.inner.appendChild(agenda);
      return controlador({ notas: function () { return notaDoBloco(b); } });
    },

    tabela: function (desc, ctx) {
      var b = desc.bloco;
      ctx.inner.appendChild(cabecalho(desc, b.titulo, b.texto));
      var tabela = st(T.renderTabela(b), 2);
      ctx.inner.appendChild(tabela);
      var f = b.passoAPasso ? fragmentos(Array.prototype.slice.call(tabela.querySelectorAll('tbody tr'))) : null;
      return controlador({
        avancar: f && f.avancar, concluido: f && f.concluido, completar: f && f.completar,
        notas: function () { return notaDoBloco(b); }
      });
    },

    skill: function (desc, ctx) {
      var b = desc.bloco;
      ctx.inner.appendChild(cabecalho(desc, b.titulo, b.texto));
      var arquivo = st(T.renderSkill(b), 3);
      ctx.inner.appendChild(arquivo);
      var f = b.passoAPasso ? fragmentos(Array.prototype.slice.call(arquivo.querySelectorAll('.skill-steps li'))) : null;
      return controlador({
        avancar: f && f.avancar, concluido: f && f.concluido, completar: f && f.completar,
        notas: function () { return notaDoBloco(b); }
      });
    },

    projeto: function (desc, ctx) {
      var b = desc.bloco;
      ctx.inner.appendChild(cabecalho(desc, b.titulo, b.texto));
      var projeto = st(T.renderProjeto(b), 2);
      st(projeto.querySelector('.project-instr'), 3);
      Array.prototype.forEach.call(projeto.querySelectorAll('.file-item'), function (f, i) { st(f, 4 + i * 0.6); });
      ctx.inner.appendChild(projeto);
      return controlador({ notas: function () { return notaDoBloco(b); } });
    },

    pratica: function (desc, ctx) {
      var b = desc.bloco;
      ctx.classe('slide-pratica');
      ctx.inner.appendChild(cabecalho(desc, null));
      ctx.inner.appendChild(st(T.renderPratica(b, 'h2'), 1));
      return controlador({ notas: function () { return notaDoBloco(b); } });
    },

    links: function (desc, ctx) {
      var b = desc.bloco;
      ctx.inner.appendChild(cabecalho(desc, b.titulo, b.texto));
      var lista = T.renderLinks(b.itens);
      Array.prototype.forEach.call(lista.children, function (li, i) { st(li, 2 + i * 0.7); });
      ctx.inner.appendChild(lista);
      return controlador({ notas: function () { return notaDoBloco(b); } });
    },

    imagem: function (desc, ctx) {
      var b = desc.bloco;
      var figura = T.renderImagem(b);
      if (b.texto) {
        ctx.classe('slide-imagem com-texto');
        ctx.inner.appendChild(el('div', { class: 'imagem-lado' }, [
          el('div', { class: 'imagem-texto' }, [cabecalho(desc, b.titulo), st(md(b.texto, 'slide-paragrafo'), 2)]),
          st(figura, 3)
        ]));
      } else {
        ctx.classe('slide-imagem');
        ctx.inner.appendChild(cabecalho(desc, b.titulo));
        ctx.inner.appendChild(st(figura, 2));
      }
      return controlador({ notas: function () { return notaDoBloco(b); } });
    },

    'proxima-palavra': function (desc, ctx) {
      var b = desc.bloco;
      ctx.classe('slide-pp');
      ctx.inner.appendChild(cabecalho(desc, b.titulo, b.texto));
      var pp = T.criarProximaPalavra(b, {});
      ctx.inner.appendChild(st(pp.elemento, 2));
      return controlador({ avancar: pp.avancar, concluido: pp.concluido, completar: pp.completar, notas: function () { return notaDoBloco(b); } });
    },

    visao: function (desc, ctx) {
      var b = desc.bloco;
      ctx.classe('slide-visao');
      ctx.inner.appendChild(cabecalho(desc, b.titulo, b.texto));
      var v = T.criarVisao(b, {});
      st(v.elemento, 2);
      ctx.inner.appendChild(v.elemento);
      return controlador({ avancar: v.avancar, concluido: v.concluido, completar: v.completar, notas: function () { return notaDoBloco(b); } });
    },

    'antes-depois': function (desc, ctx) {
      var b = desc.bloco;
      ctx.classe('slide-ad');
      ctx.inner.appendChild(cabecalho(desc, b.titulo, b.texto));
      var ad = T.renderAntesDepois(b);
      st(ad, 2);
      ctx.inner.appendChild(ad);
      var lista = [ad.querySelector('.ad-antes .ad-comentario'), ad.querySelector('.ad-depois'), ad.querySelector('.ad-depois .ad-comentario')].filter(Boolean);
      var f = fragmentos(lista);
      return controlador({ avancar: f.avancar, concluido: f.concluido, completar: f.completar, notas: function () { return notaDoBloco(b); } });
    },

    chat: function (desc, ctx) {
      var b = desc.bloco;
      var temArtefatos = (b.mensagens || []).some(function (m) { return m.artefatos && m.artefatos.length; });
      ctx.classe('slide-conversa is-cheio' + (temArtefatos ? ' com-resultado' : ''));
      ctx.inner.appendChild(cabecalho(desc, b.tituloBloco || b.titulo, b.texto));

      var resultado = null, visualizador = null, artefatosAtuais = null;
      if (temArtefatos) {
        resultado = el('div', { class: 'resultado', 'aria-live': 'polite' }, [
          el('div', { class: 'resultado-vazio' }, [icone('post', 28), el('p', { text: t('resultadoVazio') })])
        ]);
      }

      function mostrarArtefatos(artefatos, indice, m, porClique) {
        if (!resultado) return;
        if (artefatosAtuais !== artefatos) {
          artefatosAtuais = artefatos;
          visualizador = T.criarVisualizadorArtefatos(artefatos, { indice: indice, classe: 'surge' });
          resultado.textContent = '';
          resultado.appendChild(visualizador.elemento);
          resultado.classList.add('tem-artefato');
        } else {
          visualizador.selecionar(indice);
        }
        if (empilhado.matches && (porClique || m)) T.rolarAte(resultado);
      }

      var chat = T.criarChat(b, {
        animado: true, notas: 'nenhuma',
        aoArtefatos: temArtefatos ? mostrarArtefatos : null,
        aoMudar: ctx.atualizarNotas
      });
      chat.elemento.querySelector('.chat-log').setAttribute('data-dica', T.textoPuro(t('dicaAvancar')).replace(/[\[\]]/g, ''));
      st(chat.elemento, 2);
      var corpo = el('div', { class: 'slide-corpo conversa-corpo' }, [chat.elemento, resultado ? st(resultado, 3) : null]);
      ctx.inner.appendChild(corpo);

      return controlador({
        avancar: function () {
          if (chat.concluido()) return false;
          chat.avancar();
          return true;
        },
        concluido: chat.concluido,
        completar: chat.completarJa,
        notas: function () { return notaDoBloco(b).concat(chat.notasExibidas()); },
        destruir: chat.destruir
      });
    },

    comparativo: function (desc, ctx) {
      var b = desc.bloco;
      ctx.classe('slide-comparativo is-cheio');
      ctx.inner.appendChild(cabecalho(desc, b.titulo, b.texto));
      var lados = ['antes', 'depois'];
      var abas = el('div', { class: 'tabs compare-tabs', role: 'tablist', 'aria-label': b.titulo || t('comparativo'), 'data-keys': 'local' });
      var colunas = el('div', { class: 'compare-cols' });
      var botoes = [], paineis = [], chats = [];

      function ativar(i, focar) {
        botoes.forEach(function (bt, j) {
          bt.setAttribute('aria-selected', i === j ? 'true' : 'false');
          bt.tabIndex = i === j ? 0 : -1;
          paineis[j].classList.toggle('is-active', i === j);
        });
        if (focar) botoes[i].focus();
      }

      lados.forEach(function (lado, i) {
        var dados = b[lado] || { mensagens: [] };
        var rotulo = dados.rotulo || t(lado);
        var idAba = T.novoId('aba'), idPainel = T.novoId('painel');
        var botao = el('button', { type: 'button', role: 'tab', id: idAba, class: 'tab', 'aria-controls': idPainel, onclick: function () { ativar(i, false); } }, [rotulo]);
        var chat = T.criarChat({ titulo: dados.titulo, contexto: dados.contexto, mensagens: dados.mensagens }, {
          animado: true, compacto: true, notas: 'nenhuma',
          aoAvancar: function () { ativar(i, false); },
          aoMudar: ctx.atualizarNotas
        });
        chat.elemento.querySelector('.chat-log').setAttribute('data-dica', i === 0 ? T.textoPuro(t('dicaAvancar')).replace(/[\[\]]/g, '') : '');
        chats.push(chat);
        var coluna = el('div', { class: 'compare-col compare-' + lado, id: idPainel, role: 'tabpanel', 'aria-labelledby': idAba }, [
          el('span', { class: 'compare-label', 'aria-hidden': 'true', text: rotulo }),
          chat.elemento
        ]);
        st(coluna, 2 + i);
        botoes.push(botao); paineis.push(coluna);
        abas.appendChild(botao); colunas.appendChild(coluna);
      });

      abas.addEventListener('keydown', function (e) {
        var atual = botoes.indexOf(document.activeElement);
        if (atual < 0) return;
        var alvo = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') alvo = 1 - atual;
        else if (e.key === 'Home') alvo = 0;
        else if (e.key === 'End') alvo = 1;
        if (alvo != null) { e.preventDefault(); ativar(alvo, true); }
      });
      ativar(0, false);
      ctx.inner.appendChild(el('div', { class: 'slide-corpo compare' }, [abas, colunas]));

      return controlador({
        avancar: function () {
          for (var i = 0; i < chats.length; i++) {
            if (!chats[i].concluido()) { chats[i].avancar(); return true; }
          }
          return false;
        },
        concluido: function () { return chats.every(function (c) { return c.concluido(); }); },
        completar: function () { chats.forEach(function (c) { c.completarJa(); }); },
        notas: function () {
          var r = notaDoBloco(b);
          chats.forEach(function (c, i) {
            c.notasExibidas().forEach(function (n) { r.push({ titulo: (b[lados[i]] && b[lados[i]].rotulo || t(lados[i])) + ' · ' + n.titulo, texto: n.texto }); });
          });
          return r;
        },
        destruir: function () { chats.forEach(function (c) { c.destruir(); }); }
      });
    },

    tour: function (desc, ctx) {
      var b = desc.bloco;
      var passos = b.passos || [];
      var atual = -1;
      ctx.classe('slide-tour');
      ctx.inner.appendChild(cabecalho(desc, b.titulo, b.texto));
      var mock = T.renderMock(b.interfaceSimulada);
      var marcadores = passos.map(function (p, i) {
        var m = el('span', { class: 'tour-marker', 'aria-hidden': 'true', text: String(i + 1), hidden: true });
        if (mock.alvos[p.alvo]) mock.alvos[p.alvo].appendChild(m);
        return m;
      });
      var balao = el('div', { class: 'tour-balao', 'aria-live': 'polite' });
      var pontos = el('div', { class: 'tour-pontos', 'aria-hidden': 'true' }, passos.map(function () { return el('span'); }));

      function mostrar(i) {
        atual = T.limitar(i, -1, passos.length - 1);
        mock.elemento.classList.toggle('is-tour-ativo', atual >= 0);
        passos.forEach(function (p, j) {
          if (mock.alvos[p.alvo]) mock.alvos[p.alvo].classList.toggle('is-highlight', j === atual);
          marcadores[j].hidden = j !== atual;
          pontos.children[j].className = j < atual ? 'is-feito' : j === atual ? 'is-atual' : '';
        });
        var conteudo;
        if (atual < 0) {
          conteudo = el('div', { class: 'tour-balao-in' }, [
            el('p', { class: 'tour-step', text: t('tourTitulo') }),
            el('h3', { text: t('tourIntroTitulo') }),
            md(t('tourIntroTexto'))
          ]);
        } else {
          var p = passos[atual];
          conteudo = el('div', { class: 'tour-balao-in' }, [
            el('p', { class: 'tour-step', text: t('tourPasso', { atual: atual + 1, total: passos.length }) }),
            el('h3', { text: p.titulo }),
            md(p.texto)
          ]);
        }
        balao.textContent = '';
        balao.appendChild(conteudo);
        balao.appendChild(pontos);
      }
      mostrar(-1);

      ctx.inner.appendChild(el('div', { class: 'slide-corpo tour-corpo' }, [st(mock.elemento, 2), st(balao, 3)]));
      return controlador({
        avancar: function () {
          if (atual >= passos.length - 1) return false;
          mostrar(atual + 1);
          return true;
        },
        concluido: function () { return atual >= passos.length - 1; },
        completar: function () { mostrar(passos.length - 1); },
        notas: function () { return notaDoBloco(b); }
      });
    }
  };

  /* ---------- Navegação e transições ---------- */

  var atual = -1;
  var ctrlAtual = null;
  var slideAtual = null;
  var saindo = [];

  function construir(desc) {
    var total = SLIDES.length;
    var raiz = el('section', {
      class: 'slide slide-' + desc.tipo,
      role: 'group', 'aria-roledescription': t('slideRotulo'),
      'aria-label': t('anuncioSlide', { atual: desc.indice + 1, total: total, titulo: desc.titulo })
    });
    var inner = el('div', { class: 'slide-in' });
    raiz.appendChild(inner);
    var ctx = {
      inner: inner,
      classe: function (c) { c.split(' ').forEach(function (x) { if (x) raiz.classList.add(x); }); },
      atualizarNotas: function () { if (slideAtual === raiz) atualizarNotas(); }
    };
    var construtor = CONSTRUTORES[desc.tipo];
    var ctrl = construtor ? construtor(desc, ctx) : (inner.appendChild(el('p', { class: 'aviso', text: t('blocoDesconhecido') + ': ' + desc.tipo })), controlador({}));
    return { elemento: raiz, ctrl: ctrl };
  }

  function finalizarSaidas() {
    saindo.forEach(function (s) { clearTimeout(s.timer); if (s.el.parentNode) s.el.parentNode.removeChild(s.el); });
    saindo = [];
  }

  function irPara(i, opcoes) {
    opcoes = opcoes || {};
    i = T.limitar(i, 0, SLIDES.length - 1);
    if (i === atual && !opcoes.forcar) return;
    var direcao = opcoes.direcao || (i > atual ? 1 : -1);
    var primeiraVez = atual < 0;
    finalizarSaidas();
    if (ctrlAtual) ctrlAtual.destruir();

    var antigo = slideAtual;
    var desc = SLIDES[i];
    var novo = construir(desc);
    atual = i;
    ctrlAtual = novo.ctrl;
    slideAtual = novo.elemento;

    var animar = !primeiraVez && !T.semMovimento() && !opcoes.instantaneo;
    if (animar) {
      var entrada = desc.tipo === 'abertura' && direcao > 0 ? 'entra-modulo' : direcao > 0 ? 'entra-frente' : 'entra-tras';
      novo.elemento.classList.add(entrada);
    }
    palco.appendChild(novo.elemento);
    if (opcoes.completo) ctrlAtual.completar();

    if (antigo) {
      var focoDentro = antigo.contains(document.activeElement);
      antigo.setAttribute('aria-hidden', 'true');
      antigo.inert = true;
      if (animar) {
        antigo.classList.add(direcao > 0 ? 'sai-frente' : 'sai-tras');
        var registro = { el: antigo, timer: setTimeout(function () {
          if (antigo.parentNode) antigo.parentNode.removeChild(antigo);
          saindo = saindo.filter(function (s) { return s !== registro; });
        }, DURACAO_TRANSICAO) };
        saindo.push(registro);
      } else if (antigo.parentNode) {
        antigo.parentNode.removeChild(antigo);
      }
      if (focoDentro || document.activeElement === document.body) palco.focus({ preventScroll: true });
    }

    atualizarInterface(desc);
  }

  function avancar() {
    if (ctrlAtual && !ctrlAtual.concluido() && ctrlAtual.avancar()) { atualizarNotas(); return; }
    if (atual < SLIDES.length - 1) irPara(atual + 1, { direcao: 1 });
  }

  function voltar() {
    if (atual > 0) irPara(atual - 1, { direcao: -1, completo: true });
  }

  /* ---------- Interface ao redor do palco ---------- */

  var BOLHAS = [
    [[12, 18], [78, 70], [60, 12]], [[70, 20], [18, 72], [86, 88]], [[30, 80], [80, 24], [8, 40]],
    [[85, 60], [20, 25], [55, 90]], [[50, 10], [10, 85], [92, 40]], [[20, 50], [70, 85], [65, 15]]
  ];

  function atualizarFundo(desc) {
    var fundo = $('deck-fundo');
    var conjunto = BOLHAS[(desc.indice + Math.max(0, desc.modulo) * 2) % BOLHAS.length];
    conjunto.forEach(function (p, k) {
      fundo.style.setProperty('--x' + (k + 1), p[0] + '%');
      fundo.style.setProperty('--y' + (k + 1), p[1] + '%');
    });
    fundo.classList.toggle('is-forte', desc.tipo === 'capa' || desc.tipo === 'abertura' || desc.tipo === 'frase');
  }

  function atualizarInterface(desc) {
    var total = SLIDES.length;
    $('deck-contador').textContent = t('contadorSlides', { atual: desc.indice + 1, total: total });
    $('deck-trilha').textContent = desc.modulo >= 0 ? trilhaModulo(desc.modulo) : '';
    $('anuncio').textContent = t('anuncioSlide', { atual: desc.indice + 1, total: total, titulo: desc.titulo });
    document.title = desc.titulo + ' · ' + t('nomeSite');
    $('btn-voltar').disabled = desc.indice === 0;
    $('btn-avancar').disabled = desc.indice === total - 1;
    atualizarProgresso(desc);
    atualizarFundo(desc);
    atualizarNotas();
    marcarVisaoGeral();

    var hash = '#' + desc.id;
    if (location.hash !== hash) {
      try { history.replaceState(null, '', hash); } catch (e) { try { location.replace(hash); } catch (e2) { /* ignora */ } }
    }
    T.gravarEstado(function (s) { s.deck.slide = desc.id; });
  }

  function montarProgresso() {
    var barra = $('deck-progresso');
    barra.setAttribute('role', 'group');
    barra.setAttribute('aria-label', t('progressoDeck'));
    MODULOS.forEach(function (mod, mi) {
      var n = slidesDoModulo(mi).length;
      var seg = el('button', {
        type: 'button', class: 'seg', 'data-modulo': String(mi), 'data-blur-on-click': true,
        style: { 'flex-grow': String(n) },
        title: t('irParaModulo', { n: mi + 1, titulo: mod.titulo }),
        'aria-label': t('irParaModulo', { n: mi + 1, titulo: mod.titulo }),
        onclick: function () { irPara(primeiroDoModulo(mi)); }
      }, [el('span', { class: 'seg-trilho' }, [el('span', { class: 'seg-fill' })])]);
      barra.appendChild(seg);
    });
  }

  function atualizarProgresso(desc) {
    Array.prototype.forEach.call(document.querySelectorAll('#deck-progresso .seg'), function (seg) {
      var mi = Number(seg.getAttribute('data-modulo'));
      var lista = slidesDoModulo(mi);
      var frac = 0;
      if (desc.modulo > mi) frac = 1;
      else if (desc.modulo === mi) frac = (lista.indexOf(desc) + 1) / lista.length;
      seg.querySelector('.seg-fill').style.width = (frac * 100) + '%';
      seg.classList.toggle('is-atual', desc.modulo === mi);
      if (desc.modulo === mi) seg.setAttribute('aria-current', 'step'); else seg.removeAttribute('aria-current');
    });
  }

  /* ---------- Dock ---------- */

  function botaoDock(id, iconeNome, rotulo, acao, extra) {
    var b = el('button', { type: 'button', class: 'dock-btn', id: id, title: rotulo, 'aria-label': rotulo, 'data-blur-on-click': true, onclick: acao }, [icone(iconeNome, 20)]);
    if (extra) Object.keys(extra).forEach(function (k) { b.setAttribute(k, extra[k]); });
    return b;
  }

  function telaCheiaDisponivel() {
    return !!(document.fullscreenEnabled && document.documentElement.requestFullscreen);
  }

  function alternarTelaCheia() {
    if (!telaCheiaDisponivel()) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen().catch(function () { /* recusado pelo navegador */ });
  }

  function atualizarBotaoTelaCheia() {
    var b = $('btn-tela-cheia');
    if (!b) return;
    var ativo = !!document.fullscreenElement;
    var rotulo = ativo ? t('sairTelaCheia') : t('telaCheia');
    b.title = rotulo; b.setAttribute('aria-label', rotulo);
    b.textContent = '';
    b.appendChild(icone(ativo ? 'sairTelaCheia' : 'telaCheia', 20));
  }

  function montarDock() {
    var dock = $('dock');
    dock.setAttribute('aria-label', t('deckRotulo'));
    var casa = el('a', { class: 'dock-btn', href: 'index.html', title: t('voltarCapa'), 'aria-label': t('voltarCapa') }, [icone('casa', 20)]);
    dock.appendChild(casa);
    dock.appendChild(el('span', { class: 'dock-sep', 'aria-hidden': 'true' }));
    dock.appendChild(botaoDock('btn-voltar', 'esquerda', t('slideAnteriorDeck'), voltar));
    dock.appendChild(botaoDock('btn-avancar', 'direita', t('proximoSlideDeck'), avancar, { class: 'dock-btn dock-principal' }));
    dock.appendChild(el('span', { class: 'dock-sep', 'aria-hidden': 'true' }));
    dock.appendChild(botaoDock('btn-visao-geral', 'grade', t('visaoGeral'), function () { abrirVisaoGeral(); }, { 'aria-haspopup': 'dialog' }));
    dock.appendChild(botaoDock('btn-notas', 'notas', t('notas'), function () { alternarNotas(); }, { 'aria-expanded': 'false', 'aria-controls': 'painel-notas' }));
    if (telaCheiaDisponivel()) dock.appendChild(botaoDock('btn-tela-cheia', 'telaCheia', t('telaCheia'), alternarTelaCheia));
    var tema = T.botaoTema('dock-btn');
    dock.appendChild(tema);
    T.aplicarTema();

    var marca = $('deck-marca');
    marca.appendChild(T.marcaSite(28));
    marca.appendChild(el('span', { class: 'deck-marca-nome', text: t('nomeSite') }));
    marca.setAttribute('title', t('voltarCapa'));

    document.addEventListener('fullscreenchange', atualizarBotaoTelaCheia);
  }

  // Esconde topo e dock quando o mouse fica parado (só em dispositivos com mouse)
  function configurarOcioso() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    var deck = $('deck');
    var timer = null;
    function acordar() {
      deck.classList.remove('is-ocioso');
      clearTimeout(timer);
      timer = setTimeout(function () {
        if (!deck.querySelector('.dock:hover, .deck-progresso:hover') && !$('dock').contains(document.activeElement)) deck.classList.add('is-ocioso');
      }, OCIOSO_MS);
    }
    document.addEventListener('mousemove', acordar);
    document.addEventListener('mousedown', acordar);
    acordar();
  }

  /* ---------- Visão geral ---------- */

  function montarVisaoGeral() {
    var vg = $('visao-geral');
    var grupos = [];
    var cab = el('div', { class: 'vg-cab' }, [
      el('h2', { id: 'vg-titulo', text: t('visaoGeral') }),
      el('button', { type: 'button', class: 'icon-btn', title: t('fechar'), 'aria-label': t('fechar'), onclick: fecharVisaoGeral }, [icone('fechar', 22)])
    ]);
    var corpo = el('div', { class: 'vg-corpo' });
    var grupoCapa = { titulo: APRES.titulo || '', slides: [SLIDES[0]] };
    grupos.push(grupoCapa);
    MODULOS.forEach(function (mod, mi) { grupos.push({ titulo: (mi + 1) + '. ' + mod.titulo, slides: slidesDoModulo(mi) }); });
    grupos.forEach(function (g) {
      corpo.appendChild(el('section', { class: 'vg-grupo' }, [
        el('h3', { text: g.titulo }),
        el('ol', { class: 'vg-lista' }, g.slides.map(function (s) {
          return el('li', null, [el('button', {
            type: 'button', class: 'vg-slide vg-' + s.tipo, 'data-indice': String(s.indice),
            onclick: function () { fecharVisaoGeral(true); irPara(s.indice); }
          }, [
            el('span', { class: 'vg-num', text: String(s.indice + 1) }),
            el('span', { class: 'vg-nome', text: s.tipo === 'abertura' ? t('aberturaModulo') : s.tipo === 'capa' ? t('capaDeck') : s.titulo })
          ])]);
        }))
      ]));
    });
    vg.appendChild(el('div', { class: 'vg-caixa' }, [cab, corpo]));
    vg.addEventListener('click', function (e) { if (e.target === vg) fecharVisaoGeral(); });
    vg.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var focaveis = Array.prototype.slice.call(vg.querySelectorAll('button'));
      var primeiro = focaveis[0], ultimo = focaveis[focaveis.length - 1];
      if (e.shiftKey && document.activeElement === primeiro) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primeiro.focus(); }
    });
  }

  function marcarVisaoGeral() {
    Array.prototype.forEach.call(document.querySelectorAll('.vg-slide'), function (b) {
      if (Number(b.getAttribute('data-indice')) === atual) b.setAttribute('aria-current', 'true');
      else b.removeAttribute('aria-current');
    });
  }

  function visaoGeralAberta() { return !$('visao-geral').hidden; }

  function abrirVisaoGeral() {
    var vg = $('visao-geral');
    vg.hidden = false;
    document.body.classList.add('com-sobreposicao');
    $('btn-visao-geral').setAttribute('aria-expanded', 'true');
    var corrente = vg.querySelector('.vg-slide[aria-current="true"]');
    if (corrente) {
      corrente.focus({ preventScroll: true });
      corrente.scrollIntoView({ block: 'center' });
    }
  }

  function fecharVisaoGeral(semFoco) {
    var vg = $('visao-geral');
    if (vg.hidden) return;
    vg.hidden = true;
    document.body.classList.remove('com-sobreposicao');
    $('btn-visao-geral').setAttribute('aria-expanded', 'false');
    if (!semFoco) $('btn-visao-geral').focus({ preventScroll: true });
  }

  /* ---------- Notas ---------- */

  function montarNotas() {
    var p = $('painel-notas');
    p.appendChild(el('div', { class: 'notas-cab' }, [
      el('h2', { id: 'notas-titulo' }, [icone('notas', 18), el('span', { text: t('notas') })]),
      el('button', { type: 'button', class: 'icon-btn', title: t('fechar'), 'aria-label': t('fechar'), onclick: function () { alternarNotas(false); } }, [icone('fechar', 20)])
    ]));
    p.appendChild(el('div', { class: 'notas-corpo', id: 'notas-corpo' }));
  }

  function notasAbertas() { return !$('painel-notas').hidden; }

  function alternarNotas(forcar) {
    var abrir = forcar != null ? forcar : !notasAbertas();
    $('painel-notas').hidden = !abrir;
    $('btn-notas').setAttribute('aria-expanded', abrir ? 'true' : 'false');
    $('btn-notas').classList.toggle('is-ativo', abrir);
    document.body.classList.toggle('com-notas', abrir);
    T.gravarEstado(function (s) { s.deck.notas = abrir; });
    atualizarNotas();
  }

  function atualizarNotas() {
    var corpo = $('notas-corpo');
    if (!corpo || !notasAbertas() || !ctrlAtual) return;
    var lista = ctrlAtual.notas() || [];
    corpo.textContent = '';
    if (!lista.length) { corpo.appendChild(el('p', { class: 'notas-vazio', text: t('semNotas') })); return; }
    lista.forEach(function (n, i) {
      corpo.appendChild(el('div', { class: 'nota' + (i === lista.length - 1 ? ' is-recente' : '') }, [
        el('p', { class: 'nota-titulo', text: n.titulo }), md(n.texto)
      ]));
    });
    corpo.scrollTop = corpo.scrollHeight;
  }

  /* ---------- Tela preta ---------- */

  function alternarTelaPreta(forcar) {
    var tp = $('tela-preta');
    var mostrar = forcar != null ? forcar : tp.hidden;
    tp.hidden = !mostrar;
    if (mostrar) tp.textContent = t('telaPreta');
  }

  /* ---------- Teclado e gestos ---------- */

  function aoTeclar(e) {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    var alvo = e.target && e.target.closest ? e.target : document.body;
    var k = e.key;

    if (!$('tela-preta').hidden) { e.preventDefault(); alternarTelaPreta(false); return; }

    if (visaoGeralAberta()) {
      if (k === 'Escape' || k === 'o' || k === 'O') { e.preventDefault(); fecharVisaoGeral(); }
      return;
    }
    if (k === 'Escape') {
      if (notasAbertas()) { e.preventDefault(); alternarNotas(false); }
      return;
    }
    if (alvo.closest('input, textarea, select, [contenteditable="true"]')) return;

    var interativo = alvo.closest('button, a[href], summary, [role="tab"], [tabindex]:not([tabindex="-1"])');
    var local = alvo.closest('[data-keys="local"], [role="tablist"]');

    if (k === 'ArrowRight' || k === 'PageDown') {
      if (k === 'ArrowRight' && local) return;
      e.preventDefault(); avancar(); return;
    }
    if (k === ' ' || k === 'Spacebar' || k === 'Enter') {
      if (interativo) return;
      e.preventDefault(); avancar(); return;
    }
    if (k === 'ArrowLeft' || k === 'PageUp' || k === 'Backspace') {
      if (k === 'ArrowLeft' && local) return;
      e.preventDefault(); voltar(); return;
    }
    if (k === 'Home') { e.preventDefault(); irPara(0); return; }
    if (k === 'End') { e.preventDefault(); irPara(SLIDES.length - 1); return; }
    if (/^[0-9]$/.test(k)) {
      var mi = k === '0' ? 9 : Number(k) - 1;
      if (mi < MODULOS.length) { e.preventDefault(); irPara(primeiroDoModulo(mi)); }
      return;
    }
    if (k === 'o' || k === 'O') { e.preventDefault(); abrirVisaoGeral(); return; }
    if (k === 'n' || k === 'N') { e.preventDefault(); alternarNotas(); return; }
    if (k === 'f' || k === 'F') { e.preventDefault(); alternarTelaCheia(); return; }
    if (k === 'b' || k === 'B' || k === '.') { e.preventDefault(); alternarTelaPreta(true); }
  }

  function configurarGestos() {
    var inicio = null;
    palco.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) { inicio = null; return; }
      var alvo = e.target.closest && e.target.closest('[data-keys="local"], .ig-carousel, .tabs');
      inicio = alvo ? null : { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });
    palco.addEventListener('touchend', function (e) {
      if (!inicio) return;
      var dx = e.changedTouches[0].clientX - inicio.x;
      var dy = e.changedTouches[0].clientY - inicio.y;
      inicio = null;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        if (dx < 0) avancar(); else voltar();
      }
    }, { passive: true });
  }

  /* ---------- Inicialização ---------- */

  function indiceInicial() {
    var doHash = indiceDoId(decodeURIComponent(location.hash.slice(1)));
    if (doHash >= 0) return doHash;
    var salvo = T.lerEstado().deck || {};
    var i = indiceDoId(salvo.slide);
    return i >= 0 ? i : 0;
  }

  $('tela-preta').addEventListener('click', function () { alternarTelaPreta(false); });
  montarDock();
  montarProgresso();
  montarVisaoGeral();
  montarNotas();
  configurarOcioso();
  configurarGestos();
  document.addEventListener('keydown', aoTeclar);
  window.addEventListener('hashchange', function () {
    var i = indiceDoId(decodeURIComponent(location.hash.slice(1)));
    if (i >= 0 && i !== atual) irPara(i);
  });

  if (T.lerEstado().deck && T.lerEstado().deck.notas) alternarNotas(true);
  irPara(indiceInicial());

  // Exposto para testes e depuração
  window.Deck = { total: SLIDES.length, atual: function () { return atual; }, ir: irPara, slides: SLIDES };
})();
