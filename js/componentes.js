/* ==========================================================================
   Ambiente de Treinamento — componentes (extensão de window.Treino)
   Motor de conversa simulada, artefatos e componentes visuais usados pela
   apresentação e pelo estudo. Requer js/comum.js. Apenas lógica.
   ========================================================================== */
(function () {
  'use strict';

  var T = window.Treino;
  if (!T) return;
  var t = T.t, el = T.el, novoId = T.novoId, limitar = T.limitar, semMovimento = T.semMovimento;
  var icone = T.icone, iconeArquivo = T.iconeArquivo, SVG = T.SVG;
  var inline = T.inline, markdown = T.markdown, textoPuro = T.textoPuro, md = T.md;
  var botaoCopiar = T.botaoCopiar, TEMPO = T.TEMPO, MARCA = T.MARCA, MODULOS = T.MODULOS;

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
      var ultimo = null;
      blocos.forEach(function (b) {
        b.hidden = b.textContent.length === 0;
        b.classList.remove('is-caret');
        if (!b.hidden && !/^(UL|OL)$/.test(b.tagName)) ultimo = b;
      });
      if (ultimo) ultimo.classList.add('is-caret');
    }
    return { total: total, mostrar: mostrar };
  }

  function rolarAte(elemento) {
    if (!elemento || !elemento.scrollIntoView) return;
    elemento.scrollIntoView({ block: 'nearest', behavior: semMovimento() ? 'auto' : 'smooth' });
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

  function renderChipsArtefatos(artefatos, aoAbrir) {
    return el('div', { class: 'artifact-chips' }, artefatos.map(function (a, i) {
      return el('button', {
        type: 'button', class: 'artifact-chip', 'data-blur-on-click': true,
        onclick: function () { aoAbrir(artefatos, i); }
      }, [
        el('span', { class: 'artifact-chip-ico' }, [icone(ICONE_ARTEFATO[a.tipo] || 'post', 20)]),
        el('span', { class: 'artifact-chip-text' }, [
          el('strong', { text: a.titulo || t('artefato') }),
          el('span', { text: t('tipo_' + a.tipo) + ' · ' + t('verArtefato') })
        ])
      ]);
    }));
  }

  /* opcoes: animando, entrada, notas ('visiveis' | 'botao' | 'nenhuma'), aoArtefatos */
  function renderMensagem(m, opcoes) {
    opcoes = opcoes || {};
    var ehAluna = m.autor === 'aluna';
    var principal = el('div', { class: 'msg-main' });
    var meta = el('div', { class: 'msg-meta' }, [el('span', { class: 'msg-author', text: ehAluna ? t('voce') : t('assistente') })]);
    principal.appendChild(meta);

    var nota = null;
    var modoNota = opcoes.notas || 'botao';
    if (m.nota && !opcoes.animando && modoNota !== 'nenhuma') {
      var idNota = novoId('nota');
      var aberta = modoNota === 'visiveis';
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
    if (!ehAluna && m.skill) {
      selo = el('div', { class: 'skill-badge' });
      preencherSelo(selo, m.skill, !!opcoes.animando);
      principal.appendChild(selo);
    }

    var bolha = el('div', { class: 'msg-bubble' });
    if (!opcoes.animando) bolha.appendChild(el('div', { class: 'msg-content md', html: markdown(m.texto) }));
    principal.appendChild(bolha);

    if (!ehAluna && m.artefatos && m.artefatos.length && !opcoes.animando) {
      if (opcoes.aoArtefatos) principal.appendChild(renderChipsArtefatos(m.artefatos, opcoes.aoArtefatos));
      else principal.appendChild(criarVisualizadorArtefatos(m.artefatos).elemento);
    }
    if (nota) principal.appendChild(nota);

    var avatar = el('div', { class: 'msg-avatar', 'aria-hidden': 'true' }, [ehAluna ? t('iniciaisVoce') : icone('assistente', 18)]);
    var raiz = el('div', { class: 'msg msg-' + (ehAluna ? 'aluna' : 'assistente') + (opcoes.entrada ? ' msg-enter' : '') }, [avatar, principal]);
    return { elemento: raiz, bolha: bolha, selo: selo };
  }

  /* ---------- Chat roteirizado ----------
     opcoes:
       animado     true = digitação/pensando/streaming (desligado com movimento reduzido)
       completo    true = começa com todas as mensagens exibidas
       controles   true = barra com Avançar / Pular / Reiniciar
       notas       'visiveis' | 'botao' | 'nenhuma'
       aoArtefatos função(artefatos, indice, mensagem): exibe artefatos fora do chat;
                   sem ela, os artefatos aparecem dentro da própria resposta
       aoAvancar   chamado antes de cada nova mensagem
       aoMudar     chamado quando uma mensagem termina de aparecer
       compacto    estilo mais denso
  */
  function criarChat(conversa, opcoes) {
    opcoes = opcoes || {};
    var mensagens = conversa.mensagens || [];
    var mostradas = 0;
    var anim = null;
    var promessaAtual = null;
    var reproduzindo = null;
    var idTitulo = novoId('chat-titulo');
    var notasModo = opcoes.notas || 'botao';

    var raiz = el('section', {
      class: 'chat' + (opcoes.compacto ? ' chat-compacto' : ''),
      'aria-labelledby': conversa.titulo ? idTitulo : null,
      'aria-label': conversa.titulo ? null : t('conversa')
    });
    var cabecalho = null;
    if (conversa.titulo || opcoes.acaoCabecalho) {
      cabecalho = el('div', { class: 'chat-head' }, [conversa.titulo ? el('h3', { id: idTitulo, text: conversa.titulo }) : el('span')]);
      if (opcoes.acaoCabecalho) cabecalho.appendChild(opcoes.acaoCabecalho);
      raiz.appendChild(cabecalho);
    }
    if (conversa.contexto) raiz.appendChild(el('p', { class: 'chat-context', text: conversa.contexto }));

    var log = el('div', { class: 'chat-log', role: 'log', 'aria-live': 'polite', 'aria-label': t('mensagens') });
    raiz.appendChild(log);

    var composerAnexo = el('div', { class: 'composer-attachment', hidden: true });
    var composerTexto = el('div', { class: 'composer-text', 'data-placeholder': t('campoPlaceholder') });
    var composer = el('div', { class: 'composer', 'aria-hidden': 'true', hidden: !opcoes.animado }, [
      composerAnexo,
      el('div', { class: 'composer-row' }, [icone('clipe', 18, 'composer-clip'), composerTexto, icone('enviar', 18, 'composer-send')])
    ]);
    raiz.appendChild(composer);

    var btnAvancar, btnAvancarTexto, btnPular, btnReiniciar;
    if (opcoes.controles) {
      btnAvancarTexto = el('span');
      btnAvancar = el('button', { type: 'button', class: 'btn btn-primary btn-sm', 'data-blur-on-click': true, onclick: function () { avancar(); } }, [icone('play', 16), btnAvancarTexto]);
      btnPular = el('button', { type: 'button', class: 'btn btn-sm', 'data-blur-on-click': true, onclick: function () { completar(); } }, [icone('pular', 16), el('span', { text: t('pularAnimacao') })]);
      btnReiniciar = el('button', { type: 'button', class: 'btn btn-sm btn-ghost', 'data-blur-on-click': true, onclick: function () { reiniciar(); } }, [icone('reiniciar', 16), el('span', { text: t('reiniciar') })]);
      raiz.appendChild(el('div', { class: 'chat-controls' }, [btnAvancar, btnPular, btnReiniciar]));
    }

    function animando() { return !!opcoes.animado && !semMovimento(); }

    function rolar() {
      var alvo = !composer.hidden && composer.classList.contains('is-typing') ? composer : log.lastElementChild;
      if (opcoes.rolar) opcoes.rolar(alvo, log);
      else rolarAte(alvo);
    }

    function atualizarControles() {
      raiz.classList.toggle('is-vazio', mostradas === 0);
      if (!opcoes.controles) return;
      var fim = mostradas >= mensagens.length && !anim;
      btnAvancarTexto.textContent = fim ? t('fimConversa')
        : anim ? t('concluirMensagem')
        : t('avancar') + ' (' + (mostradas + 1) + '/' + mensagens.length + ')';
      btnAvancar.disabled = fim;
      btnPular.disabled = fim;
      btnReiniciar.disabled = mostradas === 0 && !anim;
    }

    function limparComposer() {
      composerTexto.textContent = '';
      composerAnexo.hidden = true;
      composer.classList.remove('is-typing');
    }

    function opcoesMensagem(extra) {
      var o = { notas: notasModo, aoArtefatos: opcoes.aoArtefatos ? function (arts, i) { opcoes.aoArtefatos(arts, i, null, true); } : null };
      Object.keys(extra || {}).forEach(function (k) { o[k] = extra[k]; });
      return o;
    }

    function finalizar(m, mostrarArtefatos) {
      if (mostrarArtefatos && opcoes.aoArtefatos && m.artefatos && m.artefatos.length) opcoes.aoArtefatos(m.artefatos, 0, m, false);
      if (opcoes.aoMudar) opcoes.aoMudar();
    }

    function renderDireto(m, mostrarArtefatos, entrada) {
      log.appendChild(renderMensagem(m, opcoesMensagem({ entrada: entrada })).elemento);
      finalizar(m, mostrarArtefatos);
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
        rolar();
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
        log.appendChild(renderMensagem(m, opcoesMensagem({ entrada: true })).elemento);
        rolar();
        finalizar(m, true);
        return;
      }

      // Assistente: versão provisória animada (oculta de leitores de tela)
      var provisoria = renderMensagem(m, { animando: true, entrada: true });
      provisoria.elemento.setAttribute('aria-hidden', 'true');
      log.appendChild(provisoria.elemento);
      rolar();

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

      var conteudo = el('div', { class: 'msg-content md', html: markdown(m.texto) });
      provisoria.bolha.textContent = '';
      provisoria.bolha.appendChild(conteudo);
      var stream = prepararStreaming(conteudo);
      stream.mostrar(0);
      var duracaoStream = limitar(stream.total * TEMPO.streamingPorCaractere, TEMPO.streamingMin, TEMPO.streamingMax);
      passos = Math.max(1, Math.round(duracaoStream / TEMPO.quadro));
      for (i = 1; i <= passos && !a.pulado; i++) {
        stream.mostrar(Math.round(stream.total * i / passos));
        if (i % 6 === 0) rolar();
        await a.pausa(TEMPO.quadro);
      }
      if (a.cancelado) return;

      // Troca pela versão final (gera um único anúncio no aria-live)
      var final = renderMensagem(m, opcoesMensagem({}));
      log.replaceChild(final.elemento, provisoria.elemento);
      if (final.selo && !a.pulado) final.selo.classList.add('is-just-loaded');
      rolar();
      finalizar(m, true);
    }

    function avancar() {
      if (anim) { anim.pular(); return promessaAtual; }
      if (mostradas >= mensagens.length) return Promise.resolve();
      if (opcoes.aoAvancar) opcoes.aoAvancar();
      var m = mensagens[mostradas];
      mostradas += 1;
      if (!animando()) {
        renderDireto(m, true, true);
        atualizarControles();
        rolar();
        return Promise.resolve();
      }
      var a = new Animacao();
      anim = a;
      atualizarControles();
      promessaAtual = animarMensagem(m, a).then(terminar, terminar);
      function terminar() {
        if (anim === a) { anim = null; promessaAtual = null; }
        if (!a.cancelado) atualizarControles();
      }
      return promessaAtual;
    }

    // Exibe todas as mensagens restantes de uma vez
    function completar() {
      if (reproduzindo) { reproduzindo.cancelar(); reproduzindo = null; }
      if (anim) { anim.pular(); }
      var espera = promessaAtual || Promise.resolve();
      return Promise.resolve(espera).then(function () {
        var ultimaComArtefato = null;
        while (mostradas < mensagens.length) {
          var m = mensagens[mostradas];
          mostradas += 1;
          log.appendChild(renderMensagem(m, opcoesMensagem({})).elemento);
          if (m.artefatos && m.artefatos.length) ultimaComArtefato = m;
        }
        if (ultimaComArtefato) finalizar(ultimaComArtefato, true);
        else if (opcoes.aoMudar) opcoes.aoMudar();
        atualizarControles();
      });
    }

    // Completa imediatamente, sem esperar animações (usado ao voltar para um slide)
    function completarJa() {
      if (anim) { anim.cancelar(); anim = null; promessaAtual = null; }
      limparComposer();
      var ultimaComArtefato = null;
      while (mostradas < mensagens.length) {
        var m = mensagens[mostradas];
        mostradas += 1;
        log.appendChild(renderMensagem(m, opcoesMensagem({})).elemento);
        if (m.artefatos && m.artefatos.length) ultimaComArtefato = m;
      }
      if (ultimaComArtefato && opcoes.aoArtefatos) opcoes.aoArtefatos(ultimaComArtefato.artefatos, 0, ultimaComArtefato, false);
      atualizarControles();
      log.scrollTop = log.scrollHeight;
    }

    // Reproduz a conversa inteira automaticamente
    async function reproduzir() {
      if (reproduzindo) return;
      var r = new Animacao();
      reproduzindo = r;
      while (mostradas < mensagens.length && !r.cancelado) {
        await avancar();
        if (r.cancelado) break;
        if (mostradas < mensagens.length) await r.pausa(TEMPO.entreMensagens);
      }
      if (reproduzindo === r) reproduzindo = null;
    }

    function reiniciar() {
      if (reproduzindo) { reproduzindo.cancelar(); reproduzindo = null; }
      if (anim) { anim.cancelar(); anim = null; promessaAtual = null; }
      mostradas = 0;
      log.textContent = '';
      limparComposer();
      atualizarControles();
      if (opcoes.aoMudar) opcoes.aoMudar();
    }

    function destruir() {
      if (reproduzindo) reproduzindo.cancelar();
      if (anim) anim.cancelar();
      reproduzindo = null; anim = null; promessaAtual = null;
    }

    function notasExibidas() {
      return mensagens.slice(0, mostradas).filter(function (m) { return m.nota; }).map(function (m) {
        return { titulo: m.autor === 'aluna' ? t('voce') : t('assistente'), texto: m.nota };
      });
    }

    if (opcoes.completo) {
      mensagens.forEach(function (m) { log.appendChild(renderMensagem(m, opcoesMensagem({})).elemento); });
      mostradas = mensagens.length;
    }
    atualizarControles();

    return {
      elemento: raiz,
      avancar: avancar,
      concluido: function () { return mostradas >= mensagens.length && !anim; },
      emAnimacao: function () { return !!anim || !!reproduzindo; },
      completar: completar,
      completarJa: completarJa,
      reproduzir: reproduzir,
      reiniciar: reiniciar,
      destruir: destruir,
      notasExibidas: notasExibidas,
      mostrarComposer: function (v) { composer.hidden = !v; },
      definirAnimado: function (v) { opcoes.animado = v; composer.hidden = !v; }
    };
  }

  /* ---------- Artefatos ---------- */

  function renderCarrossel(a) {
    var slides = a.slides || [];
    var atual = 0;
    var slideEl = el('div', { class: 'ig-slide' });
    var contador = el('span', { class: 'ig-count', 'aria-live': 'polite' });
    var btnAnt = el('button', { type: 'button', class: 'icon-btn', onclick: function () { ir(atual - 1); } }, [icone('esquerda', 20), el('span', { class: 'sr-only', text: t('slideAnterior') })]);
    var btnProx = el('button', { type: 'button', class: 'icon-btn', onclick: function () { ir(atual + 1); } }, [icone('direita', 20), el('span', { class: 'sr-only', text: t('slideProximo') })]);
    var pontos = slides.map(function (_, i) {
      return el('button', { type: 'button', class: 'ig-dot', 'aria-label': t('irParaSlide', { n: i + 1 }), onclick: function () { ir(i); } });
    });

    function ir(i, inicial) {
      var anterior = atual;
      atual = limitar(i, 0, slides.length - 1);
      slideEl.className = 'ig-slide v' + (atual % 3) + (atual === 0 ? ' is-hook' : '') +
        (!inicial && atual !== anterior ? (atual > anterior ? ' entra-dir' : ' entra-esq') : '');
      slideEl.textContent = '';
      slideEl.appendChild(el('span', { class: 'ig-num', 'aria-hidden': 'true', text: (atual + 1) + '/' + slides.length }));
      slideEl.appendChild(el('p', { html: inline(slides[atual]) }));
      slideEl.appendChild(el('span', { class: 'ig-brand', 'aria-hidden': 'true', text: MARCA.nome || '' }));
      slideEl.appendChild(el('span', { class: 'ig-bean', 'aria-hidden': 'true', html: '<svg viewBox="0 0 24 24">' + SVG.grao + '</svg>' }));
      contador.textContent = t('slideDe', { atual: atual + 1, total: slides.length });
      btnAnt.disabled = atual === 0;
      btnProx.disabled = atual === slides.length - 1;
      pontos.forEach(function (p, j) { p.setAttribute('aria-current', j === atual ? 'true' : 'false'); });
    }

    var carrossel = el('div', {
      class: 'ig-carousel', role: 'region', 'aria-roledescription': t('carrossel'), 'aria-label': a.titulo || t('tipo_carrossel'),
      tabindex: '0', 'data-keys': 'local',
      onkeydown: function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); ir(atual + 1); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); ir(atual - 1); }
      }
    }, [
      el('div', { class: 'ig-frame' }, [slideEl]),
      el('div', { class: 'ig-nav' }, [btnAnt, contador, btnProx]),
      el('div', { class: 'ig-dots' }, pontos)
    ]);
    ir(0, true);

    var filhos = [carrossel];
    if (a.legenda || (a.hashtags && a.hashtags.length)) {
      filhos.push(el('div', { class: 'caption-box' }, [
        el('h4', { text: t('legenda') }),
        a.legenda ? md(a.legenda) : null,
        a.hashtags && a.hashtags.length ? el('p', { class: 'hashtags', text: a.hashtags.join(' ') }) : null
      ]));
    }
    return el('div', { class: 'artifact-carousel' }, filhos);
  }

  function renderPost(a) {
    var posts = a.posts || [];
    return el('div', { class: 'post-list' }, posts.map(function (p, i) {
      return el('div', { class: 'post-wrap' }, [
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
        el('h4', { class: 'email-subject', text: a.assunto || '' }),
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

  /* Visualizador com abas (quando há mais de um artefato), conteúdo e "Copiar texto". */
  function criarVisualizadorArtefatos(artefatos, opcoes) {
    opcoes = opcoes || {};
    var indice = 0;
    var idCorpo = novoId('artefato');
    var kicker = el('p', { class: 'artifact-kicker' });
    var titulo = el('h4', { class: 'artifact-title' });
    var abas = null, botoes = [];
    var corpo = el('div', { class: 'artifact-body', id: idCorpo });

    if (artefatos.length > 1) {
      abas = el('div', { class: 'tabs artifact-tabs', role: 'tablist', 'aria-label': t('artefatosGerados'), 'data-keys': 'local' });
      artefatos.forEach(function (a, i) {
        var b = el('button', {
          type: 'button', role: 'tab', class: 'tab', 'aria-controls': idCorpo,
          onclick: function () { selecionar(i); }
        }, [icone(ICONE_ARTEFATO[a.tipo] || 'post', 16), el('span', { text: t('tipoCurto_' + a.tipo) })]);
        botoes.push(b);
        abas.appendChild(b);
      });
      abas.addEventListener('keydown', function (e) {
        var alvo = null, n = artefatos.length;
        if (e.key === 'ArrowRight') alvo = (indice + 1) % n;
        else if (e.key === 'ArrowLeft') alvo = (indice - 1 + n) % n;
        else if (e.key === 'Home') alvo = 0;
        else if (e.key === 'End') alvo = n - 1;
        if (alvo != null) { e.preventDefault(); selecionar(alvo); botoes[alvo].focus(); }
      });
    }

    var raiz = el('div', { class: 'artifact-viewer' + (opcoes.classe ? ' ' + opcoes.classe : '') }, [
      el('div', { class: 'artifact-head' }, [
        el('span', { class: 'artifact-head-ico' }, [icone('post', 20)]),
        el('div', { class: 'artifact-head-text' }, [kicker, titulo])
      ]),
      abas,
      corpo,
      el('div', { class: 'artifact-foot' }, [
        botaoCopiar(t('copiarTexto'), function () { return textoDoArtefato(artefatos[indice]); }, t('copiado'), 'btn btn-primary btn-sm')
      ])
    ]);

    function selecionar(i) {
      indice = limitar(i, 0, artefatos.length - 1);
      var a = artefatos[indice];
      kicker.textContent = t('tipo_' + a.tipo);
      titulo.textContent = a.titulo || t('artefato');
      var ico = raiz.querySelector('.artifact-head-ico');
      ico.textContent = '';
      ico.appendChild(icone(ICONE_ARTEFATO[a.tipo] || 'post', 20));
      botoes.forEach(function (b, j) {
        b.setAttribute('aria-selected', j === indice ? 'true' : 'false');
        b.tabIndex = j === indice ? 0 : -1;
      });
      corpo.setAttribute('role', artefatos.length > 1 ? 'tabpanel' : 'region');
      corpo.setAttribute('aria-label', a.titulo || t('artefato'));
      corpo.textContent = '';
      var r = RENDER_ARTEFATO[a.tipo];
      var conteudo = r ? r(a) : el('p', { class: 'aviso', text: t('blocoDesconhecido') + ': ' + a.tipo });
      conteudo.classList.add('artifact-content');
      corpo.appendChild(conteudo);
    }
    selecionar(opcoes.indice || 0);

    return { elemento: raiz, selecionar: selecionar };
  }

  /* ---------- Componentes visuais compartilhados ---------- */

  function renderCards(itens) {
    return el('div', { class: 'cards', 'data-count': String((itens || []).length) }, (itens || []).map(function (c) {
      return el('article', { class: 'card' }, [
        c.icone ? el('div', { class: 'card-icon', 'aria-hidden': 'true', text: c.icone }) : null,
        el('h3', { text: c.titulo }),
        c.texto ? md(c.texto) : null
      ]);
    }));
  }

  function renderDestaque(b, nivel) {
    return el('div', { class: 'callout' + (b.cor === 'verde' ? ' is-green' : '') }, [
      b.icone ? el('span', { class: 'callout-icon', 'aria-hidden': 'true', text: b.icone }) : null,
      el('div', { class: 'callout-body' }, [b.titulo ? el(nivel || 'h2', { class: 'callout-title', text: b.titulo }) : null, md(b.texto)])
    ]);
  }

  /* opcoes: href(mod, i), aoClicar(i, evento), concluidos (mapa id → true) */
  function renderAgenda(opcoes) {
    opcoes = opcoes || {};
    return el('ol', { class: 'overview' }, MODULOS.map(function (mod, i) {
      var feito = opcoes.concluidos && opcoes.concluidos[mod.id];
      return el('li', null, [
        el('a', {
          class: 'overview-link' + (feito ? ' is-done' : ''), href: opcoes.href ? opcoes.href(mod, i) : '#' + mod.id, 'data-blur-on-click': true,
          onclick: opcoes.aoClicar ? function (e) { opcoes.aoClicar(i, e); } : null
        }, [
          el('span', { class: 'module-num', 'aria-hidden': 'true' }, [feito ? icone('check', 16) : String(i + 1)]),
          el('span', { class: 'overview-text' }, [
            el('strong', { text: mod.titulo }),
            mod.resumo ? el('span', { text: mod.resumo }) : null
          ]),
          feito ? el('span', { class: 'sr-only', text: ' (' + t('concluido') + ')' }) : null,
          icone('seta', 18, 'overview-arrow')
        ])
      ]);
    }));
  }

  function renderProjeto(b) {
    return el('article', { class: 'project', 'aria-label': t('projeto') + ': ' + b.nome }, [
      el('div', { class: 'project-head' }, [
        el('span', { class: 'project-ico' }, [icone('pasta', 22)]),
        el('div', null, [
          el('p', { class: 'project-kicker', text: t('projeto') }),
          el('h3', { class: 'project-name', text: b.nome }),
          b.descricao ? el('p', { class: 'project-desc', text: b.descricao }) : null
        ])
      ]),
      el('div', { class: 'project-grid' }, [
        el('div', { class: 'project-section project-instr' }, [
          el('h4', { text: t('instrucoesProjeto') }),
          md(b.instrucoes, 'project-instructions')
        ]),
        el('div', { class: 'project-section project-files' }, [
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
    ]);
  }

  function renderSkill(b) {
    return el('article', { class: 'skill-file', 'aria-label': t('skill') + ': ' + b.nome }, [
      el('div', { class: 'skill-file-tab' }, [icone('skill', 16), el('span', null, [b.nome + ' / ', el('strong', { text: t('skillArquivo') })])]),
      el('dl', { class: 'skill-fields' }, [
        el('div', null, [el('dt', { text: t('skillNome') }), el('dd', null, [el('code', { text: b.nome })])]),
        el('div', null, [el('dt', { text: t('skillDescricao') }), el('dd', { text: b.descricao })]),
        el('div', null, [el('dt', { text: t('skillInstrucoes') }), el('dd', null, [
          el('ul', { class: 'skill-steps' }, (b.instrucoes || []).map(function (i) { return el('li', { html: inline(i) }); }))
        ])])
      ])
    ]);
  }

  function renderTabela(b) {
    var colunas = b.colunas || [];
    return el('div', { class: 'table-wrap' }, [
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
    ]);
  }

  /* Interface simulada do tour. Retorna { elemento, alvos: { id: elemento } } */
  function renderMock(ui) {
    ui = ui || {};
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
    return { elemento: mock, alvos: alvos };
  }

  function renderPratica(b, nivel) {
    return el('div', { class: 'practice' }, [
      el('div', { class: 'practice-head' }, [
        el('span', { class: 'practice-ico' }, [icone('praticar', 20)]),
        el(nivel || 'h2', { class: 'practice-title', text: b.titulo || t('agoraTente') })
      ]),
      b.texto ? md(b.texto, 'practice-text') : null,
      el('pre', { class: 'prompt-box', text: b.prompt }),
      el('div', { class: 'practice-actions' }, [
        botaoCopiar(t('copiarPrompt'), function () { return b.prompt; }, t('promptCopiado'), 'btn btn-primary'),
        el('a', { class: 'btn', href: b.link || 'https://claude.ai', target: '_blank', rel: 'noopener noreferrer' }, [
          el('span', { text: t('abrirClaude') }), icone('externo', 16), el('span', { class: 'sr-only', text: ' ' + t('novaAba') })
        ])
      ])
    ]);
  }

  function renderLinks(itens) {
    return el('ul', { class: 'links' }, (itens || []).map(function (l) {
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
    }));
  }

  var exportar = {
    Animacao: Animacao, rolarAte: rolarAte,
    renderMensagem: renderMensagem, criarChat: criarChat,
    criarVisualizadorArtefatos: criarVisualizadorArtefatos, textoDoArtefato: textoDoArtefato,
    renderCards: renderCards, renderDestaque: renderDestaque, renderAgenda: renderAgenda,
    renderProjeto: renderProjeto, renderSkill: renderSkill, renderTabela: renderTabela,
    renderMock: renderMock, renderPratica: renderPratica, renderLinks: renderLinks
  };
  Object.keys(exportar).forEach(function (k) { T[k] = exportar[k]; });
})();
