/* ==========================================================================
   Ambiente de Treinamento — capa
   Página leve: só monta os caminhos (apresentar / estudar) e a lista de
   módulos com o progresso salvo. Não carrega o motor de chat nem os slides.
   ========================================================================== */
(function () {
  'use strict';

  var T = window.Treino;
  var raiz = document.getElementById('inicio');
  if (!T || !T.MODULOS.length) {
    raiz.innerHTML = '<p class="aviso">' + (T ? T.t('erroConteudo') : 'Erro: js/content.js') + '</p>';
    return;
  }

  var t = T.t, el = T.el, icone = T.icone;
  var MODULOS = T.MODULOS;
  var APRES = T.C.apresentacao || {};
  var estado = T.lerEstado();
  var feitos = {};
  estado.estudo.concluidos.forEach(function (id) { feitos[id] = true; });
  var nFeitos = Object.keys(feitos).length;

  // Posição salva na apresentação: "modulo/n" ou "modulo" (abertura)
  function rotuloDeck() {
    var id = estado.deck && estado.deck.slide;
    if (!id || id === 'inicio') return null;
    var partes = String(id).split('/');
    var mi = T.indicePorId(partes[0]);
    if (mi < 0) return null;
    return { href: 'apresentacao.html#' + id, texto: t('continuarModulo', { titulo: MODULOS[mi].titulo }) };
  }

  function rotuloEstudo() {
    var mi = T.indicePorId(estado.estudo.modulo);
    if (mi < 0) return null;
    return { href: 'estudo.html#' + MODULOS[mi].id, texto: t('continuarModulo', { titulo: MODULOS[mi].titulo }) };
  }

  function cartaoModo(tipo, iconeNome, titulo, texto, inicio, continuar) {
    return el('article', { class: 'modo modo-' + tipo }, [
      el('span', { class: 'modo-ico' }, [icone(iconeNome, 26)]),
      el('h2', { text: titulo }),
      el('p', { text: texto }),
      el('div', { class: 'modo-acoes' }, [
        el('a', { class: 'btn btn-primary', href: continuar ? continuar.href : inicio }, [
          el('span', { text: continuar ? continuar.texto : t('comecar') }), icone('seta', 18)
        ]),
        continuar ? el('a', { class: 'btn btn-ghost', href: inicio + (tipo === 'apresentar' ? '#inicio' : '#' + MODULOS[0].id) }, [el('span', { text: t('comecar') })]) : null
      ])
    ]);
  }

  // Topo
  var topo = document.getElementById('topo');
  topo.appendChild(el('span', { class: 'inicio-marca' }, [T.marcaSite(30), el('strong', { text: t('nomeSite') })]));
  topo.appendChild(T.botaoTema());
  T.aplicarTema();

  // Herói
  raiz.appendChild(el('section', { class: 'heroi' }, [
    el('p', { class: 'heroi-kicker', text: APRES.kicker || t('nomeSite') }),
    el('h1', { class: 'heroi-titulo', text: APRES.titulo || '' }),
    APRES.subtitulo ? el('p', { class: 'heroi-sub', text: APRES.subtitulo }) : null
  ]));

  // Caminhos
  raiz.appendChild(el('section', { class: 'modos' }, [
    cartaoModo('apresentar', 'slides', t('capaApresentarTitulo'), t('capaApresentarTexto'), 'apresentacao.html', rotuloDeck()),
    cartaoModo('estudar', 'livro', t('capaEstudarTitulo'), t('capaEstudarTexto'), 'estudo.html', rotuloEstudo())
  ]));

  // Módulos
  raiz.appendChild(el('section', { class: 'modulos', 'aria-labelledby': 'modulos-titulo' }, [
    el('div', { class: 'modulos-cab' }, [
      el('h2', { id: 'modulos-titulo', text: t('capaModulosTitulo') }),
      el('p', { class: 'modulos-progresso' }, [
        el('span', { class: 'mini-barra', 'aria-hidden': 'true' }, [el('span', { style: { width: (nFeitos / MODULOS.length * 100) + '%' } })]),
        el('span', { text: t('capaProgresso', { n: nFeitos, total: MODULOS.length }) })
      ])
    ]),
    el('ol', { class: 'modulos-lista' }, MODULOS.map(function (mod, i) {
      var feito = !!feitos[mod.id];
      return el('li', { class: 'mod' + (feito ? ' is-done' : ''), style: { '--i': String(i) } }, [
        el('a', { class: 'mod-link', href: 'estudo.html#' + mod.id }, [
          el('span', { class: 'mod-num', 'aria-hidden': 'true' }, [feito ? icone('check', 18) : String(i + 1).padStart(2, '0')]),
          el('span', { class: 'mod-texto' }, [
            el('strong', { text: mod.titulo }),
            el('span', { text: mod.resumo || mod.resumoCurto || '' }),
            feito ? el('span', { class: 'sr-only', text: ' (' + t('concluido') + ')' }) : null
          ])
        ]),
        el('a', {
          class: 'mod-slides', href: 'apresentacao.html#' + mod.id,
          title: t('capaAbrirSlides', { n: i + 1 }), 'aria-label': t('capaAbrirSlides', { n: i + 1 })
        }, [icone('slides', 18)])
      ]);
    }))
  ]));

  // Rodapé
  var rodape = document.getElementById('rodape');
  rodape.appendChild(el('div', { class: 'atalhos' }, [
    el('h2', { text: t('capaAtalhosTitulo') }),
    el('p', { html: T.comTeclas(t('capaAtalhos')) })
  ]));
  if (APRES.rodape) rodape.appendChild(el('p', { class: 'aviso-sim', text: APRES.rodape }));
})();
