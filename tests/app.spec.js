// Testes E2E do Ambiente de Treinamento: capa, apresentação em slides e estudo.
const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');

const RAIZ = path.resolve(__dirname, '..');
const url = (arquivo, hash) => pathToFileURL(path.join(RAIZ, arquivo)).href + (hash ? '#' + hash : '');
const HOSTS_PERMITIDOS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

function ehDesktop(testInfo) { return testInfo.project.name.startsWith('desktop'); }

// Registra o texto copiado (Clipboard API) e começa sempre com armazenamento limpo
async function preparar(page, { manterEstado } = {}) {
  await page.addInitScript((manter) => {
    window.__copiado = null;
    const registrar = (t) => { window.__copiado = t; return Promise.resolve(); };
    try { Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: registrar } }); } catch (e) { /* ignora */ }
    if (!manter && !sessionStorage.getItem('__limpo')) { localStorage.clear(); sessionStorage.setItem('__limpo', '1'); }
  }, !!manterEstado);
}

function monitorar(page) {
  const erros = [], hosts = new Set(), arquivos = [];
  page.on('pageerror', (e) => erros.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') erros.push(m.text()); });
  page.on('request', (r) => {
    const u = r.url();
    if (/^https?:/.test(u)) hosts.add(new URL(u).host);
    if (u.startsWith('file:')) arquivos.push(decodeURIComponent(u).split('/').slice(-2).join('/'));
  });
  return { erros, hosts, arquivos };
}

async function abrirDeck(page, hash) {
  await page.goto(url('apresentacao.html', hash));
  await expect(page.locator('.slide')).toHaveCount(1);
}
const slideAtual = (page) => page.locator('.slide:not([aria-hidden="true"])');
const contador = (page) => page.locator('#deck-contador');

async function irParaSlide(page, id) {
  await page.evaluate((id) => {
    const i = window.Deck.slides.findIndex((s) => s.id === id);
    window.Deck.ir(i, { instantaneo: true });
  }, id);
  await expect(slideAtual(page)).toHaveCount(1);
}

async function abrirEstudo(page, hash) {
  await page.goto(url('estudo.html', hash));
  await expect(page.locator('#titulo-modulo')).toBeVisible();
}

/* ======================================================================
   Restrições gerais
   ====================================================================== */
test.describe('restrições', () => {
  test('todo o conteúdo do treinamento fica em content.js e não há credenciais', async () => {
    const logica = ['js/comum.js', 'js/componentes.js', 'js/apresentacao.js', 'js/estudo.js', 'js/inicio.js', 'index.html', 'apresentacao.html', 'estudo.html'];
    for (const f of logica) {
      const texto = fs.readFileSync(path.join(RAIZ, f), 'utf8');
      for (const termo of ['Café Serra', 'Café de Inverno', 'carrossel-cafe-serra', 'Boas-vindas', 'Pedir bem', 'claude.ai/']) {
        expect(texto.includes(termo), `${f} contém "${termo}"`).toBe(false);
      }
    }
    const tudo = fs.readdirSync(path.join(RAIZ, 'js')).map((f) => fs.readFileSync(path.join(RAIZ, 'js', f), 'utf8')).join('\n');
    expect(/api[_-]?key|sk-ant-|anthropic\.com\/v1|fetch\(|type="module"/i.test(tudo)).toBe(false);
  });

  test('capa é leve: não carrega motor de chat nem slides', async ({ page }) => {
    const m = monitorar(page);
    await preparar(page);
    await page.goto(url('index.html'));
    await expect(page.locator('.modo')).toHaveCount(2);
    await expect(page.locator('.mod')).toHaveCount(7);
    expect(m.arquivos.some((a) => /componentes|apresentacao\.js|estudo\.js/.test(a))).toBe(false);
    expect(m.erros).toEqual([]);
    for (const h of m.hosts) expect(HOSTS_PERMITIDOS).toContain(h);
    const sw = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
    expect(sw[0]).toBeLessThanOrEqual(sw[1]);
    await expect(page.locator('.modo-apresentar a.btn-primary')).toHaveAttribute('href', /apresentacao\.html/);
    await expect(page.locator('.modo-estudar a.btn-primary')).toHaveAttribute('href', /estudo\.html/);
  });

  test('deck: todos os slides abrem sem erros, sem rede extra e sem rolagem horizontal', async ({ page }) => {
    const m = monitorar(page);
    await preparar(page);
    await abrirDeck(page);
    const total = await page.evaluate(() => window.Deck.total);
    expect(total).toBeGreaterThan(35);
    for (let i = 0; i < total; i++) {
      await page.evaluate((i) => window.Deck.ir(i, { instantaneo: true, completo: true }), i);
      const r = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth, document.querySelectorAll('.slide .aviso').length]);
      expect(r[0], `rolagem horizontal no slide ${i + 1}`).toBeLessThanOrEqual(r[1]);
      expect(r[2], `bloco desconhecido no slide ${i + 1}`).toBe(0);
    }
    expect(m.erros).toEqual([]);
    for (const h of m.hosts) expect(HOSTS_PERMITIDOS).toContain(h);
  });

  test('estudo: os 7 módulos abrem sem erros e sem rolagem horizontal', async ({ page }) => {
    const m = monitorar(page);
    await preparar(page);
    await abrirEstudo(page);
    for (let i = 1; i <= 7; i++) {
      await expect(page.locator('.module-kicker')).toHaveText(`Módulo ${i} de 7`);
      const r = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
      expect(r[0], `rolagem horizontal no módulo ${i}`).toBeLessThanOrEqual(r[1]);
      await expect(page.locator('.aviso')).toHaveCount(0);
      if (i < 7) await page.locator('.pager-proximo').click();
    }
    expect(m.erros).toEqual([]);
    for (const h of m.hosts) expect(HOSTS_PERMITIDOS).toContain(h);
  });
});

/* ======================================================================
   Apresentação em slides
   ====================================================================== */
test.describe('apresentação', () => {
  test.beforeEach(async ({ page }) => { await preparar(page); });

  test('teclado avança e volta, hash e posição persistem', async ({ page }) => {
    await abrirDeck(page);
    await expect(contador(page)).toHaveText(/^1 \/ \d+$/);
    await expect(slideAtual(page)).toHaveClass(/slide-capa/);
    await page.keyboard.press('ArrowRight');
    await expect(contador(page)).toHaveText(/^2 \//);
    await expect(slideAtual(page)).toHaveClass(/slide-abertura/);
    await expect(page).toHaveURL(/#boas-vindas$/);
    await page.keyboard.press('Space');
    await expect(contador(page)).toHaveText(/^3 \//);
    await page.keyboard.press('ArrowLeft');
    await expect(contador(page)).toHaveText(/^2 \//);
    await page.keyboard.press('3');
    await expect(page).toHaveURL(/#pedir-bem$/);
    await page.keyboard.press('End');
    await expect(page.locator('#btn-avancar')).toBeDisabled();
    await page.keyboard.press('Home');
    await expect(contador(page)).toHaveText(/^1 \//);

    await page.keyboard.press('5');
    await page.goto(url('apresentacao.html'));
    await expect(page).toHaveURL(/#skills$/);
    await expect(slideAtual(page).locator('.abertura-titulo')).toHaveText('Skills');
  });

  test('transição anima a entrada e remove o slide anterior', async ({ page }) => {
    test.skip(!ehDesktop(test.info()), 'basta um tamanho');
    await abrirDeck(page);
    await page.keyboard.press('ArrowRight');
    await expect(slideAtual(page)).toHaveClass(/entra-modulo/);
    await expect(page.locator('.slide')).toHaveCount(1, { timeout: 2000 });
  });

  test('itens passo a passo entram um por avanço', async ({ page }) => {
    await abrirDeck(page);
    await irParaSlide(page, 'pedir-bem/2');
    const cards = slideAtual(page).locator('.card');
    await expect(cards).toHaveCount(4);
    await expect(slideAtual(page).locator('.card.is-visivel')).toHaveCount(0);
    for (let n = 1; n <= 4; n++) {
      await page.keyboard.press('Space');
      await expect(slideAtual(page).locator('.card.is-visivel')).toHaveCount(n);
    }
    await page.keyboard.press('Space');
    await expect(page).toHaveURL(/#pedir-bem\/3$/);
    await page.keyboard.press('ArrowLeft');
    await expect(slideAtual(page).locator('.card.is-visivel')).toHaveCount(4);
  });

  test('conversa animada: digitação, selo da skill e carrossel na coluna de resultado', async ({ page }) => {
    await abrirDeck(page);
    await irParaSlide(page, 'skills/5');
    const s = slideAtual(page);
    await expect(s.locator('.resultado-vazio')).toBeVisible();
    await page.keyboard.press('Space');
    await expect(s.locator('.composer.is-typing')).toBeVisible();
    await page.keyboard.press('Space'); // conclui a digitação
    await expect(s.locator('.msg-aluna')).toHaveCount(1);
    await page.keyboard.press('Space');
    await expect(s.locator('.skill-badge')).toBeVisible();
    await expect(s.locator('.skill-badge')).toContainText('Skill em uso', { timeout: 6000 });
    await expect(s.locator('.resultado .artifact-viewer')).toBeVisible({ timeout: 8000 });
    await expect(s.locator('.ig-count')).toHaveText('Slide 1 de 7');
    await s.locator('.ig-nav button').last().click();
    await expect(s.locator('.ig-count')).toHaveText('Slide 2 de 7');
    await s.locator('.resultado .artifact-foot .btn').click();
    expect(await page.evaluate(() => window.__copiado)).toContain('Slide 1: Tem café que abraça.');
    // Terminada a conversa, o próximo avanço troca de slide
    await page.locator('#palco').focus();
    await page.keyboard.press('Space');
    await expect(page).toHaveURL(/#skills\/6$/);
    // Voltando, a conversa aparece completa
    await page.keyboard.press('ArrowLeft');
    await expect(slideAtual(page).locator('.msg')).toHaveCount(2);
    await expect(slideAtual(page).locator('.resultado .artifact-viewer')).toBeVisible();
  });

  test('módulo 6 gera três artefatos navegáveis em abas', async ({ page }) => {
    await abrirDeck(page);
    await irParaSlide(page, 'reaproveitamento/2');
    await page.evaluate(() => window.Deck.ir(window.Deck.atual(), { forcar: true, instantaneo: true, completo: true }));
    const abas = slideAtual(page).locator('.resultado [role="tab"]');
    await expect(abas).toHaveCount(3);
    await abas.nth(2).click();
    await expect(slideAtual(page).locator('.resultado .email')).toBeVisible();
    await slideAtual(page).locator('.resultado .artifact-foot .btn').click();
    expect(await page.evaluate(() => window.__copiado)).toContain('Assunto: Do grão à xícara');
  });

  test('comparativo avança primeiro o "Antes" e depois o "Depois"', async ({ page }, testInfo) => {
    await abrirDeck(page);
    await irParaSlide(page, 'pedir-bem/1');
    const s = slideAtual(page);
    for (let i = 0; i < 4; i++) {
      await page.keyboard.press('Space');
      await page.keyboard.press('Space');
    }
    await expect(s.locator('.compare-antes .msg')).toHaveCount(2, { timeout: 8000 });
    if (!ehDesktop(testInfo)) {
      await expect(s.locator('.compare-tabs')).toBeVisible();
      await expect(s.locator('.compare-tabs [role="tab"]').nth(1)).toHaveAttribute('aria-selected', 'true');
    }
    await expect(s.locator('.compare-depois .msg').first()).toBeAttached();
  });

  test('tour destaca um ponto da interface por avanço', async ({ page }) => {
    await abrirDeck(page);
    await irParaSlide(page, 'conhecendo-o-ambiente/2');
    const s = slideAtual(page);
    await expect(s.locator('.is-highlight')).toHaveCount(0);
    await page.keyboard.press('Space');
    await expect(s.locator('[data-alvo="campo-mensagem"]')).toHaveClass(/is-highlight/);
    await page.keyboard.press('Space');
    await expect(s.locator('[data-alvo="anexar"]')).toHaveClass(/is-highlight/);
    await expect(s.locator('.tour-balao')).toContainText('Destaque 2 de 4');
  });

  test('visão geral, notas e tela preta', async ({ page }) => {
    await abrirDeck(page);
    await page.keyboard.press('o');
    const vg = page.locator('#visao-geral');
    await expect(vg).toBeVisible();
    await expect(vg.locator('.vg-slide[aria-current="true"]')).toHaveCount(1);
    await vg.locator('.vg-abertura').nth(3).click();
    await expect(vg).toBeHidden();
    await expect(page).toHaveURL(/#projetos$/);

    await irParaSlide(page, 'projetos/2');
    await page.keyboard.press('n');
    await expect(page.locator('#painel-notas')).toBeVisible();
    await expect(page.locator('#notas-corpo')).toContainText('briefing');
    await page.keyboard.press('Escape');
    await expect(page.locator('#painel-notas')).toBeHidden();

    await page.keyboard.press('b');
    await expect(page.locator('#tela-preta')).toBeVisible();
    await page.keyboard.press('x');
    await expect(page.locator('#tela-preta')).toBeHidden();
  });

  test('controles na tela funcionam com toque/clique', async ({ page }) => {
    await abrirDeck(page);
    await page.locator('#btn-avancar').click();
    await expect(contador(page)).toHaveText(/^2 \//);
    await page.locator('#btn-voltar').click();
    await expect(contador(page)).toHaveText(/^1 \//);
    await page.locator('#deck-progresso .seg').nth(2).click();
    await expect(page).toHaveURL(/#pedir-bem$/);
  });

  test('prática no slide copia o prompt', async ({ page }) => {
    await abrirDeck(page);
    await irParaSlide(page, 'pedir-bem/5');
    await slideAtual(page).getByRole('button', { name: 'Copiar prompt' }).click();
    expect(await page.evaluate(() => window.__copiado)).toContain('Crie uma legenda para o Instagram');
    await expect(slideAtual(page).getByRole('link', { name: /Abrir o Claude/ })).toHaveAttribute('href', 'https://claude.ai');
  });

  test('movimento reduzido: mensagens aparecem sem digitação e sem transição', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await preparar(page);
    await abrirDeck(page, 'pedir-bem/4');
    await page.keyboard.press('Space');
    await expect(slideAtual(page).locator('.msg')).toHaveCount(1);
    await expect(slideAtual(page).locator('.composer.is-typing')).toHaveCount(0);
    await page.keyboard.press('Space');
    await expect(slideAtual(page).locator('.msg')).toHaveCount(2);
    await expect(slideAtual(page).locator('.thinking')).toHaveCount(0);
    await ctx.close();
  });

  test('slide anunciado para leitores de tela', async ({ page }) => {
    await abrirDeck(page, 'skills/2');
    await expect(page.locator('#anuncio')).toHaveText(/^Slide \d+ de \d+: Projeto × Skill$/);
    await expect(slideAtual(page)).toHaveAttribute('aria-roledescription', 'slide');
    await expect(slideAtual(page).locator('[role="log"][aria-live="polite"]')).toHaveCount(0);
    await irParaSlide(page, 'skills/4');
    await expect(slideAtual(page).locator('[role="log"][aria-live="polite"]')).toHaveCount(1);
  });
});

/* ======================================================================
   Estudo
   ====================================================================== */
test.describe('estudo', () => {
  test.beforeEach(async ({ page }) => { await preparar(page); });

  test('conversas completas, notas visíveis e artefatos logo abaixo da resposta', async ({ page }) => {
    await abrirEstudo(page, 'reaproveitamento');
    await expect(page.locator('.msg')).toHaveCount(4);
    await expect(page.locator('.msg-note:visible').first()).toBeVisible();
    const viewer = page.locator('.msg .artifact-viewer');
    await expect(viewer).toHaveCount(1);
    await expect(viewer.locator('[role="tab"]')).toHaveCount(3);
    await viewer.locator('[role="tab"]').nth(1).click();
    await expect(viewer.locator('.social-post')).toHaveCount(3);
    await viewer.locator('.artifact-foot .btn').click();
    expect(await page.evaluate(() => window.__copiado)).toContain('Legenda 1 de 3');
  });

  test('"Ver animação" reproduz a conversa no lugar', async ({ page }) => {
    await abrirEstudo(page, 'pedir-bem');
    const chat = page.locator('.block').filter({ hasText: 'Iterar' }).locator('.chat');
    await expect(chat.locator('.msg')).toHaveCount(4);
    await chat.locator('.replay-btn').click();
    await expect(chat.locator('.replay-btn')).toContainText('Mostrar tudo');
    await expect(chat.locator('.msg')).toHaveCount(0);
    await chat.locator('.replay-btn').click();
    await expect(chat.locator('.msg')).toHaveCount(4);
    await expect(chat.locator('.replay-btn')).toContainText('Ver animação');
  });

  test('concluir módulo persiste na lista lateral e na capa', async ({ page }) => {
    await abrirEstudo(page, 'projetos');
    await page.locator('.done-btn').click();
    await expect(page.locator('.done-btn')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#progresso-texto')).toContainText('concluídos: 1');
    await page.reload();
    await expect(page.locator('.done-btn')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.module-link.is-done')).toHaveCount(1);
    await page.goto(url('index.html'));
    await expect(page.locator('.mod.is-done')).toHaveCount(1);
    await expect(page.locator('.modulos-progresso')).toContainText('1 de 7');
    await expect(page.locator('.modo-estudar .btn-primary')).toContainText('Projetos como base da marca');
  });

  test('setas trocam de módulo e o módulo persiste', async ({ page }) => {
    await abrirEstudo(page);
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('.module-kicker')).toHaveText('Módulo 3 de 7');
    await expect(page).toHaveURL(/#pedir-bem$/);
    await page.goto(url('estudo.html'));
    await expect(page.locator('.module-kicker')).toHaveText('Módulo 3 de 7');
    await expect(page.locator('.meta-link')).toHaveAttribute('href', 'apresentacao.html#pedir-bem');
  });

  test('índice, tempo de leitura e tour estático', async ({ page }) => {
    await abrirEstudo(page, 'conhecendo-o-ambiente');
    await expect(page.locator('.meta-item').first()).toContainText(/min de leitura/);
    await expect(page.locator('.tour-list li')).toHaveCount(4);
    await expect(page.locator('.tour-marker')).toHaveCount(4);
    await page.locator('.toc a').last().click();
    await expect(page.locator('.toc a')).not.toHaveCount(0);
  });

  test('comparativo vira abas em telas estreitas', async ({ page }, testInfo) => {
    await abrirEstudo(page, 'pedir-bem');
    const tabs = page.locator('.compare .compare-tabs');
    if (ehDesktop(testInfo)) {
      await expect(tabs).toBeHidden();
      await expect(page.locator('.compare-depois')).toBeVisible();
    } else {
      await expect(tabs).toBeVisible();
      await expect(page.locator('.compare-depois')).toBeHidden();
      await tabs.getByRole('tab', { name: 'Depois' }).click();
      await expect(page.locator('.compare-depois')).toBeVisible();
    }
  });

  test('tema escuro alterna e vale para todas as páginas', async ({ page }) => {
    await abrirEstudo(page);
    const fundo = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    const claro = await fundo();
    await page.locator('[data-acao="tema"]').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', /claro|escuro/);
    expect(await fundo()).not.toBe(claro);
    const tema = await page.locator('html').getAttribute('data-theme');
    await page.goto(url('apresentacao.html'));
    await expect(page.locator('html')).toHaveAttribute('data-theme', tema);
  });
});
