/* ==========================================================================
   Ambiente de Treinamento — página de estudo
   Um módulo por vez, com conversas completas, notas visíveis e resultados
   logo abaixo das respostas. Apenas lógica; o conteúdo vem de content.js.
   ========================================================================== */
(function () {
  'use strict';

  var T = window.Treino;
  var raiz = document.getElementById('modulo');
  if (!T || !T.MODULOS.length) {
    raiz.innerHTML = '<p class="aviso">' + (T ? T.t('erroConteudo') : 'Erro: js/content.js') + '</p>';
    return;
  }

  var t = T.t, el = T.el, $ = T.$, icone = T.icone, md = T.md;
  var MODULOS = T.MODULOS;
  var PALAVRAS_POR_MINUTO = 180;

  var indice = 0;
  var chatsAtivos = [];
  var videosAtivos = [];

  function concluidos() {
    var mapa = {};
    T.lerEstado().estudo.concluidos.forEach(function (id) { mapa[id] = true; });
    return mapa;
  }

  /* ---------- Blocos ---------- */

  function secao(b, filhos, classe) {
    return el('section', { class: 'block' + (classe ? ' ' + classe : '') }, filhos);
  }
  function tituloBloco(texto) { return texto ? el('h2', { class: 'block-title', text: texto }) : null; }

  // Botão "Ver animação" / "Mostrar tudo" que reproduz uma conversa no lugar
  function acaoAnimacao(obterChat) {
    var rotulo = el('span', { text: t('verAnimacao') });
    var botao = el('button', { type: 'button', class: 'btn btn-sm btn-ghost replay-btn', 'data-blur-on-click': true }, [icone('play', 14), rotulo]);
    var tocando = false;
    function estado(v) {
      tocando = v;
      rotulo.textContent = v ? t('mostrarTudo') : t('verAnimacao');
      botao.replaceChild(icone(v ? 'pular' : 'play', 14), botao.firstChild);
      botao.classList.toggle('is-tocando', v);
    }
    botao.addEventListener('click', function () {
      var chat = obterChat();
      if (tocando) { chat.completar(); return; }
      estado(true);
      chat.reiniciar();
      chat.definirAnimado(true);
      chat.reproduzir().then(function () {
        return chat.completar();
      }).then(function () {
        chat.definirAnimado(false);
        estado(false);
      });
    });
    return botao;
  }

  function criarChatEstudo(conversa, opcoes) {
    var chat = null;
    var acao = acaoAnimacao(function () { return chat; });
    var op = { completo: true, notas: 'visiveis', acaoCabecalho: acao };
    Object.keys(opcoes || {}).forEach(function (k) { op[k] = opcoes[k]; });
    chat = T.criarChat(conversa, op);
    chatsAtivos.push(chat);
    return chat;
  }

  var RENDERIZADORES = {
    'texto': function (b) { return secao(b, [tituloBloco(b.titulo), md(b.texto, 'block-text')]); },

    'destaque': function (b) { return secao(b, [T.renderDestaque(b, 'h2')]); },

    'frase': function (b) {
      return secao(b, [el('blockquote', { class: 'quote' + (b.cor === 'verde' ? ' is-green' : '') }, [
        b.icone ? el('span', { class: 'quote-icon', 'aria-hidden': 'true', text: b.icone }) : null,
        el('p', { class: 'quote-text', html: T.inline(b.texto || '') }),
        b.apoio ? el('p', { class: 'quote-sub', html: T.inline(b.apoio) }) : null
      ])]);
    },

    'cards': function (b) {
      return secao(b, [tituloBloco(b.titulo), b.texto ? md(b.texto, 'block-intro') : null, T.renderCards(b.itens)]);
    },

    'visao-geral': function (b) {
      return secao(b, [tituloBloco(b.titulo), T.renderAgenda({
        href: function (mod) { return '#' + mod.id; },
        concluidos: concluidos()
      })]);
    },

    'chat': function (b) {
      var chat = criarChatEstudo(b);
      return secao(b, [tituloBloco(b.tituloBloco), b.texto ? md(b.texto, 'block-intro') : null, chat.elemento]);
    },

    'comparativo': function (b) {
      var lados = ['antes', 'depois'];
      var abas = el('div', { class: 'tabs compare-tabs', role: 'tablist', 'aria-label': b.titulo || t('comparativo'), 'data-keys': 'local' });
      var colunas = el('div', { class: 'compare-cols' });
      var botoes = [], paineis = [];

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
        var chat = criarChatEstudo({ titulo: dados.titulo, contexto: dados.contexto, mensagens: dados.mensagens }, { compacto: true });
        var coluna = el('div', { class: 'compare-col compare-' + lado, id: idPainel, role: 'tabpanel', 'aria-labelledby': idAba }, [
          el('span', { class: 'compare-label', 'aria-hidden': 'true', text: rotulo }), chat.elemento
        ]);
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
      return secao(b, [tituloBloco(b.titulo), b.texto ? md(b.texto, 'block-intro') : null, abas, colunas], 'compare');
    },

    'projeto': function (b) { return secao(b, [tituloBloco(b.titulo), b.texto ? md(b.texto, 'block-intro') : null, T.renderProjeto(b)]); },

    'skill': function (b) { return secao(b, [tituloBloco(b.titulo), b.texto ? md(b.texto, 'block-intro') : null, T.renderSkill(b)]); },

    'tabela': function (b) { return secao(b, [tituloBloco(b.titulo), b.texto ? md(b.texto, 'block-intro') : null, T.renderTabela(b)]); },

    'tour': function (b) {
      var passos = b.passos || [];
      var mock = T.renderMock(b.interfaceSimulada);
      passos.forEach(function (p, i) {
        if (mock.alvos[p.alvo]) mock.alvos[p.alvo].appendChild(el('span', { class: 'tour-marker', 'aria-hidden': 'true', text: String(i + 1) }));
      });
      return secao(b, [
        tituloBloco(b.titulo),
        b.texto ? md(b.texto, 'block-intro') : null,
        mock.elemento,
        el('ol', { class: 'tour-list' }, passos.map(function (p, i) {
          return el('li', null, [
            el('span', { class: 'tour-num', 'aria-hidden': 'true', text: String(i + 1) }),
            el('div', null, [el('strong', { text: p.titulo }), md(p.texto)])
          ]);
        }))
      ], 'tour');
    },

    'pratica': function (b) { return secao(b, [T.renderPratica(b, 'h2')]); },

    'imagem': function (b) {
      return secao(b, [tituloBloco(b.titulo), b.texto ? md(b.texto, 'block-text') : null, T.renderImagem(b)], 'block-imagem');
    },

    'proxima-palavra': function (b) {
      return secao(b, [tituloBloco(b.titulo), b.texto ? md(b.texto, 'block-intro') : null, T.criarProximaPalavra(b, { estatico: true }).elemento]);
    },

    'visao': function (b) {
      return secao(b, [tituloBloco(b.titulo), b.texto ? md(b.texto, 'block-intro') : null, T.criarVisao(b, { estatico: true }).elemento]);
    },

    'video': function (b) {
      var v = T.criarVideoSimulado(b, {});
      videosAtivos.push(v);
      return secao(b, [tituloBloco(b.titulo), b.texto ? md(b.texto, 'block-intro') : null, v.elemento], 'block-video');
    },

    'antes-depois': function (b) {
      return secao(b, [tituloBloco(b.titulo), b.texto ? md(b.texto, 'block-intro') : null, T.renderAntesDepois(b)]);
    },

    'links': function (b) { return secao(b, [tituloBloco(b.titulo), T.renderLinks(b.itens)]); }
  };

  function tituloParaIndice(b) {
    if (b.tipo === 'chat') return b.tituloBloco || null;
    if (b.tipo === 'pratica') return b.titulo || t('agoraTente');
    if (b.tipo === 'frase') return null;
    return b.titulo || null;
  }

  /* ---------- Tempo de leitura ---------- */

  // Campos que não são lidos pela aluna (configuração e lembretes do instrutor)
  var IGNORAR = { slide: 1, tipo: 1, alvo: 1, icone: 1, cor: 1, url: 1, passoAPasso: 1, soNosSlides: 1, interfaceSimulada: 1 };

  function contarPalavras(v) {
    if (v == null) return 0;
    if (typeof v === 'string') return T.textoPuro(v).split(/\s+/).filter(Boolean).length;
    if (Array.isArray(v)) return v.reduce(function (s, x) { return s + contarPalavras(x); }, 0);
    if (typeof v === 'object') {
      return Object.keys(v).reduce(function (s, k) { return IGNORAR[k] ? s : s + contarPalavras(v[k]); }, 0);
    }
    return 0;
  }

  /* ---------- Módulo ---------- */

  function renderModulo(focar) {
    chatsAtivos.forEach(function (c) { c.destruir(); });
    chatsAtivos = [];
    videosAtivos.forEach(function (v) { v.destruir(); });
    videosAtivos = [];
    var mod = MODULOS[indice];
    var total = MODULOS.length;
    var feitos = concluidos();
    var blocos = T.blocosDoModulo(mod, 'estudo');

    raiz.textContent = '';
    var minutos = Math.max(1, Math.round(contarPalavras(blocos) / PALAVRAS_POR_MINUTO));

    var cab = el('header', { class: 'module-head' + (mod.imagem ? ' com-imagem' : '') }, [
      mod.imagem ? el('figure', { class: 'module-banner' }, [T.imagem(mod.imagem, mod.imagemAlt || '')]) : null,
      el('p', { class: 'module-kicker', text: t('moduloDe', { atual: indice + 1, total: total }) }),
      el('h1', { id: 'titulo-modulo', tabindex: '-1', text: mod.titulo }),
      mod.resumo ? el('p', { class: 'module-lead', text: mod.resumo }) : null,
      el('div', { class: 'module-meta' }, [
        el('span', { class: 'meta-item' }, [icone('relogio', 16), el('span', { text: t('tempoLeitura', { n: minutos }) })]),
        feitos[mod.id] ? el('span', { class: 'meta-item is-done' }, [icone('check', 16), el('span', { text: t('moduloConcluido') })]) : null,
        el('a', { class: 'meta-link', href: 'apresentacao.html#' + mod.id }, [icone('slides', 16), el('span', { text: t('apresentarModulo') })])
      ])
    ]);
    raiz.appendChild(cab);

    var secoes = [];
    var indiceItens = [];
    blocos.forEach(function (b, i) {
      var r = RENDERIZADORES[b.tipo];
      var s = r ? r(b) : el('p', { class: 'aviso', text: t('blocoDesconhecido') + ': ' + b.tipo });
      s.id = 'secao-' + (i + 1);
      secoes.push(s);
      var titulo = tituloParaIndice(b);
      if (titulo) indiceItens.push({ id: s.id, titulo: titulo });
    });

    if (indiceItens.length > 2) {
      raiz.appendChild(el('nav', { class: 'toc', 'aria-labelledby': 'toc-titulo' }, [
        el('h2', { class: 'toc-title', id: 'toc-titulo', text: t('nestaPagina') }),
        el('ol', null, indiceItens.map(function (it) {
          return el('li', null, [el('a', {
            href: '#' + it.id, text: it.titulo,
            onclick: function (e) {
              e.preventDefault();
              var alvo = $(it.id);
              alvo.scrollIntoView({ behavior: T.semMovimento() ? 'auto' : 'smooth', block: 'start' });
              var h = alvo.querySelector('h2, h3');
              if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
            }
          })]);
        }))
      ]));
    }

    secoes.forEach(function (s) { raiz.appendChild(s); });
    raiz.appendChild(renderFim(mod, feitos));

    atualizarTopo(mod, feitos);
    renderListaModulos(feitos);
    document.title = mod.titulo + ' · ' + t('nomeSite');
    T.gravarEstado(function (s) { s.estudo.modulo = mod.id; });

    if (('#' + mod.id) !== location.hash) {
      try { history.replaceState(null, '', '#' + mod.id); } catch (e) { try { location.replace('#' + mod.id); } catch (e2) { /* ignora */ } }
    }
    window.scrollTo(0, 0);
    atualizarLeitura();
    if (focar) $('titulo-modulo').focus({ preventScroll: true });
  }

  function renderFim(mod, feitos) {
    var feito = !!feitos[mod.id];
    var botao = el('button', {
      type: 'button', class: 'btn done-btn' + (feito ? ' is-done' : ''), 'aria-pressed': feito ? 'true' : 'false',
      title: feito ? t('desmarcarConcluido') : null,
      onclick: function () {
        var marcar = botao.getAttribute('aria-pressed') !== 'true';
        T.gravarEstado(function (s) {
          s.estudo.concluidos = s.estudo.concluidos.filter(function (id) { return id !== mod.id; });
          if (marcar) s.estudo.concluidos.push(mod.id);
        });
        if (marcar) T.toast(t('marcadoConcluido'));
        var f = concluidos();
        botao.setAttribute('aria-pressed', marcar ? 'true' : 'false');
        botao.classList.toggle('is-done', marcar);
        botao.title = marcar ? t('desmarcarConcluido') : '';
        rotulo.textContent = marcar ? t('moduloConcluido') : t('concluirModulo');
        atualizarTopo(mod, f);
        renderListaModulos(f);
      }
    }, [icone('check', 18)]);
    var rotulo = el('span', { text: feito ? t('moduloConcluido') : t('concluirModulo') });
    botao.appendChild(rotulo);

    var anterior = indice > 0 ? MODULOS[indice - 1] : null;
    var proximo = indice < MODULOS.length - 1 ? MODULOS[indice + 1] : null;

    function cartao(m, i, direcao) {
      return el('a', { class: 'pager-card pager-' + direcao, href: '#' + m.id, 'data-blur-on-click': true }, [
        el('span', { class: 'pager-label' }, [
          direcao === 'anterior' ? icone('esquerda', 16) : null,
          el('span', { text: direcao === 'anterior' ? t('moduloAnterior') : t('proximoModulo') }),
          direcao === 'proximo' ? icone('direita', 16) : null
        ]),
        el('strong', { text: (i + 1) + '. ' + m.titulo }),
        direcao === 'proximo' && m.resumo ? el('span', { class: 'pager-sub', text: m.resumo }) : null
      ]);
    }

    return el('footer', { class: 'module-end' }, [
      el('div', { class: 'done-box' }, [botao]),
      proximo ? null : el('div', { class: 'callout is-green end-callout' }, [
        el('span', { class: 'callout-icon', 'aria-hidden': 'true', text: '🎉' }),
        el('div', null, [el('h2', { class: 'callout-title', text: t('fimTreinamentoTitulo') }), el('p', { text: t('fimTreinamentoTexto') })])
      ]),
      el('nav', { class: 'pager', 'aria-label': t('navegacaoModulos') }, [
        anterior ? cartao(anterior, indice - 1, 'anterior') : el('span'),
        proximo ? cartao(proximo, indice + 1, 'proximo') : el('a', { class: 'pager-card pager-proximo', href: 'index.html' }, [
          el('span', { class: 'pager-label' }, [el('span', { text: t('voltarCapa') }), icone('casa', 16)]),
          el('strong', { text: t('nomeSite') })
        ])
      ])
    ]);
  }

  function atualizarTopo(mod, feitos) {
    var total = MODULOS.length;
    var n = Object.keys(feitos).length;
    $('progresso-texto').textContent = t('moduloDe', { atual: indice + 1, total: total }) + (n ? ' · ' + t('concluidosN', { n: n }) : '');
    $('progresso-barra').style.width = (n / total * 100) + '%';
    var link = $('link-apresentar');
    if (link) link.href = 'apresentacao.html#' + mod.id;
  }

  function renderListaModulos(feitos) {
    var lista = $('lista-modulos');
    lista.textContent = '';
    MODULOS.forEach(function (mod, i) {
      var atual = i === indice;
      var feito = !!feitos[mod.id];
      lista.appendChild(el('li', null, [
        el('a', {
          class: 'module-link' + (feito ? ' is-done' : ''), href: '#' + mod.id,
          'aria-current': atual ? 'page' : null, 'data-blur-on-click': true
        }, [
          el('span', { class: 'module-num', 'aria-hidden': 'true' }, [feito ? icone('check', 15) : String(i + 1)]),
          el('span', null, [
            el('span', { class: 'module-link-title', text: mod.titulo }),
            mod.resumoCurto ? el('span', { class: 'module-link-sub', text: mod.resumoCurto }) : null,
            feito ? el('span', { class: 'sr-only', text: ' (' + t('concluido') + ')' }) : null
          ])
        ])
      ]));
    });
  }

  function irPara(i, focar) {
    if (i < 0 || i >= MODULOS.length) return;
    indice = i;
    fecharMenu();
    renderModulo(focar);
  }

  /* ---------- Barra de leitura ---------- */

  var quadroLeitura = null;
  function atualizarLeitura() {
    if (quadroLeitura) return;
    quadroLeitura = requestAnimationFrame(function () {
      quadroLeitura = null;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var frac = max > 0 ? T.limitar(window.scrollY / max, 0, 1) : 1;
      $('barra-leitura').style.transform = 'scaleX(' + frac + ')';
    });
  }

  /* ---------- Menu lateral (celular) ---------- */

  function abrirMenu() {
    document.body.classList.add('sidebar-open');
    $('btn-menu').setAttribute('aria-expanded', 'true');
    $('sidebar-backdrop').hidden = false;
    var atual = document.querySelector('.module-link[aria-current="page"]');
    if (atual) atual.focus();
  }
  function fecharMenu(restaurarFoco) {
    if (!document.body.classList.contains('sidebar-open')) return;
    document.body.classList.remove('sidebar-open');
    $('btn-menu').setAttribute('aria-expanded', 'false');
    $('sidebar-backdrop').hidden = true;
    if (restaurarFoco) $('btn-menu').focus();
  }

  /* ---------- Teclado ---------- */

  function aoTeclar(e) {
    var alvo = e.target && e.target.closest ? e.target : document.body;
    var digitando = alvo.closest('input, textarea, select, [contenteditable="true"]');
    // Atalhos da busca: "/" ou Ctrl+K
    if (!e.defaultPrevented && !digitando && ((e.key === '/' && !e.ctrlKey && !e.metaKey) || ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')))) {
      e.preventDefault();
      abrirBusca();
      return;
    }
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (e.key === 'Escape') {
      if (document.body.classList.contains('sidebar-open')) { fecharMenu(true); e.preventDefault(); }
      return;
    }
    if (alvo.closest('input, textarea, select, [contenteditable="true"]')) return;
    if (document.body.classList.contains('sidebar-open')) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      if (alvo.closest('[data-keys="local"], [role="tablist"]')) return;
      e.preventDefault();
      irPara(indice + (e.key === 'ArrowRight' ? 1 : -1), true);
    }
  }

  /* ---------- Busca rápida ---------- */

  // Campos que não são texto lido pela aluna
  var IGNORAR_BUSCA = {
    tipo: 1, alvo: 1, icone: 1, cor: 1, src: 1, foto: 1, visual: 1, efeito: 1, foco: 1, origem: 1,
    passoAPasso: 1, soNosSlides: 1, slide: 1, url: 1, x: 1, y: 1, lado: 1, escolhida: 1, chance: 1,
    grade: 1, numeros: 1, semGrade: 1, arquivo: 1, imagemAlt: 1, autor: 1, alt: 1, efeito: 1
  };

  function normalizar(s) {
    return String(s).normalize('NFC').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  }

  function coletarTextos(v, saida, nivel) {
    if (v == null) return;
    if (typeof v === 'string') {
      if (/^img\//.test(v)) return; // caminho de imagem
      saida.push(T.textoPuro(v).normalize('NFC'));
      return;
    }
    if (Array.isArray(v)) { v.forEach(function (x) { coletarTextos(x, saida, nivel + 1); }); return; }
    if (typeof v === 'object') {
      Object.keys(v).forEach(function (k) {
        if (IGNORAR_BUSCA[k]) return;
        if (nivel === 0 && k === 'nota') return; // lembrete de palco: não aparece no estudo
        coletarTextos(v[k], saida, nivel + 1);
      });
    }
  }

  var INDICE_BUSCA = [];
  MODULOS.forEach(function (mod, mi) {
    var texto = [mod.titulo, mod.resumo || ''].join(' · ').normalize('NFC');
    INDICE_BUSCA.push({ mi: mi, secao: null, titulo: t('buscaInicioModulo'), texto: texto, norm: normalizar(texto) });
    T.blocosDoModulo(mod, 'estudo').forEach(function (b, bi) {
      var partes = [];
      coletarTextos(b, partes, 0);
      var junto = partes.join(' · ').replace(/\s+/g, ' ');
      INDICE_BUSCA.push({
        mi: mi, secao: 'secao-' + (bi + 1),
        titulo: tituloParaIndice(b) || b.titulo || b.tituloBloco || T.textoPuro(b.texto || '').slice(0, 60),
        texto: junto, norm: normalizar(junto)
      });
    });
  });

  function buscar(consulta) {
    var termos = normalizar(consulta).split(/\s+/).filter(function (x) { return x.length > 0; });
    if (!termos.length) return [];
    var achados = [];
    INDICE_BUSCA.forEach(function (item) {
      var tituloNorm = normalizar(item.titulo);
      var pontos = 0;
      for (var i = 0; i < termos.length; i++) {
        var n = item.norm.split(termos[i]).length - 1;
        if (!n && tituloNorm.indexOf(termos[i]) < 0) return;
        pontos += n + (tituloNorm.indexOf(termos[i]) >= 0 ? 6 : 0);
      }
      achados.push({ item: item, pontos: pontos, termos: termos });
    });
    achados.sort(function (a, b) { return b.pontos - a.pontos || a.item.mi - b.item.mi; });
    return achados.slice(0, 12);
  }

  // Trecho em volta da primeira ocorrência, com os termos destacados (ignora acentos)
  function trechoDestacado(item, termos) {
    var pos = -1;
    termos.forEach(function (tm) { var p = item.norm.indexOf(tm); if (p >= 0 && (pos < 0 || p < pos)) pos = p; });
    if (pos < 0) pos = 0;
    var ini = Math.max(0, pos - 50), fim = Math.min(item.texto.length, pos + 110);
    while (ini > 0 && item.texto[ini] !== ' ') ini--;
    while (fim < item.texto.length && item.texto[fim] !== ' ') fim++;
    var original = item.texto.slice(ini, fim).trim();
    var norm = normalizar(original);
    var marcas = [];
    termos.forEach(function (tm) {
      var p = norm.indexOf(tm);
      while (p >= 0) { marcas.push([p, p + tm.length]); p = norm.indexOf(tm, p + tm.length); }
    });
    marcas.sort(function (a, b) { return a[0] - b[0]; });
    var html = '', cursor = 0;
    marcas.forEach(function (m) {
      if (m[0] < cursor) return;
      html += T.escapar(original.slice(cursor, m[0])) + '<mark>' + T.escapar(original.slice(m[0], m[1])) + '</mark>';
      cursor = m[1];
    });
    html += T.escapar(original.slice(cursor));
    return (ini > 0 ? '… ' : '') + html + (fim < item.texto.length ? ' …' : '');
  }

  var busca = { campo: null, painel: null, lista: null, status: null, ativo: -1, resultados: [] };

  function montarBusca() {
    var caixa = $('busca');
    var idLista = 'busca-resultados';
    busca.campo = el('input', {
      type: 'search', id: 'busca-campo', class: 'busca-campo', placeholder: t('buscaPlaceholder'), autocomplete: 'off',
      role: 'combobox', 'aria-expanded': 'false', 'aria-controls': idLista, 'aria-autocomplete': 'list', 'aria-label': t('buscaRotulo')
    });
    busca.status = el('p', { class: 'busca-status', role: 'status', 'aria-live': 'polite' });
    busca.lista = el('ul', { class: 'busca-lista', id: idLista, role: 'listbox', 'aria-label': t('buscaRotulo') });
    busca.painel = el('div', { class: 'busca-painel', hidden: true }, [busca.status, busca.lista]);
    var abrir = el('button', { type: 'button', class: 'icon-btn busca-abrir', title: t('buscaAbrir'), 'aria-label': t('buscaAbrir'), onclick: function () { abrirBusca(); } }, [icone('lupa', 20)]);
    var fechar = el('button', { type: 'button', class: 'icon-btn busca-fechar', title: t('buscaFechar'), 'aria-label': t('buscaFechar'), onclick: function () { fecharBusca(true); } }, [icone('fechar', 20)]);
    caixa.appendChild(abrir);
    caixa.appendChild(el('div', { class: 'busca-caixa' }, [
      el('span', { class: 'busca-lupa', 'aria-hidden': 'true' }, [icone('lupa', 18)]),
      busca.campo,
      el('kbd', { class: 'busca-kbd', 'aria-hidden': 'true', text: t('buscaAtalho') }),
      fechar,
      busca.painel
    ]));

    busca.campo.addEventListener('input', atualizarBusca);
    busca.campo.addEventListener('focus', function () { if (busca.campo.value.trim()) atualizarBusca(); });
    busca.campo.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); destacar(busca.ativo + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); destacar(busca.ativo - 1); }
      else if (e.key === 'Enter') { e.preventDefault(); if (busca.resultados.length) escolher(busca.resultados[Math.max(0, busca.ativo)].item); }
      else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); fecharBusca(true); }
    });
    document.addEventListener('click', function (e) {
      if (!caixa.contains(e.target)) esconderResultados();
    });
  }

  function abrirBusca() {
    document.body.classList.add('busca-aberta');
    busca.campo.focus();
  }

  function esconderResultados() {
    busca.painel.hidden = true;
    busca.campo.setAttribute('aria-expanded', 'false');
    busca.campo.removeAttribute('aria-activedescendant');
  }

  function fecharBusca(limpar) {
    esconderResultados();
    document.body.classList.remove('busca-aberta');
    if (limpar) busca.campo.value = '';
    busca.campo.blur();
  }

  function atualizarBusca() {
    var q = busca.campo.value.trim();
    busca.lista.textContent = '';
    busca.ativo = -1;
    if (q.length < 2) {
      busca.resultados = [];
      busca.status.textContent = t('buscaDica');
      busca.painel.hidden = !q.length;
      busca.campo.setAttribute('aria-expanded', q.length ? 'true' : 'false');
      return;
    }
    busca.resultados = buscar(q);
    var n = busca.resultados.length;
    busca.status.textContent = n === 0 ? t('buscaSemResultados', { q: q }) : n === 1 ? t('buscaUmResultado') : t('buscaResultados', { n: n });
    busca.resultados.forEach(function (r, i) {
      var mod = MODULOS[r.item.mi];
      busca.lista.appendChild(el('li', {
        id: 'busca-op-' + i, role: 'option', class: 'busca-item', 'aria-selected': 'false',
        onmousedown: function (e) { e.preventDefault(); },
        onclick: function () { escolher(r.item); }
      }, [
        el('span', { class: 'busca-modulo', text: t('moduloN', { n: r.item.mi + 1 }) + ' · ' + mod.titulo }),
        el('strong', { class: 'busca-titulo', text: r.item.titulo }),
        el('span', { class: 'busca-trecho', html: trechoDestacado(r.item, r.termos) })
      ]));
    });
    busca.painel.hidden = false;
    busca.campo.setAttribute('aria-expanded', 'true');
  }

  function destacar(i) {
    var itens = busca.lista.children;
    if (!itens.length) return;
    busca.ativo = (i + itens.length) % itens.length;
    Array.prototype.forEach.call(itens, function (li, j) { li.setAttribute('aria-selected', j === busca.ativo ? 'true' : 'false'); });
    busca.campo.setAttribute('aria-activedescendant', itens[busca.ativo].id);
    itens[busca.ativo].scrollIntoView({ block: 'nearest' });
  }

  function escolher(item) {
    fecharBusca(false);
    if (item.mi !== indice) irPara(item.mi, false);
    var alvo = item.secao ? $(item.secao) : $('titulo-modulo');
    if (!alvo) return;
    alvo.scrollIntoView({ behavior: T.semMovimento() ? 'auto' : 'smooth', block: 'start' });
    alvo.classList.remove('is-encontrado');
    void alvo.offsetWidth;
    alvo.classList.add('is-encontrado');
    var foco = item.secao ? alvo.querySelector('h2, h3') || alvo : alvo;
    foco.setAttribute('tabindex', '-1');
    foco.focus({ preventScroll: true });
  }

  /* ---------- Inicialização ---------- */

  function montarInterface() {
    $('pular').textContent = t('pularParaConteudo');
    $('btn-menu-rotulo').textContent = t('abrirMenu');
    var brand = $('brand');
    brand.title = t('voltarCapa');
    brand.appendChild(T.marcaSite(32));
    brand.appendChild(el('span', { class: 'brand-text' }, [
      el('strong', { text: t('nomeSite') }),
      el('span', { class: 'brand-sub', text: t('subtitulo') })
    ]));
    $('sidebar-titulo').textContent = t('tituloModulos');
    $('dica-teclado').innerHTML = T.comTeclas(t('dicaTeclado'));
    var acoes = $('topbar-acoes');
    acoes.appendChild(el('a', { class: 'btn btn-sm', id: 'link-apresentar', href: 'apresentacao.html', title: t('apresentarModulo') }, [
      icone('slides', 16), el('span', { class: 'btn-label', text: t('apresentarCurto') })
    ]));
    acoes.appendChild(T.botaoTema());
    T.aplicarTema();
  }

  function configurarEventos() {
    $('btn-menu').addEventListener('click', function () {
      if (document.body.classList.contains('sidebar-open')) fecharMenu(true); else abrirMenu();
    });
    $('sidebar-backdrop').addEventListener('click', function () { fecharMenu(true); });
    $('lista-modulos').addEventListener('click', function () { fecharMenu(false); });
    window.addEventListener('hashchange', function () {
      var i = T.indicePorId(decodeURIComponent(location.hash.slice(1)));
      if (i >= 0 && i !== indice) irPara(i, true);
      else fecharMenu();
    });
    window.addEventListener('scroll', atualizarLeitura, { passive: true });
    window.addEventListener('resize', atualizarLeitura);
    document.addEventListener('keydown', aoTeclar);
  }

  var doHash = T.indicePorId(decodeURIComponent(location.hash.slice(1)));
  var salvo = T.indicePorId(T.lerEstado().estudo.modulo);
  indice = doHash >= 0 ? doHash : salvo >= 0 ? salvo : 0;

  montarInterface();
  montarBusca();
  configurarEventos();
  renderModulo(false);
})();
