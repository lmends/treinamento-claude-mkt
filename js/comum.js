/* ==========================================================================
   Ambiente de Treinamento — utilitários compartilhados (window.Treino)
   Usado pela capa, pela apresentação e pelo estudo: textos da interface,
   markdown, ícones, estado salvo, tema, aviso e cópia. O motor de conversa e
   os componentes visuais ficam em js/componentes.js (não carregado na capa).
   Todo o conteúdo vem de window.CONTEUDO (js/content.js).
   ========================================================================== */
(function () {
  'use strict';

  var C = window.CONTEUDO || {};
  var UI = C.interface || {};
  var MARCA = C.marca || {};
  var MODULOS = Array.isArray(C.modulos) ? C.modulos : [];
  var CHAVE = 'treinamento-cafe-serra:v2';
  var CHAVE_V1 = 'treinamento-cafe-serra:v1';
  var movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)');
  var temaEscuroSistema = window.matchMedia('(prefers-color-scheme: dark)');

  // Tempos das animações (ms)
  var TEMPO = {
    quadro: 30,
    digitacaoPorCaractere: 22, digitacaoMin: 600, digitacaoMax: 2000,
    antesDeEnviar: 280,
    carregandoSkill: 950,
    pensando: 750,
    streamingPorCaractere: 12, streamingMin: 700, streamingMax: 3200,
    entreMensagens: 650,
    toast: 2600
  };

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
  function semMovimento() { return movimentoReduzido.matches; }

  function el(tag, props, filhos) {
    var e = document.createElement(tag);
    if (props) {
      Object.keys(props).forEach(function (k) {
        var v = props[k];
        if (v == null || v === false) return;
        if (k === 'class') e.className = v;
        else if (k === 'text') e.textContent = v;
        else if (k === 'html') e.innerHTML = v;
        else if (k === 'style' && typeof v === 'object') Object.keys(v).forEach(function (p) { e.style.setProperty(p, v[p]); });
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
    grao: '<ellipse cx="12" cy="12" rx="7" ry="10" fill="currentColor"/><path d="M12 2.5c-3 4-3 15 0 19" fill="none" stroke="rgba(0,0,0,.35)" stroke-width="1.6"/>',
    grade: '<rect x="4" y="4" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" stroke-width="2"/><rect x="13" y="4" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" stroke-width="2"/><rect x="4" y="13" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" stroke-width="2"/><rect x="13" y="13" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" stroke-width="2"/>',
    notas: '<path d="M6 3h9l4 4v14H6z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 11h7M9 15h7M9 7h3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    telaCheia: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    sairTelaCheia: '<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    casa: '<path d="M4 11l8-7 8 7v9h-5v-6H9v6H4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    fechar: '<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    slides: '<rect x="3" y="4" width="18" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 16v4M8 20h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    livro: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5zM4 20.5A2.5 2.5 0 0 0 6.5 23H20" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" transform="translate(0 -1)"/>',
    relogio: '<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7.5V12l3 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    conector: '<path d="M9 7V3M15 7V3M6 7h12v4a6 6 0 0 1-12 0zM12 17v4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    video: '<rect x="3" y="6" width="13" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 10.5l5-3v9l-5-3z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    olho: '<path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="2"/>',
    sol: '<circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    lua: '<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>'
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

  // Marca do site (xícara), sem relação com marcas reais
  function marcaSite(tamanho) {
    var s = tamanho || 32;
    return el('span', {
      class: 'brand-mark', 'aria-hidden': 'true',
      html: '<svg viewBox="0 0 32 32" width="' + s + '" height="' + s + '"><rect width="32" height="32" rx="9" fill="currentColor"/><path d="M10 13h10v5a5 5 0 0 1-5 5 5 5 0 0 1-5-5z" fill="var(--on-accent)"/><path d="M20 14h1.5a2.5 2.5 0 0 1 0 5H20" fill="none" stroke="var(--on-accent)" stroke-width="1.6"/><path class="vapor" d="M13 7c1 1.2-1 2.2 0 3.4M17 7c1 1.2-1 2.2 0 3.4" fill="none" stroke="var(--on-accent)" stroke-width="1.4" stroke-linecap="round"/></svg>'
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

  // Texto com [teclas] marcadas como <kbd>
  function comTeclas(texto) {
    return escapar(texto).replace(/\[(.+?)\]/g, '<kbd>$1</kbd>');
  }

  /* ---------- Estado salvo ---------- */

  function lerEstado() {
    var padrao = { tema: 'auto', deck: {}, estudo: { concluidos: [] } };
    var s = null;
    try { s = JSON.parse(window.localStorage.getItem(CHAVE) || 'null'); } catch (e) { s = null; }
    if (!s) {
      // Migra o formato da primeira versão, se existir
      var v1 = null;
      try { v1 = JSON.parse(window.localStorage.getItem(CHAVE_V1) || 'null'); } catch (e) { v1 = null; }
      if (v1 && typeof v1 === 'object') s = { tema: v1.tema, estudo: { modulo: v1.modulo, concluidos: [] } };
    }
    if (!s || typeof s !== 'object') return padrao;
    return {
      tema: s.tema === 'claro' || s.tema === 'escuro' ? s.tema : 'auto',
      deck: s.deck && typeof s.deck === 'object' ? s.deck : {},
      estudo: {
        modulo: s.estudo && s.estudo.modulo,
        concluidos: s.estudo && Array.isArray(s.estudo.concluidos) ? s.estudo.concluidos.filter(function (id) { return indicePorId(id) >= 0; }) : []
      }
    };
  }

  function gravarEstado(alterar) {
    var s = lerEstado();
    alterar(s);
    try { window.localStorage.setItem(CHAVE, JSON.stringify(s)); } catch (e) { /* sem armazenamento: segue sem lembrar */ }
    return s;
  }

  function indicePorId(id) {
    if (!id) return -1;
    for (var i = 0; i < MODULOS.length; i++) if (MODULOS[i].id === id) return i;
    return -1;
  }

  /* ---------- Tema ---------- */

  function temaEfetivo() {
    var tema = lerEstado().tema;
    if (tema === 'auto') return temaEscuroSistema.matches ? 'escuro' : 'claro';
    return tema;
  }

  function aplicarTema() {
    var tema = lerEstado().tema;
    if (tema === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', tema);
    var escuro = temaEfetivo() === 'escuro';
    Array.prototype.forEach.call(document.querySelectorAll('[data-acao="tema"]'), function (b) {
      b.classList.toggle('is-dark', escuro);
      var rotulo = escuro ? t('temaClaro') : t('temaEscuro');
      b.title = rotulo;
      b.setAttribute('aria-label', rotulo);
    });
  }

  function botaoTema(classe) {
    return el('button', {
      type: 'button', class: classe || 'icon-btn', 'data-acao': 'tema', 'data-blur-on-click': true,
      onclick: function () {
        var novo = temaEfetivo() === 'escuro' ? 'claro' : 'escuro';
        gravarEstado(function (s) { s.tema = novo; });
        aplicarTema();
      }
    }, [icone('sol', 20, 'ic-sun'), icone('lua', 20, 'ic-moon')]);
  }

  if (temaEscuroSistema.addEventListener) temaEscuroSistema.addEventListener('change', aplicarTema);

  /* ---------- Toast e cópia ---------- */

  var temporizadorToast = null;
  function toast(msg) {
    var tEl = $('toast');
    if (!tEl) {
      tEl = el('div', { class: 'toast', id: 'toast', role: 'status', 'aria-live': 'polite' });
      document.body.appendChild(tEl);
    }
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

  /* Blocos efetivos de um módulo para 'deck' ou 'estudo' (aplica slide/soNosSlides). */
  function blocosDoModulo(mod, destino) {
    var r = [];
    (mod.blocos || []).forEach(function (b) {
      if (destino === 'estudo') {
        if (!b.soNosSlides) r.push(b);
        return;
      }
      if (b.slide === false) return;
      if (b.slide && typeof b.slide === 'object') {
        var m = {};
        Object.keys(b).forEach(function (k) { if (k !== 'slide') m[k] = b[k]; });
        Object.keys(b.slide).forEach(function (k) { m[k] = b.slide[k]; });
        r.push(m);
      } else r.push(b);
    });
    return r;
  }

  // Após clique com mouse, remove o foco do botão para o Espaço não reativá-lo
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-blur-on-click]');
    if (b && e.detail > 0) b.blur();
  });

  window.Treino = {
    C: C, UI: UI, MARCA: MARCA, MODULOS: MODULOS, TEMPO: TEMPO, SVG: SVG,
    t: t, el: el, $: $, novoId: novoId, limitar: limitar, semMovimento: semMovimento, movimentoReduzido: movimentoReduzido,
    icone: icone, iconeArquivo: iconeArquivo, marcaSite: marcaSite,
    escapar: escapar, inline: inline, markdown: markdown, textoPuro: textoPuro, md: md, comTeclas: comTeclas,
    lerEstado: lerEstado, gravarEstado: gravarEstado, indicePorId: indicePorId,
    aplicarTema: aplicarTema, botaoTema: botaoTema, temaEfetivo: temaEfetivo,
    toast: toast, copiar: copiar, botaoCopiar: botaoCopiar,
    blocosDoModulo: blocosDoModulo
  };

  aplicarTema();
})();
