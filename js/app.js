/* ==========================================================================
   Ambiente de Treinamento — motor de navegação e simulação
   Todo o conteúdo vem de window.CONTEUDO (js/content.js). Este arquivo não
   deve conter textos do treinamento, apenas lógica.
   ========================================================================== */
(function () {
  'use strict';

  var C = window.CONTEUDO;
  var raizModulo = document.getElementById('modulo');
  if (!C || !Array.isArray(C.modulos) || !C.modulos.length) {
    raizModulo.innerHTML = '<p class="aviso">Erro: js/content.js não foi carregado ou não tem módulos.</p>';
    return;
  }

  var UI = C.interface || {};
  var MARCA = C.marca || {};
  var MODULOS = C.modulos;
  var CHAVE_ARMAZENAMENTO = 'treinamento-cafe-serra:v1';
  var movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)');
  var painelFixo = window.matchMedia('(min-width: 1100px)');
  var temaEscuroSistema = window.matchMedia('(prefers-color-scheme: dark)');

  // Tempos das animações (ms)
  var TEMPO = {
    quadro: 30,
    digitacaoPorCaractere: 22, digitacaoMin: 600, digitacaoMax: 2000,
    antesDeEnviar: 280,
    carregandoSkill: 950,
    pensando: 750,
    streamingPorCaractere: 12, streamingMin: 700, streamingMax: 3200,
    toast: 2600
  };

  var estado = { indice: 0, modo: 'apresentacao', tema: 'auto' };
  var visitados = {};
  var avancaveis = [];
  var animacoesAtivas = [];
  var contadorId = 0;

  /* ---------- Utilitários ---------- */

  function t(chave, vars) {
    var s = UI[chave];
    if (s == null) s = chave;
    s = String(s);
    if (vars) s = s.replace(/\{(\w+)\}/g, function (_, k) { return vars[k] != null ? vars[k] : ''; });
    return s;
  }

  function novoId(prefixo) { contadorId += 1; return (prefixo || 'el') + '-' + contadorId; }
  function $(id) { return document.getElementById(id); }
  function limitar(v, min, max) { return Math.max(min, Math.min(max, v)); }
  function animacoesLigadas() { return estado.modo === 'apresentacao' && !movimentoReduzido.matches; }

  function el(tag, props, filhos) {
    var e = document.createElement(tag);
    if (props) {
      Object.keys(props).forEach(function (k) {
        var v = props[k];
        if (v == null || v === false) return;
        if (k === 'class') e.className = v;
        else if (k === 'text') e.textContent = v;
        else if (k === 'html') e.innerHTML = v;
        else if (k.indexOf('on') === 0) e.addEventListener(k.slice(2), v);
        else e.setAttribute(k, v === true ? '' : v);
      });
    }
    (filhos || []).forEach(function (f) {
      if (f == null || f === false) return;
      e.appendChild(typeof f === 'string' ? document.createTextNode(f) : f);
    });
    return e;
  }

  var SVG = {
    play: '<path d="M8 5v14l11-7z" fill="currentColor"/>',
    pular: '<path d="M5 5v14l9-7zM15 5h3v14h-3z" fill="currentColor"/>',
    reiniciar: '<path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4.5h4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    copiar: '<rect x="8" y="8" width="12" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" fill="none" stroke="currentColor" stroke-width="2"/>',
    externo: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    seta: '<path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    esquerda: '<path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
    direita: '<path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
    info: '<circle cx="12" cy="7.5" r="1.4" fill="currentColor"/><path d="M12 11v6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
    clipe: '<path d="M20 11.5l-7.8 7.8a5 5 0 0 1-7.1-7.1l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7l-8.5 8.5a1.7 1.7 0 0 1-2.4-2.4l7.8-7.8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    enviar: '<path d="M12 19V5M6 11l6-6 6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
    pasta: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    skill: '<path d="M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M14 3v5h5M9 13h6M9 17h4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>',
    carrossel: '<rect x="6" y="5" width="12" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M2.5 8v8M21.5 8v8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    post: '<rect x="4" y="4" width="16" height="16" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="9.5" cy="9.5" r="1.8" fill="currentColor"/><path d="M5 17l4.5-4.5 3 3 2.5-2.5 4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    email: '<rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3.5 6.5l8.5 6.5 8.5-6.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    imagem: '<rect x="3" y="4" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="9" cy="10" r="2" fill="currentColor"/><path d="M4 18l5-5 4 4 3-3 4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
    coracao: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    comentario: '<path d="M4 5h16v11H9l-5 4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    compartilhar: '<path d="M21 3L10 14M21 3l-7 18-4-7-7-4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    praticar: '<path d="M4 20l4-1 11-11-3-3L5 16zM14 6l3 3" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    assistente: '<path d="M12 3l1.9 4.6L18.5 9l-4.6 1.9L12 15.5l-1.9-4.6L5.5 9l4.6-1.4z" fill="currentColor"/><circle cx="18" cy="17" r="2" fill="currentColor"/>',
    grao: '<ellipse cx="12" cy="12" rx="7" ry="10" fill="currentColor"/><path d="M12 2.5c-3 4-3 15 0 19" fill="none" stroke="rgba(0,0,0,.35)" stroke-width="1.6"/>'
  };

  function icone(nome, tamanho, classe) {
    var s = tamanho || 18;
    return el('span', {
      class: 'ico' + (classe ? ' ' + classe : ''), 'aria-hidden': 'true',
      html: '<svg viewBox="0 0 24 24" width="' + s + '" height="' + s + '" focusable="false">' + (SVG[nome] || '') + '</svg>'
    });
  }

  function iconeArquivo(nome) {
    var ext = (String(nome).split('.').pop() || '').toLowerCase();
    var cores = { pdf: '#A33A2C', docx: '#2B5C9E', doc: '#2B5C9E', xlsx: '#2E7350', xls: '#2E7350', pptx: '#B4572B', png: '#6B4FA0', jpg: '#6B4FA0' };
    var cor = cores[ext] || '#6B6F76';
    var rotulo = ext.toUpperCase().slice(0, 4);
    return el('span', {
      class: 'file-ico', role: 'img', 'aria-label': t('arquivoTipo', { tipo: rotulo }),
      html: '<svg viewBox="0 0 32 36" width="28" height="32" aria-hidden="true"><path d="M4 2h17l7 7v23a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" fill="' + cor + '"/><path d="M21 2v7h7" fill="rgba(255,255,255,.35)"/><text x="15" y="27" text-anchor="middle" font-size="8.5" font-weight="700" font-family="system-ui,sans-serif" fill="#fff">' + rotulo + '</text></svg>'
    });
  }

  /* ---------- Mini-markdown ---------- */

  function escapar(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function inline(s) {
    return escapar(s)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[^*\w])\*(?!\s)([^*]+?)\*(?!\*)/g, '$1<em>$2</em>');
  }

  function markdown(texto) {
    var linhas = String(texto == null ? '' : texto).replace(/\r\n?/g, '\n').split('\n');
    var html = [], paragrafo = [], lista = null;
    function fecharParagrafo() {
      if (paragrafo.length) { html.push('<p>' + paragrafo.map(inline).join('<br>') + '</p>'); paragrafo = []; }
    }
    function fecharLista() {
      if (lista) {
        html.push('<' + lista.tag + '>' + lista.itens.map(function (i) { return '<li>' + inline(i) + '</li>'; }).join('') + '</' + lista.tag + '>');
        lista = null;
      }
    }
    linhas.forEach(function (linha) {
      var m;
      if (/^\s*$/.test(linha)) { fecharParagrafo(); fecharLista(); return; }
      if ((m = linha.match(/^\s*[-•]\s+(.*)$/))) {
        fecharParagrafo();
        if (!lista || lista.tag !== 'ul') { fecharLista(); lista = { tag: 'ul', itens: [] }; }
        lista.itens.push(m[1]); return;
      }
      if ((m = linha.match(/^\s*\d+[.)]\s+(.*)$/))) {
        fecharParagrafo();
        if (!lista || lista.tag !== 'ol') { fecharLista(); lista = { tag: 'ol', itens: [] }; }
        lista.itens.push(m[1]); return;
      }
      if ((m = linha.match(/^#{1,4}\s+(.*)$/))) {
        fecharParagrafo(); fecharLista(); html.push('<h4>' + inline(m[1]) + '</h4>'); return;
      }
      fecharLista();
      paragrafo.push(linha);
    });
    fecharParagrafo(); fecharLista();
    return html.join('');
  }

  function textoPuro(s) {
    return String(s == null ? '' : s)
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/(^|[^*\w])\*(?!\s)([^*]+?)\*(?!\*)/g, '$1$2')
      .replace(/^#{1,4}\s+/gm, '');
  }

  function md(texto, classe) { return el('div', { class: 'md' + (classe ? ' ' + classe : ''), html: markdown(texto) }); }

  /* ---------- Armazenamento ---------- */

  function carregarEstado() {
    var salvo = null;
    try { salvo = JSON.parse(window.localStorage.getItem(CHAVE_ARMAZENAMENTO) || 'null'); } catch (e) { salvo = null; }
    if (salvo && typeof salvo === 'object') {
      var i = indicePorId(salvo.modulo);
      if (i >= 0) estado.indice = i;
      if (salvo.modo === 'estudo' || salvo.modo === 'apresentacao') estado.modo = salvo.modo;
      if (salvo.tema === 'claro' || salvo.tema === 'escuro' || salvo.tema === 'auto') estado.tema = salvo.tema;
      if (Array.isArray(salvo.visitados)) salvo.visitados.forEach(function (id) { visitados[id] = true; });
    }
    var doHash = indicePorId(decodeURIComponent(location.hash.slice(1)));
    if (doHash >= 0) estado.indice = doHash;
  }

  function salvarEstado() {
    try {
      window.localStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify({
        modulo: MODULOS[estado.indice].id, modo: estado.modo, tema: estado.tema, visitados: Object.keys(visitados)
      }));
    } catch (e) { /* armazenamento indisponível: segue sem lembrar */ }
  }

  function indicePorId(id) {
    if (!id) return -1;
    for (var i = 0; i < MODULOS.length; i++) if (MODULOS[i].id === id) return i;
    return -1;
  }

  /* ---------- Toast e cópia ---------- */

  var temporizadorToast = null;
  function toast(msg) {
    var tEl = $('toast');
    tEl.textContent = msg;
    tEl.classList.add('is-visible');
    clearTimeout(temporizadorToast);
    temporizadorToast = setTimeout(function () { tEl.classList.remove('is-visible'); }, TEMPO.toast);
  }

  function copiar(texto, mensagemOk) {
    function alternativo() {
      var ativo = document.activeElement;
      var ta = el('textarea', { readonly: true, 'aria-hidden': 'true', style: 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;' });
      ta.value = texto;
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      if (ativo && ativo.focus) ativo.focus({ preventScroll: true });
      return ok;
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(texto).then(function () { toast(mensagemOk); }, function () {
        toast(alternativo() ? mensagemOk : t('erroCopiar'));
      });
    } else {
      toast(alternativo() ? mensagemOk : t('erroCopiar'));
    }
  }

  function botaoCopiar(rotulo, obterTexto, mensagemOk, classe) {
    return el('button', {
      type: 'button', class: classe || 'btn',
      onclick: function () { copiar(obterTexto(), mensagemOk); }
    }, [icone('copiar'), el('span', { text: rotulo })]);
  }

  /* ---------- Animação cancelável ---------- */

  function Animacao() { this.pulado = false; this.cancelado = false; this._acordar = null; }
  Animacao.prototype.pausa = function (ms) {
    var self = this;
    return new Promise(function (resolver) {
      if (self.pulado || self.cancelado) { resolver(); return; }
      var id = setTimeout(fim, ms);
      function fim() { clearTimeout(id); if (self._acordar === fim) self._acordar = null; resolver(); }
      self._acordar = fim;
    });
  };
  Animacao.prototype.pular = function () { this.pulado = true; if (this._acordar) this._acordar(); };
  Animacao.prototype.cancelar = function () { this.cancelado = true; this.pular(); };

  function novaAnimacao() { var a = new Animacao(); animacoesAtivas.push(a); return a; }
  function cancelarAnimacoes() { animacoesAtivas.forEach(function (a) { a.cancelar(); }); animacoesAtivas = []; }

  /* Revela progressivamente um HTML já formatado, truncando seus nós de texto. */
  function prepararStreaming(container) {
    var nos = [];
    var walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
    while (walker.nextNode()) nos.push({ no: walker.currentNode, chars: Array.from(walker.currentNode.data) });
    var total = nos.reduce(function (s, n) { return s + n.chars.length; }, 0);
    var blocos = Array.prototype.slice.call(container.querySelectorAll('p, li, h4, ul, ol'));
    function mostrar(n) {
      var resto = n;
      nos.forEach(function (x) {
        var k = limitar(resto, 0, x.chars.length);
        x.no.data = x.chars.slice(0, k).join('');
        resto -= x.chars.length;
      });
      blocos.forEach(function (b) { b.hidden = b.textContent.length === 0; });
    }
    return { total: total, mostrar: mostrar };
  }

  function rolarPara(elemento) {
    if (!elemento || !elemento.scrollIntoView) return;
    elemento.scrollIntoView({ block: 'nearest', behavior: movimentoReduzido.matches ? 'auto' : 'smooth' });
  }

  /* ---------- Mensagens ---------- */

  function renderAnexo(anexo) {
    var filhos = [el('div', { class: 'attachment-head' }, [iconeArquivo(anexo.nome), el('span', { class: 'attachment-name', text: anexo.nome })])];
    if (anexo.conteudo) {
      filhos.push(el('details', null, [
        el('summary', { text: t('anexoVerConteudo') }),
        el('div', { class: 'attachment-body' }, [md(anexo.conteudo)])
      ]));
    }
    return el('div', { class: 'attachment' }, filhos);
  }

  function renderSelo(nome, carregando) {
    var selo = el('div', { class: 'skill-badge' + (carregando ? ' is-loading' : '') });
    preencherSelo(selo, nome, carregando);
    return selo;
  }
  function preencherSelo(selo, nome, carregando) {
    selo.textContent = '';
    selo.classList.toggle('is-loading', !!carregando);
    if (carregando) {
      selo.appendChild(el('span', { class: 'spinner', 'aria-hidden': 'true' }));
      selo.appendChild(el('span', { text: t('carregandoSkill') }));
    } else {
      selo.appendChild(icone('check', 16));
      selo.appendChild(el('span', { text: t('skillEmUso') + ' ' }));
      selo.appendChild(el('strong', { text: nome }));
    }
  }

  var ICONE_ARTEFATO = { carrossel: 'carrossel', post: 'post', email: 'email' };

  function renderChipsArtefatos(artefatos) {
    return el('div', { class: 'artifact-chips' }, artefatos.map(function (a, i) {
      return el('button', {
        type: 'button', class: 'artifact-chip',
        onclick: function (ev) { abrirPainel(artefatos, i, { focar: true, origem: ev.currentTarget }); }
      }, [
        el('span', { class: 'artifact-chip-ico' }, [icone(ICONE_ARTEFATO[a.tipo] || 'post', 20)]),
        el('span', { class: 'artifact-chip-text' }, [
          el('strong', { text: a.titulo || t('artefato') }),
          el('span', { text: t('tipo_' + a.tipo) + ' · ' + t('abrirArtefato') })
        ])
      ]);
    }));
  }

  function renderMensagem(m, opcoes) {
    opcoes = opcoes || {};
    var ehAluna = m.autor === 'aluna';
    var principal = el('div', { class: 'msg-main' });
    var meta = el('div', { class: 'msg-meta' }, [el('span', { class: 'msg-author', text: ehAluna ? t('voce') : t('assistente') })]);
    principal.appendChild(meta);

    var nota = null;
    if (m.nota && !opcoes.animando) {
      var idNota = novoId('nota');
      var aberta = estado.modo === 'estudo';
      nota = el('div', { class: 'msg-note', id: idNota, hidden: !aberta }, [
        el('span', { class: 'msg-note-title', text: t('notaInstrutor') }), md(m.nota)
      ]);
      var botaoNota = el('button', {
        type: 'button', class: 'note-btn', 'aria-expanded': aberta ? 'true' : 'false', 'aria-controls': idNota,
        title: t('mostrarNota'),
        onclick: function () {
          var abrir = botaoNota.getAttribute('aria-expanded') !== 'true';
          botaoNota.setAttribute('aria-expanded', abrir ? 'true' : 'false');
          nota.hidden = !abrir;
        }
      }, [icone('info', 14), el('span', { class: 'sr-only', text: t('mostrarNota') })]);
      meta.appendChild(botaoNota);
    }

    if (ehAluna && m.anexo) principal.appendChild(renderAnexo(m.anexo));

    var selo = null;
    if (!ehAluna && m.skill) { selo = renderSelo(m.skill, !!opcoes.animando); principal.appendChild(selo); }

    var bolha = el('div', { class: 'msg-bubble' });
    if (!opcoes.animando) bolha.appendChild(el('div', { class: 'msg-content md', html: markdown(m.texto) }));
    principal.appendChild(bolha);

    if (!ehAluna && m.artefatos && m.artefatos.length && !opcoes.animando) principal.appendChild(renderChipsArtefatos(m.artefatos));
    if (nota) principal.appendChild(nota);

    var avatar = el('div', { class: 'msg-avatar', 'aria-hidden': 'true' }, [ehAluna ? t('iniciaisVoce') : icone('assistente', 18)]);
    var raiz = el('div', { class: 'msg msg-' + (ehAluna ? 'aluna' : 'assistente') + (opcoes.entrada ? ' msg-enter' : '') }, [avatar, principal]);
    return { elemento: raiz, bolha: bolha, selo: selo };
  }

  /* ---------- Chat roteirizado ---------- */

  function criarChat(conversa, opcoes) {
    opcoes = opcoes || {};
    var mensagens = conversa.mensagens || [];
    var apresentacao = estado.modo === 'apresentacao';
    var mostradas = 0;
    var anim = null;
    var promessaAtual = null;
    var idTitulo = novoId('chat-titulo');

    var raiz = el('section', {
      class: 'chat' + (opcoes.compacto ? ' chat-compacto' : ''),
      'aria-labelledby': conversa.titulo ? idTitulo : null,
      'aria-label': conversa.titulo ? null : t('conversa')
    });
    if (conversa.titulo) raiz.appendChild(el('div', { class: 'chat-head' }, [el('h3', { id: idTitulo, text: conversa.titulo })]));
    if (conversa.contexto) raiz.appendChild(el('p', { class: 'chat-context', text: conversa.contexto }));

    var log = el('div', { class: 'chat-log', role: 'log', 'aria-live': 'polite', 'aria-label': t('mensagens') });
    raiz.appendChild(log);

    var dica, composer, composerAnexo, composerTexto, controles, btnAvancar, btnAvancarTexto, btnPular, btnReiniciar;

    if (apresentacao) {
      dica = el('p', { class: 'chat-hint', html: escapar(t('dicaChat')).replace(/\[(.+?)\]/g, '<span class="kbd">$1</span>') });
      raiz.appendChild(dica);

      composerAnexo = el('div', { class: 'composer-attachment', hidden: true });
      composerTexto = el('div', { class: 'composer-text', 'data-placeholder': t('campoPlaceholder') });
      composer = el('div', { class: 'composer', 'aria-hidden': 'true' }, [
        composerAnexo,
        el('div', { class: 'composer-row' }, [icone('clipe', 18, 'composer-clip'), composerTexto, icone('enviar', 18, 'composer-send')])
      ]);
      raiz.appendChild(composer);

      btnAvancarTexto = el('span');
      btnAvancar = el('button', { type: 'button', class: 'btn btn-primary btn-sm', 'data-blur-on-click': true, onclick: function () { avancar(); } }, [icone('play', 16), btnAvancarTexto]);
      btnPular = el('button', { type: 'button', class: 'btn btn-sm', 'data-blur-on-click': true, onclick: function () { pularTudo(); } }, [icone('pular', 16), el('span', { text: t('pularAnimacao') })]);
      btnReiniciar = el('button', { type: 'button', class: 'btn btn-sm btn-ghost', 'data-blur-on-click': true, onclick: function () { reiniciar(); } }, [icone('reiniciar', 16), el('span', { text: t('reiniciar') })]);
      controles = el('div', { class: 'chat-controls' }, [btnAvancar, btnPular, btnReiniciar]);
      raiz.appendChild(controles);
    }

    function atualizarControles() {
      if (!apresentacao) return;
      var fim = mostradas >= mensagens.length && !anim;
      btnAvancarTexto.textContent = fim ? t('fimConversa')
        : anim ? t('concluirMensagem')
        : t('avancar') + ' (' + (mostradas + 1) + '/' + mensagens.length + ')';
      btnAvancar.disabled = fim;
      btnPular.disabled = fim;
      btnReiniciar.disabled = mostradas === 0 && !anim;
      dica.hidden = mostradas > 0;
    }

    function limparComposer() {
      composerTexto.textContent = '';
      composerAnexo.hidden = true;
      composer.classList.remove('is-typing');
    }

    function aoFinalizarMensagem(m, autoAbrir) {
      if (autoAbrir && apresentacao && m.artefatos && m.artefatos.length && painelFixo.matches) {
        abrirPainel(m.artefatos, 0, { focar: false });
      }
    }

    function renderDireto(m, autoAbrir) {
      log.appendChild(renderMensagem(m, { entrada: apresentacao }).elemento);
      aoFinalizarMensagem(m, autoAbrir);
    }

    async function animarMensagem(m, a) {
      var i, passos;
      if (m.autor === 'aluna') {
        if (m.anexo) {
          composerAnexo.textContent = '';
          composerAnexo.appendChild(icone('clipe', 14));
          composerAnexo.appendChild(document.createTextNode(m.anexo.nome));
          composerAnexo.hidden = false;
        }
        composer.classList.add('is-typing');
        var chars = Array.from(textoPuro(m.texto));
        var duracao = limitar(chars.length * TEMPO.digitacaoPorCaractere, TEMPO.digitacaoMin, TEMPO.digitacaoMax);
        passos = Math.max(1, Math.round(duracao / TEMPO.quadro));
        rolarPara(controles);
        for (i = 1; i <= passos && !a.pulado; i++) {
          composerTexto.textContent = chars.slice(0, Math.round(chars.length * i / passos)).join('');
          composerTexto.scrollTop = composerTexto.scrollHeight;
          await a.pausa(TEMPO.quadro);
        }
        if (a.cancelado) return;
        composerTexto.textContent = chars.join('');
        await a.pausa(TEMPO.antesDeEnviar);
        if (a.cancelado) return;
        limparComposer();
        log.appendChild(renderMensagem(m, { entrada: true }).elemento);
        rolarPara(controles);
        return;
      }

      // Assistente: versão animada provisória (oculta de leitores de tela)
      var provisoria = renderMensagem(m, { animando: true, entrada: true });
      provisoria.elemento.setAttribute('aria-hidden', 'true');
      log.appendChild(provisoria.elemento);
      rolarPara(controles);

      if (m.skill) {
        await a.pausa(TEMPO.carregandoSkill);
        if (a.cancelado) return;
        preencherSelo(provisoria.selo, m.skill, false);
        provisoria.selo.classList.add('is-just-loaded');
      }

      provisoria.bolha.appendChild(el('div', { class: 'thinking' }, [
        el('span', { class: 'dots' }, [el('i'), el('i'), el('i')]), el('span', { text: t('pensando') })
      ]));
      await a.pausa(TEMPO.pensando);
      if (a.cancelado) return;

      var conteudo = el('div', { class: 'msg-content md caret', html: markdown(m.texto) });
      provisoria.bolha.textContent = '';
      provisoria.bolha.appendChild(conteudo);
      var stream = prepararStreaming(conteudo);
      stream.mostrar(0);
      var duracaoStream = limitar(stream.total * TEMPO.streamingPorCaractere, TEMPO.streamingMin, TEMPO.streamingMax);
      passos = Math.max(1, Math.round(duracaoStream / TEMPO.quadro));
      for (i = 1; i <= passos && !a.pulado; i++) {
        stream.mostrar(Math.round(stream.total * i / passos));
        if (i % 6 === 0) rolarPara(controles);
        await a.pausa(TEMPO.quadro);
      }
      if (a.cancelado) return;

      // Troca pela versão final (gera um único anúncio no aria-live)
      var final = renderMensagem(m, {});
      log.replaceChild(final.elemento, provisoria.elemento);
      if (final.selo && !a.pulado) final.selo.classList.add('is-just-loaded');
      rolarPara(controles);
      aoFinalizarMensagem(m, true);
    }

    function avancar() {
      if (anim) { anim.pular(); return promessaAtual; }
      if (mostradas >= mensagens.length) return Promise.resolve();
      if (opcoes.aoAvancar) opcoes.aoAvancar();
      var m = mensagens[mostradas];
      mostradas += 1;
      if (!animacoesLigadas()) {
        renderDireto(m, true);
        atualizarControles();
        rolarPara(controles);
        return Promise.resolve();
      }
      var a = novaAnimacao();
      anim = a;
      atualizarControles();
      promessaAtual = animarMensagem(m, a).then(terminar, terminar);
      function terminar() {
        if (anim === a) { anim = null; promessaAtual = null; }
        if (!a.cancelado) atualizarControles();
      }
      return promessaAtual;
    }

    function pularTudo() {
      var espera = anim ? (anim.pular(), promessaAtual) : Promise.resolve();
      return Promise.resolve(espera).then(function () {
        var ultimaComArtefato = null;
        while (mostradas < mensagens.length) {
          var m = mensagens[mostradas];
          mostradas += 1;
          renderDireto(m, false);
          if (m.artefatos && m.artefatos.length) ultimaComArtefato = m;
        }
        if (ultimaComArtefato) aoFinalizarMensagem(ultimaComArtefato, true);
        atualizarControles();
        rolarPara(controles);
      });
    }

    function reiniciar() {
      if (anim) { anim.cancelar(); anim = null; promessaAtual = null; }
      mostradas = 0;
      log.textContent = '';
      limparComposer();
      atualizarControles();
      rolarPara(raiz);
    }

    if (apresentacao) {
      atualizarControles();
    } else {
      mensagens.forEach(function (m) { log.appendChild(renderMensagem(m, {}).elemento); });
      mostradas = mensagens.length;
    }

    return {
      elemento: raiz,
      avancar: avancar,
      concluido: function () { return mostradas >= mensagens.length && !anim; },
      pularTudo: pularTudo,
      reiniciar: reiniciar
    };
  }

  /* ---------- Blocos ---------- */

  function tituloBloco(b, nivel) {
    return b.titulo ? el(nivel || 'h2', { class: 'block-title', text: b.titulo }) : null;
  }

  var RENDERIZADORES = {
    'texto': function (b) {
      return el('section', { class: 'block' }, [tituloBloco(b), md(b.texto, 'block-text')]);
    },

    'destaque': function (b) {
      return el('section', { class: 'block' }, [
        el('div', { class: 'callout' + (b.cor === 'verde' ? ' is-green' : '') }, [
          b.icone ? el('span', { class: 'callout-icon', 'aria-hidden': 'true', text: b.icone }) : null,
          el('div', null, [b.titulo ? el('h2', { class: 'callout-title', text: b.titulo }) : null, md(b.texto)])
        ])
      ]);
    },

    'cards': function (b) {
      return el('section', { class: 'block' }, [
        tituloBloco(b),
        b.texto ? md(b.texto, 'block-intro') : null,
        el('div', { class: 'cards', 'data-count': String((b.itens || []).length) }, (b.itens || []).map(function (c) {
          return el('article', { class: 'card' }, [
            c.icone ? el('div', { class: 'card-icon', 'aria-hidden': 'true', text: c.icone }) : null,
            el('h3', { text: c.titulo }),
            md(c.texto)
          ]);
        }))
      ]);
    },

    'visao-geral': function (b) {
      return el('section', { class: 'block' }, [
        tituloBloco(b),
        el('ol', { class: 'overview' }, MODULOS.map(function (mod, i) {
          return el('li', null, [
            el('a', { class: 'overview-link', href: '#' + mod.id, 'data-blur-on-click': true }, [
              el('span', { class: 'module-num', 'aria-hidden': 'true', text: String(i + 1) }),
              el('span', { class: 'overview-text' }, [
                el('strong', { text: mod.titulo }),
                mod.resumo ? el('span', { text: mod.resumo }) : null
              ]),
              icone('seta', 18, 'overview-arrow')
            ])
          ]);
        }))
      ]);
    },

    'chat': function (b, ctx) {
      var chat = criarChat(b);
      ctx.registrar(chat);
      return el('section', { class: 'block' }, [b.tituloBloco ? el('h2', { class: 'block-title', text: b.tituloBloco }) : null, chat.elemento]);
    },

    'comparativo': function (b, ctx) {
      var lados = ['antes', 'depois'];
      var abas = el('div', { class: 'tabs compare-tabs', role: 'tablist', 'aria-label': b.titulo || t('comparativo') });
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
        var idAba = novoId('aba'), idPainel = novoId('painel');
        var botao = el('button', {
          type: 'button', role: 'tab', id: idAba, class: 'tab', 'aria-controls': idPainel,
          onclick: function () { ativar(i, false); }
        }, [rotulo]);
        var chat = criarChat({ titulo: dados.titulo, contexto: dados.contexto, mensagens: dados.mensagens }, {
          compacto: true, aoAvancar: function () { ativar(i, false); }
        });
        ctx.registrar(chat);
        var coluna = el('div', { class: 'compare-col compare-' + lado, id: idPainel, role: 'tabpanel', 'aria-labelledby': idAba }, [
          el('span', { class: 'compare-label', 'aria-hidden': 'true', text: rotulo }),
          chat.elemento
        ]);
        botoes.push(botao); paineis.push(coluna);
        abas.appendChild(botao); colunas.appendChild(coluna);
      });

      abas.addEventListener('keydown', function (e) {
        var atual = botoes.indexOf(document.activeElement);
        if (atual < 0) return;
        var alvo = null;
        if (e.key === 'ArrowRight') alvo = (atual + 1) % botoes.length;
        else if (e.key === 'ArrowLeft') alvo = (atual - 1 + botoes.length) % botoes.length;
        else if (e.key === 'Home') alvo = 0;
        else if (e.key === 'End') alvo = botoes.length - 1;
        if (alvo != null) { e.preventDefault(); ativar(alvo, true); }
      });

      ativar(0, false);
      return el('section', { class: 'block compare' }, [tituloBloco(b), b.texto ? md(b.texto, 'block-intro') : null, abas, colunas]);
    },

    'projeto': function (b) {
      return el('section', { class: 'block' }, [
        tituloBloco(b),
        el('article', { class: 'project', 'aria-label': t('projeto') + ': ' + b.nome }, [
          el('div', { class: 'project-head' }, [
            el('span', { class: 'project-ico' }, [icone('pasta', 22)]),
            el('div', null, [
              el('p', { class: 'project-kicker', text: t('projeto') }),
              el('h3', { class: 'project-name', text: b.nome }),
              b.descricao ? el('p', { class: 'project-desc', text: b.descricao }) : null
            ])
          ]),
          el('div', { class: 'project-grid' }, [
            el('div', { class: 'project-section' }, [
              el('h4', { text: t('instrucoesProjeto') }),
              md(b.instrucoes, 'project-instructions')
            ]),
            el('div', { class: 'project-section' }, [
              el('h4', { text: t('arquivosConhecimento') }),
              el('ul', { class: 'file-list' }, (b.arquivos || []).map(function (a) {
                return el('li', { class: 'file-item' }, [
                  iconeArquivo(a.nome),
                  el('span', { class: 'file-name', text: a.nome }),
                  a.tamanho ? el('span', { class: 'file-size', text: a.tamanho }) : null
                ]);
              }))
            ])
          ])
        ])
      ]);
    },

    'skill': function (b) {
      return el('section', { class: 'block' }, [
        tituloBloco(b),
        b.texto ? md(b.texto, 'block-intro') : null,
        el('article', { class: 'skill-file', 'aria-label': t('skill') + ': ' + b.nome }, [
          el('div', { class: 'skill-file-tab' }, [icone('skill', 16), el('span', null, [b.nome + ' / ', el('strong', { text: t('skillArquivo') })])]),
          el('dl', { class: 'skill-fields' }, [
            el('div', null, [el('dt', { text: t('skillNome') }), el('dd', null, [el('code', { text: b.nome })])]),
            el('div', null, [el('dt', { text: t('skillDescricao') }), el('dd', { text: b.descricao })]),
            el('div', null, [el('dt', { text: t('skillInstrucoes') }), el('dd', null, [
              el('ul', null, (b.instrucoes || []).map(function (i) { return el('li', { html: inline(i) }); }))
            ])])
          ])
        ])
      ]);
    },

    'tabela': function (b) {
      var colunas = b.colunas || [];
      return el('section', { class: 'block' }, [
        tituloBloco(b),
        el('div', { class: 'table-wrap' }, [
          el('table', { class: 'table' }, [
            el('thead', null, [el('tr', null, colunas.map(function (c, i) {
              return el('th', { scope: 'col' }, [c || (i === 0 ? el('span', { class: 'sr-only', text: t('aspecto') }) : '')]);
            }))]),
            el('tbody', null, (b.linhas || []).map(function (linha) {
              return el('tr', null, linha.map(function (cel, i) {
                return i === 0 ? el('th', { scope: 'row', html: inline(cel) }) : el('td', { 'data-label': colunas[i] || '', html: inline(cel) });
              }));
            }))
          ])
        ])
      ]);
    },

    'tour': function (b, ctx) { return renderTour(b, ctx); },

    'pratica': function (b) {
      return el('section', { class: 'block' }, [
        el('div', { class: 'practice' }, [
          el('div', { class: 'practice-head' }, [
            el('span', { class: 'practice-ico' }, [icone('praticar', 20)]),
            el('h2', { text: b.titulo || t('agoraTente') })
          ]),
          b.texto ? md(b.texto, 'practice-text') : null,
          el('pre', { class: 'prompt-box', text: b.prompt }),
          el('div', { class: 'practice-actions' }, [
            botaoCopiar(t('copiarPrompt'), function () { return b.prompt; }, t('promptCopiado'), 'btn btn-primary'),
            el('a', { class: 'btn', href: b.link || 'https://claude.ai', target: '_blank', rel: 'noopener noreferrer' }, [
              el('span', { text: t('abrirClaude') }), icone('externo', 16), el('span', { class: 'sr-only', text: ' ' + t('novaAba') })
            ])
          ])
        ])
      ]);
    },

    'links': function (b) {
      return el('section', { class: 'block' }, [
        tituloBloco(b),
        el('ul', { class: 'links' }, (b.itens || []).map(function (l) {
          return el('li', null, [
            el('a', { class: 'link-card', href: l.url, target: '_blank', rel: 'noopener noreferrer' }, [
              el('span', null, [
                el('strong', { text: l.rotulo }),
                l.descricao ? el('span', { class: 'link-desc', text: l.descricao }) : null,
                el('span', { class: 'link-url', text: l.url.replace(/^https?:\/\//, '') })
              ]),
              icone('externo', 18, 'ext'),
              el('span', { class: 'sr-only', text: ' ' + t('novaAba') })
            ])
          ]);
        }))
      ]);
    }
  };

  /* ---------- Tour da interface ---------- */

  function renderTour(b, ctx) {
    var passos = b.passos || [];
    var ui = b.interfaceSimulada || {};
    var estudo = estado.modo === 'estudo';
    var atual = -1;
    var alvos = {};

    function alvo(id, classe, filhos) {
      var e = el('div', { class: classe, 'data-alvo': id }, filhos);
      alvos[id] = e;
      return e;
    }
    function lista(itens) {
      return el('ul', null, (itens || []).map(function (i) { return el('li', { text: i }); }));
    }

    var mock = el('div', { class: 'mock', role: 'group', 'aria-label': t('interfaceSimulada') }, [
      el('div', { class: 'mock-titlebar', 'aria-hidden': 'true' }, [el('span', { class: 'mock-dots' }, [el('i'), el('i'), el('i')]), el('span', { text: ui.nomeApp || '' })]),
      el('div', { class: 'mock-body' }, [
        el('div', { class: 'mock-sidebar' }, [
          el('div', { class: 'mock-new', text: '+ ' + (ui.novaConversa || '') }),
          alvo('projetos', 'mock-section', [el('p', { class: 'mock-label', text: ui.projetosRotulo || '' }), lista(ui.projetos)]),
          alvo('historico', 'mock-section', [el('p', { class: 'mock-label', text: ui.historicoRotulo || '' }), lista(ui.historico)])
        ]),
        el('div', { class: 'mock-main' }, [
          el('p', { class: 'mock-greeting', text: ui.saudacao || '' }),
          el('div', { class: 'mock-input' }, [
            alvo('campo-mensagem', 'mock-field', [ui.placeholder || '']),
            el('div', { class: 'mock-actions' }, [
              alvo('anexar', 'mock-attach', [icone('clipe', 16), el('span', { text: ui.anexarRotulo || '' })]),
              el('span', { class: 'mock-send', 'aria-hidden': 'true' }, [icone('enviar', 16)])
            ])
          ])
        ])
      ])
    ]);

    var marcadores = passos.map(function (p, i) {
      var m = el('span', { class: 'tour-marker', 'aria-hidden': 'true', text: String(i + 1), hidden: !estudo });
      if (alvos[p.alvo]) alvos[p.alvo].appendChild(m);
      return m;
    });

    var secao = el('section', { class: 'block tour' }, [tituloBloco(b), b.texto ? md(b.texto, 'block-intro') : null]);
    var palco = el('div', { class: 'tour-stage' }, [mock]);
    secao.appendChild(palco);

    if (estudo) {
      secao.appendChild(el('ol', { class: 'tour-list' }, passos.map(function (p, i) {
        return el('li', null, [el('span', { class: 'tour-num', 'aria-hidden': 'true', text: String(i + 1) }), el('div', null, [el('strong', { text: p.titulo }), md(p.texto)])]);
      })));
      return secao;
    }

    var passoEl = el('p', { class: 'tour-step' });
    var tituloEl = el('h3');
    var textoEl = el('div');
    var callout = el('div', { class: 'tour-callout', 'aria-live': 'polite' }, [passoEl, tituloEl, textoEl]);
    var btnVoltar = el('button', { type: 'button', class: 'btn btn-sm', 'data-blur-on-click': true, onclick: function () { mostrar(atual - 1); } }, [icone('esquerda', 16), el('span', { text: t('tourAnterior') })]);
    var btnProximoTexto = el('span');
    var btnProximo = el('button', { type: 'button', class: 'btn btn-sm btn-primary', 'data-blur-on-click': true, onclick: function () { mostrar(atual + 1); } }, [btnProximoTexto, icone('direita', 16)]);
    var btnRecomecar = el('button', { type: 'button', class: 'btn btn-sm btn-ghost', 'data-blur-on-click': true, onclick: function () { mostrar(-1); } }, [icone('reiniciar', 16), el('span', { text: t('tourRecomecar') })]);
    callout.appendChild(el('div', { class: 'tour-controls' }, [btnProximo, btnVoltar, btnRecomecar]));
    secao.appendChild(callout);

    function mostrar(i) {
      atual = limitar(i, -1, passos.length - 1);
      passos.forEach(function (p, j) {
        if (alvos[p.alvo]) alvos[p.alvo].classList.toggle('is-highlight', j === atual);
        marcadores[j].hidden = j !== atual;
      });
      if (atual < 0) {
        passoEl.textContent = t('tourTitulo');
        tituloEl.textContent = t('tourIntroTitulo');
        textoEl.innerHTML = markdown(t('tourIntroTexto'));
      } else {
        var p = passos[atual];
        passoEl.textContent = t('tourPasso', { atual: atual + 1, total: passos.length });
        tituloEl.textContent = p.titulo;
        textoEl.innerHTML = markdown(p.texto);
      }
      btnProximoTexto.textContent = atual < 0 ? t('tourIniciar') : t('tourProximo');
      btnProximo.disabled = atual >= passos.length - 1;
      btnVoltar.disabled = atual < 0;
      btnRecomecar.disabled = atual < 0;
    }
    mostrar(-1);

    ctx.registrar({
      elemento: secao,
      avancar: function () { mostrar(atual + 1); rolarPara(callout); },
      concluido: function () { return atual >= passos.length - 1; }
    });
    return secao;
  }

  /* ---------- Artefatos ---------- */

  var painel = { artefatos: null, indice: 0, retorno: null };

  function renderCarrossel(a) {
    var slides = a.slides || [];
    var atual = 0;
    var slideEl = el('div', { class: 'slide' });
    var contador = el('span', { class: 'slide-count', 'aria-live': 'polite' });
    var btnAnt = el('button', { type: 'button', class: 'icon-btn', onclick: function () { ir(atual - 1); } }, [icone('esquerda', 20), el('span', { class: 'sr-only', text: t('slideAnterior') })]);
    var btnProx = el('button', { type: 'button', class: 'icon-btn', onclick: function () { ir(atual + 1); } }, [icone('direita', 20), el('span', { class: 'sr-only', text: t('slideProximo') })]);
    var pontos = slides.map(function (_, i) {
      return el('button', { type: 'button', class: 'slide-dot', 'aria-label': t('irParaSlide', { n: i + 1 }), onclick: function () { ir(i); } });
    });

    function ir(i) {
      atual = limitar(i, 0, slides.length - 1);
      slideEl.className = 'slide v' + (atual % 3) + (atual === 0 ? ' is-hook' : '');
      slideEl.textContent = '';
      slideEl.appendChild(el('span', { class: 'slide-num', 'aria-hidden': 'true', text: (atual + 1) + '/' + slides.length }));
      slideEl.appendChild(el('p', { html: inline(slides[atual]) }));
      slideEl.appendChild(el('span', { class: 'slide-brand', 'aria-hidden': 'true', text: MARCA.nome || '' }));
      slideEl.appendChild(el('span', { class: 'slide-bean', 'aria-hidden': 'true', html: '<svg viewBox="0 0 24 24">' + SVG.grao + '</svg>' }));
      contador.textContent = t('slideDe', { atual: atual + 1, total: slides.length });
      btnAnt.disabled = atual === 0;
      btnProx.disabled = atual === slides.length - 1;
      pontos.forEach(function (p, j) { p.setAttribute('aria-current', j === atual ? 'true' : 'false'); });
    }

    var carrossel = el('div', {
      class: 'carousel', role: 'region', 'aria-roledescription': t('carrossel'), 'aria-label': a.titulo || t('tipo_carrossel'),
      tabindex: '0', 'data-keys': 'local',
      onkeydown: function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); ir(atual + 1); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); ir(atual - 1); }
      }
    }, [
      el('div', { class: 'slide-frame' }, [slideEl]),
      el('div', { class: 'carousel-nav' }, [btnAnt, contador, btnProx]),
      el('div', { class: 'slide-dots' }, pontos)
    ]);
    ir(0);

    var filhos = [carrossel];
    if (a.legenda || (a.hashtags && a.hashtags.length)) {
      filhos.push(el('div', { class: 'caption-box' }, [
        el('h3', { text: t('legenda') }),
        a.legenda ? md(a.legenda) : null,
        a.hashtags && a.hashtags.length ? el('p', { class: 'hashtags', text: a.hashtags.join(' ') }) : null
      ]));
    }
    return el('div', null, filhos);
  }

  function renderPost(a) {
    var posts = a.posts || [];
    return el('div', null, posts.map(function (p, i) {
      return el('div', null, [
        posts.length > 1 ? el('p', { class: 'post-variant', text: t('legendaN', { n: i + 1, total: posts.length }) }) : null,
        el('article', { class: 'social-post', 'aria-label': t('tipo_post') + (posts.length > 1 ? ' ' + (i + 1) : '') }, [
          el('div', { class: 'post-head' }, [
            el('span', { class: 'post-avatar', 'aria-hidden': 'true', text: MARCA.iniciais || '' }),
            el('span', { class: 'post-user' }, [el('strong', { text: MARCA.nome || '' }), el('span', { text: MARCA.usuario || '' })])
          ]),
          p.imagem ? el('div', { class: 'post-image', role: 'img', 'aria-label': t('sugestaoImagem') + ': ' + p.imagem }, [
            icone('imagem', 34), el('span', { 'aria-hidden': 'true', text: t('sugestaoImagem') + ': ' + p.imagem })
          ]) : null,
          el('div', { class: 'post-actions', 'aria-hidden': 'true' }, [icone('coracao', 22), icone('comentario', 22), icone('compartilhar', 22)]),
          el('div', { class: 'post-text' }, [
            md(p.texto),
            p.hashtags && p.hashtags.length ? el('p', { class: 'hashtags', text: p.hashtags.join(' ') }) : null
          ])
        ])
      ]);
    }));
  }

  function renderEmail(a) {
    var meta = [
      el('dt', { text: t('emailDe') }), el('dd', { text: MARCA.nome || '' }),
      el('dt', { text: t('emailAssunto') }), el('dd', { text: a.assunto || '' })
    ];
    if (a.preCabecalho) meta.push(el('dt', { text: t('emailPre') }), el('dd', { text: a.preCabecalho }));
    return el('article', { class: 'email', 'aria-label': t('tipo_email') }, [
      el('dl', { class: 'email-meta' }, meta),
      el('div', { class: 'email-body' }, [
        el('h3', { class: 'email-subject', text: a.assunto || '' }),
        md(a.corpo),
        a.botao ? el('span', { class: 'email-cta', text: a.botao }) : null
      ])
    ]);
  }

  var RENDER_ARTEFATO = { carrossel: renderCarrossel, post: renderPost, email: renderEmail };

  function textoDoArtefato(a) {
    var linhas = [];
    if (a.tipo === 'carrossel') {
      (a.slides || []).forEach(function (s, i) { linhas.push(t('slideN', { n: i + 1 }) + ': ' + textoPuro(s)); });
      if (a.legenda) linhas.push('', t('legenda') + ': ' + textoPuro(a.legenda));
      if (a.hashtags && a.hashtags.length) linhas.push(a.hashtags.join(' '));
    } else if (a.tipo === 'post') {
      (a.posts || []).forEach(function (p, i) {
        if (i > 0) linhas.push('');
        if ((a.posts || []).length > 1) linhas.push(t('legendaN', { n: i + 1, total: a.posts.length }));
        linhas.push(textoPuro(p.texto));
        if (p.hashtags && p.hashtags.length) linhas.push(p.hashtags.join(' '));
      });
    } else if (a.tipo === 'email') {
      linhas.push(t('emailAssunto') + ': ' + (a.assunto || ''));
      if (a.preCabecalho) linhas.push(t('emailPre') + ': ' + a.preCabecalho);
      linhas.push('', textoPuro(a.corpo));
      if (a.botao) linhas.push('', '[' + a.botao + ']');
    }
    return linhas.join('\n');
  }

  function painelSobreposto() { return !painelFixo.matches; }

  function abrirPainel(artefatos, indice, opcoes) {
    opcoes = opcoes || {};
    painel.artefatos = artefatos;
    painel.indice = indice || 0;
    painel.retorno = opcoes.origem || (opcoes.focar ? document.activeElement : null);
    renderPainel();
    var p = $('painel-artefato');
    p.hidden = false;
    document.body.classList.add('has-panel');
    if (painelSobreposto()) {
      p.setAttribute('role', 'dialog');
      p.setAttribute('aria-modal', 'true');
      $('painel-fundo').hidden = false;
    } else {
      p.removeAttribute('role');
      p.removeAttribute('aria-modal');
      $('painel-fundo').hidden = true;
    }
    if (opcoes.focar || painelSobreposto()) p.focus({ preventScroll: true });
  }

  function fecharPainel(restaurarFoco) {
    var p = $('painel-artefato');
    if (p.hidden) return;
    p.hidden = true;
    $('painel-fundo').hidden = true;
    document.body.classList.remove('has-panel');
    if (restaurarFoco && painel.retorno && document.body.contains(painel.retorno)) painel.retorno.focus({ preventScroll: true });
    painel.artefatos = null;
    painel.retorno = null;
  }

  function painelAberto() { return !$('painel-artefato').hidden; }

  function renderPainel() {
    var lista = painel.artefatos || [];
    var a = lista[painel.indice];
    if (!a) return;
    $('painel-kicker').textContent = t('tipo_' + a.tipo);
    $('painel-titulo').textContent = a.titulo || t('artefato');

    var abas = $('painel-abas');
    abas.textContent = '';
    abas.hidden = lista.length < 2;
    abas.setAttribute('aria-label', t('artefatosGerados'));
    lista.forEach(function (art, i) {
      var sel = i === painel.indice;
      abas.appendChild(el('button', {
        type: 'button', role: 'tab', class: 'tab', 'aria-selected': sel ? 'true' : 'false', tabindex: sel ? '0' : '-1',
        'aria-controls': 'painel-corpo', onclick: function () { selecionarAba(i, false); }
      }, [t('tipoCurto_' + art.tipo)]));
    });

    var corpo = $('painel-corpo');
    corpo.textContent = '';
    corpo.setAttribute('role', lista.length > 1 ? 'tabpanel' : 'region');
    corpo.setAttribute('aria-label', a.titulo || t('artefato'));
    corpo.scrollTop = 0;
    var render = RENDER_ARTEFATO[a.tipo];
    corpo.appendChild(render ? render(a) : el('p', { class: 'aviso', text: t('blocoDesconhecido') + ': ' + a.tipo }));
  }

  function selecionarAba(i, focar) {
    painel.indice = i;
    renderPainel();
    if (focar) {
      var b = $('painel-abas').querySelectorAll('[role="tab"]')[i];
      if (b) b.focus();
    }
  }

  function configurarPainel() {
    $('btn-fechar-painel-rotulo').textContent = t('fecharPainel');
    $('btn-copiar-artefato-rotulo').textContent = t('copiarTexto');
    $('btn-fechar-painel').addEventListener('click', function () { fecharPainel(true); });
    $('painel-fundo').addEventListener('click', function () { fecharPainel(true); });
    $('btn-copiar-artefato').addEventListener('click', function () {
      var a = painel.artefatos && painel.artefatos[painel.indice];
      if (a) copiar(textoDoArtefato(a), t('copiado'));
    });
    $('painel-abas').setAttribute('data-keys', 'local');
    $('painel-abas').addEventListener('keydown', function (e) {
      var n = (painel.artefatos || []).length;
      if (!n) return;
      var alvo = null;
      if (e.key === 'ArrowRight') alvo = (painel.indice + 1) % n;
      else if (e.key === 'ArrowLeft') alvo = (painel.indice - 1 + n) % n;
      else if (e.key === 'Home') alvo = 0;
      else if (e.key === 'End') alvo = n - 1;
      if (alvo != null) { e.preventDefault(); selecionarAba(alvo, true); }
    });
    // Mantém o foco dentro do painel quando ele é sobreposto (diálogo)
    $('painel-artefato').addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || !painelSobreposto()) return;
      var focaveis = Array.prototype.filter.call(
        this.querySelectorAll('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"]), summary'),
        function (x) { return x.offsetParent !== null; }
      );
      if (!focaveis.length) return;
      var primeiro = focaveis[0], ultimo = focaveis[focaveis.length - 1];
      if (e.shiftKey && (document.activeElement === primeiro || document.activeElement === this)) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primeiro.focus(); }
    });
    painelFixo.addEventListener && painelFixo.addEventListener('change', function () {
      if (painelAberto()) abrirPainel(painel.artefatos, painel.indice, { origem: painel.retorno });
    });
  }

  /* ---------- Navegação ---------- */

  function renderListaModulos() {
    var lista = $('lista-modulos');
    lista.textContent = '';
    MODULOS.forEach(function (mod, i) {
      var atual = i === estado.indice;
      lista.appendChild(el('li', null, [
        el('a', {
          class: 'module-link' + (visitados[mod.id] ? ' is-visited' : ''), href: '#' + mod.id,
          'aria-current': atual ? 'page' : null, 'data-blur-on-click': true
        }, [
          el('span', { class: 'module-num', 'aria-hidden': 'true', text: String(i + 1) }),
          el('span', null, [
            el('span', { class: 'module-link-title', text: mod.titulo }),
            mod.resumoCurto ? el('span', { class: 'module-link-sub', text: mod.resumoCurto }) : null
          ])
        ])
      ]));
    });
  }

  function renderModulo(focar) {
    cancelarAnimacoes();
    fecharPainel(false);
    avancaveis = [];
    var mod = MODULOS[estado.indice];
    var total = MODULOS.length;
    visitados[mod.id] = true;

    raizModulo.textContent = '';
    var ctx = { registrar: function (a) { avancaveis.push(a); } };

    var idTitulo = 'titulo-modulo';
    raizModulo.appendChild(el('header', { class: 'module-head' }, [
      el('p', { class: 'module-kicker', text: t('moduloN', { n: estado.indice + 1, total: total }) }),
      el('h1', { id: idTitulo, tabindex: '-1', text: mod.titulo }),
      mod.resumo ? el('p', { class: 'module-lead', text: mod.resumo }) : null
    ]));

    (mod.blocos || []).forEach(function (b) {
      var r = RENDERIZADORES[b.tipo];
      raizModulo.appendChild(r ? r(b, ctx) : el('p', { class: 'aviso', text: t('blocoDesconhecido') + ': ' + b.tipo }));
    });

    var progresso = t('moduloDe', { atual: estado.indice + 1, total: total });
    $('progresso-texto').textContent = progresso;
    $('progresso-barra').style.width = ((estado.indice + 1) / total * 100) + '%';
    $('paginacao-contagem').textContent = progresso;
    $('btn-anterior').disabled = estado.indice === 0;
    $('btn-proximo').disabled = estado.indice === total - 1;
    document.title = mod.titulo + ' · ' + t('nomeSite');

    renderListaModulos();
    salvarEstado();

    if (('#' + mod.id) !== location.hash) {
      try { location.replace('#' + mod.id); } catch (e) { /* ignora */ }
    }
    window.scrollTo(0, 0);
    if (focar) $(idTitulo).focus({ preventScroll: true });
  }

  function irPara(i, focar) {
    if (i < 0 || i >= MODULOS.length) return;
    estado.indice = i;
    fecharMenu();
    renderModulo(focar);
  }

  function avancarConversa() {
    for (var i = 0; i < avancaveis.length; i++) {
      if (!avancaveis[i].concluido()) { avancaveis[i].avancar(); return true; }
    }
    return false;
  }

  /* ---------- Modo e tema ---------- */

  function aplicarModo() {
    Array.prototype.forEach.call(document.querySelectorAll('.mode-btn'), function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-modo') === estado.modo ? 'true' : 'false');
    });
    document.body.classList.toggle('modo-estudo', estado.modo === 'estudo');
  }

  function temaEfetivo() {
    if (estado.tema === 'auto') return temaEscuroSistema.matches ? 'escuro' : 'claro';
    return estado.tema;
  }

  function aplicarTema() {
    var raiz = document.documentElement;
    if (estado.tema === 'auto') raiz.removeAttribute('data-theme');
    else raiz.setAttribute('data-theme', estado.tema);
    var escuro = temaEfetivo() === 'escuro';
    $('btn-tema').classList.toggle('is-dark', escuro);
    $('btn-tema-rotulo').textContent = escuro ? t('temaClaro') : t('temaEscuro');
    $('btn-tema').title = escuro ? t('temaClaro') : t('temaEscuro');
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
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    var alvo = e.target && e.target.closest ? e.target : document.body;

    if (e.key === 'Escape') {
      if (painelAberto()) { fecharPainel(true); e.preventDefault(); return; }
      if (document.body.classList.contains('sidebar-open')) { fecharMenu(true); e.preventDefault(); }
      return;
    }
    if (alvo.closest('input, textarea, select, [contenteditable="true"]')) return;
    if (painelAberto() && painelSobreposto()) return;
    if (document.body.classList.contains('sidebar-open')) return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      if (alvo.closest('[data-keys="local"], [role="tablist"]')) return;
      e.preventDefault();
      irPara(estado.indice + (e.key === 'ArrowRight' ? 1 : -1), true);
      return;
    }

    if (e.key === ' ' || e.key === 'Enter' || e.key === 'Spacebar') {
      if (alvo.closest('button, a[href], summary, [role="tab"], [tabindex]:not([tabindex="-1"])')) return;
      if (avancarConversa()) e.preventDefault();
    }
  }

  /* ---------- Inicialização ---------- */

  function preencherInterface() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-ui]'), function (e) {
      e.textContent = t(e.getAttribute('data-ui'));
    });
    $('brand-nome').textContent = t('nomeSite');
    $('brand-sub').textContent = t('subtitulo');
    $('sidebar-titulo').textContent = t('tituloModulos');
    $('dica-teclado').innerHTML = escapar(t('dicaTeclado')).replace(/\[(.+?)\]/g, '<kbd>$1</kbd>');
    $('btn-anterior-rotulo').textContent = t('anterior');
    $('btn-proximo-rotulo').textContent = t('proximo');
    $('paginacao').setAttribute('aria-label', t('navegacaoModulos'));
    $('btn-menu').querySelector('.sr-only').textContent = t('abrirMenu');
    $('grupo-modo').setAttribute('aria-label', t('rotuloModo'));
    Array.prototype.forEach.call(document.querySelectorAll('.mode-btn'), function (b) {
      b.querySelector('.mode-label').textContent = t(b.getAttribute('data-modo') === 'estudo' ? 'modoEstudo' : 'modoApresentacao');
      b.title = t(b.getAttribute('data-modo') === 'estudo' ? 'dicaModoEstudo' : 'dicaModoApresentacao');
    });
  }

  function configurarEventos() {
    $('btn-anterior').addEventListener('click', function () { irPara(estado.indice - 1, false); });
    $('btn-proximo').addEventListener('click', function () { irPara(estado.indice + 1, false); });
    $('btn-menu').addEventListener('click', function () {
      if (document.body.classList.contains('sidebar-open')) fecharMenu(true); else abrirMenu();
    });
    $('sidebar-backdrop').addEventListener('click', function () { fecharMenu(true); });
    $('lista-modulos').addEventListener('click', function () { fecharMenu(false); });

    Array.prototype.forEach.call(document.querySelectorAll('.mode-btn'), function (b) {
      b.addEventListener('click', function () {
        var modo = b.getAttribute('data-modo');
        if (modo === estado.modo) return;
        estado.modo = modo;
        aplicarModo();
        renderModulo(false);
        toast(t(modo === 'estudo' ? 'avisoModoEstudo' : 'avisoModoApresentacao'));
      });
    });

    $('btn-tema').addEventListener('click', function () {
      estado.tema = temaEfetivo() === 'escuro' ? 'claro' : 'escuro';
      aplicarTema();
      salvarEstado();
    });
    if (temaEscuroSistema.addEventListener) temaEscuroSistema.addEventListener('change', aplicarTema);

    window.addEventListener('hashchange', function () {
      var i = indicePorId(decodeURIComponent(location.hash.slice(1)));
      if (i >= 0 && i !== estado.indice) irPara(i, true);
      else fecharMenu();
    });

    // Após clique com mouse, remove o foco do botão para o Espaço não reativá-lo
    document.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('[data-blur-on-click]');
      if (b && e.detail > 0) b.blur();
    });

    document.addEventListener('keydown', aoTeclar);
  }

  carregarEstado();
  preencherInterface();
  configurarPainel();
  configurarEventos();
  aplicarTema();
  aplicarModo();
  renderModulo(false);
})();
