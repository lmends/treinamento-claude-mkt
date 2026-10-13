// Testes E2E do Ambiente de Treinamento — cobrem os critérios de aceite do PRD.
const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');

const RAIZ = path.resolve(__dirname, '..');
const URL_INDEX = pathToFileURL(path.join(RAIZ, 'index.html')).href;
const HOSTS_PERMITIDOS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

function ehDesktop(testInfo) { return testInfo.project.name.startsWith('desktop'); }

async function abrir(page, hash) {
  // Registra o texto copiado (Clipboard API) para conferência
  await page.addInitScript(() => {
    window.__copiado = null;
    const registrar = (t) => { window.__copiado = t; return Promise.resolve(); };
    try {
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: registrar } });
    } catch (e) { /* ignora */ }
  });
  await page.goto(URL_INDEX + (hash ? '#' + hash : ''));
  await expect(page.locator('#titulo-modulo')).toBeVisible();
}

async function limparArmazenamento(page) {
  await page.evaluate(() => localStorage.clear());
}

test.describe('carregamento e restrições', () => {
  test('abre sem erros, sem rede extra e sem rolagem horizontal em todos os módulos', async ({ page }) => {
    const erros = [];
    const hosts = new Set();
    page.on('pageerror', (e) => erros.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') erros.push(m.text()); });
    page.on('request', (r) => { const u = r.url(); if (/^https?:/.test(u)) hosts.add(new URL(u).host); });

    await abrir(page);
    await limparArmazenamento(page);
    await page.reload();
    for (let i = 1; i <= 7; i++) {
      await expect(page.locator('#progresso-texto')).toHaveText(`Módulo ${i} de 7`);
      const larguras = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
      expect(larguras[0], `rolagem horizontal no módulo ${i}`).toBeLessThanOrEqual(larguras[1]);
      await expect(page.locator('.aviso')).toHaveCount(0);
      if (i < 7) await page.locator('#btn-proximo').click();
    }
    expect(erros).toEqual([]);
    for (const h of hosts) expect(HOSTS_PERMITIDOS).toContain(h);
  });

  test('todo o conteúdo do treinamento fica em content.js', async () => {
    const app = fs.readFileSync(path.join(RAIZ, 'js', 'app.js'), 'utf8');
    for (const termo of ['Café Serra', 'Café de Inverno', 'carrossel-cafe-serra', 'Boas-vindas', 'claude.ai/']) {
      expect(app.includes(termo), `app.js contém "${termo}"`).toBe(false);
    }
    const tudo = ['index.html', 'js/app.js', 'js/content.js', 'css/styles.css']
      .map((f) => fs.readFileSync(path.join(RAIZ, f), 'utf8')).join('\n');
    expect(/api[_-]?key|sk-ant-|anthropic\.com\/v1|fetch\(/i.test(tudo)).toBe(false);
  });
});

test.describe('navegação e persistência', () => {
  test('setas do teclado trocam de módulo e o progresso persiste', async ({ page }) => {
    await abrir(page);
    await limparArmazenamento(page);
    await page.reload();
    await expect(page.locator('#paginacao-contagem')).toHaveText('Módulo 1 de 7');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('#titulo-modulo')).toHaveText('Projetos como base da marca');
    await page.keyboard.press('ArrowLeft');
    await expect(page.locator('#paginacao-contagem')).toHaveText('Módulo 3 de 7');
    await page.goto(URL_INDEX); // sem hash: deve usar o localStorage
    await expect(page.locator('#paginacao-contagem')).toHaveText('Módulo 3 de 7');
  });

  test('lista de módulos navega e marca o atual', async ({ page }, testInfo) => {
    await abrir(page, 'boas-vindas');
    if (!ehDesktop(testInfo)) {
      await page.locator('#btn-menu').click();
      await expect(page.locator('#btn-menu')).toHaveAttribute('aria-expanded', 'true');
    }
    await page.locator('.module-link', { hasText: 'Skills' }).click();
    await expect(page.locator('#titulo-modulo')).toHaveText('Skills');
    await expect(page.locator('.module-link[aria-current="page"]')).toContainText('Skills');
    if (!ehDesktop(testInfo)) await expect(page.locator('#btn-menu')).toHaveAttribute('aria-expanded', 'false');
  });
});

test.describe('chat simulado', () => {
  test('Espaço avança a conversa com digitação e streaming; pular e reiniciar funcionam', async ({ page }) => {
    await abrir(page, 'projetos');
    const chat = page.locator('.chat').first();
    await expect(chat.locator('.msg')).toHaveCount(0);

    await page.locator('body').click({ position: { x: 5, y: 300 } });
    await page.keyboard.press('Space');
    await expect(chat.locator('.composer.is-typing')).toBeVisible();
    await expect(chat.locator('.msg-aluna')).toHaveCount(1, { timeout: 5000 });

    await page.keyboard.press('Space');
    await expect(chat.locator('.thinking')).toBeVisible();
    await expect(chat.locator('.msg-assistente:not([aria-hidden])')).toHaveCount(1, { timeout: 8000 });
    await expect(chat.locator('.msg-assistente strong').first()).toBeVisible();
    await expect(chat.locator('.msg-assistente ol li')).toHaveCount(3);

    await chat.getByRole('button', { name: 'Pular animação' }).click();
    await expect(chat.locator('.msg')).toHaveCount(4);
    await expect(chat.getByRole('button', { name: 'Fim da conversa' })).toBeDisabled();

    await chat.getByRole('button', { name: 'Reiniciar conversa' }).click();
    await expect(chat.locator('.msg')).toHaveCount(0);
  });

  test('área de chat tem aria-live', async ({ page }) => {
    await abrir(page, 'pedir-bem');
    const logs = page.locator('.chat-log');
    expect(await logs.count()).toBeGreaterThan(0);
    await expect(logs.first()).toHaveAttribute('aria-live', 'polite');
    await expect(logs.first()).toHaveAttribute('role', 'log');
  });

  test('nota do instrutor abre pelo ícone "i"', async ({ page }) => {
    await abrir(page, 'projetos');
    const chat = page.locator('.chat').first();
    await chat.getByRole('button', { name: 'Pular animação' }).click();
    const botao = chat.locator('.note-btn').first();
    await expect(chat.locator('.msg-note').first()).toBeHidden();
    await botao.click();
    await expect(botao).toHaveAttribute('aria-expanded', 'true');
    await expect(chat.locator('.msg-note').first()).toBeVisible();
  });

  test('movimento reduzido: mensagens aparecem sem digitação', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();
    await abrir(page, 'projetos');
    const chat = page.locator('.chat').first();
    await chat.getByRole('button', { name: /Avançar/ }).click();
    await expect(chat.locator('.msg-aluna')).toHaveCount(1, { timeout: 300 });
    await chat.getByRole('button', { name: /Avançar/ }).click();
    await expect(chat.locator('.msg-assistente')).toHaveCount(1, { timeout: 300 });
    await ctx.close();
  });
});

test.describe('comparativo', () => {
  test('duas colunas no desktop e abas no celular', async ({ page }, testInfo) => {
    await abrir(page, 'pedir-bem');
    const comp = page.locator('.compare');
    const abas = comp.locator('.compare-tabs');
    if (ehDesktop(testInfo)) {
      await expect(abas).toBeHidden();
      await expect(comp.locator('.compare-antes')).toBeVisible();
      await expect(comp.locator('.compare-depois')).toBeVisible();
    } else {
      await expect(abas).toBeVisible();
      await expect(comp.locator('.compare-depois')).toBeHidden();
      await comp.getByRole('tab', { name: 'Depois' }).click();
      await expect(comp.locator('.compare-depois')).toBeVisible();
      await expect(comp.locator('.compare-antes')).toBeHidden();
      // Avançar a coluna "Antes" troca para a aba dela automaticamente
      await comp.getByRole('tab', { name: 'Antes' }).click();
      await comp.locator('.compare-antes').getByRole('button', { name: 'Pular animação' }).click();
      await page.locator('body').click({ position: { x: 5, y: 5 } });
      await page.keyboard.press('Space');
      await expect(comp.getByRole('tab', { name: 'Depois' })).toHaveAttribute('aria-selected', 'true');
    }
  });
});

test.describe('artefatos, projeto e skill', () => {
  test('skill em uso aparece e o carrossel é navegável e copiável', async ({ page }, testInfo) => {
    await abrir(page, 'skills');
    const chat = page.locator('.chat').nth(1);
    await chat.scrollIntoViewIfNeeded();
    await chat.getByRole('button', { name: /Avançar/ }).click();
    await expect(chat.locator('.msg-aluna')).toHaveCount(1, { timeout: 5000 });
    await chat.getByRole('button', { name: /Avançar/ }).click();
    await expect(chat.locator('.skill-badge.is-loading')).toBeVisible();
    await expect(chat.locator('.skill-badge:not(.is-loading)').first()).toContainText('Skill em uso: carrossel-cafe-serra', { timeout: 5000 });
    await expect(chat.locator('.msg-assistente:not([aria-hidden]) .artifact-chip')).toHaveCount(1, { timeout: 8000 });

    const painel = page.locator('#painel-artefato');
    if (ehDesktop(testInfo)) {
      await expect(painel).toBeVisible(); // abre sozinho no modo apresentação
    } else {
      await expect(painel).toBeHidden();
      await chat.locator('.artifact-chip').click();
      await expect(painel).toBeVisible();
      await expect(painel).toHaveAttribute('role', 'dialog');
    }
    await expect(painel.locator('.slide-count')).toHaveText('Slide 1 de 7');
    await painel.getByRole('button', { name: 'Próximo slide' }).click();
    await expect(painel.locator('.slide-count')).toHaveText('Slide 2 de 7');
    await painel.locator('.carousel').focus();
    await page.keyboard.press('ArrowRight');
    await expect(painel.locator('.slide-count')).toHaveText('Slide 3 de 7');
    await expect(page.locator('#titulo-modulo')).toHaveText('Skills'); // seta não trocou de módulo

    await painel.getByRole('button', { name: 'Copiar texto' }).click();
    const copiado = await page.evaluate(() => window.__copiado);
    expect(copiado).toContain('Slide 1: Tem café que abraça.');
    expect(copiado).toContain('#CaféSerra');
    await expect(page.locator('#toast')).toHaveText('Texto copiado!');

    await page.keyboard.press('Escape');
    await expect(painel).toBeHidden();
  });

  test('módulo 6 gera três artefatos navegáveis em abas', async ({ page }) => {
    await abrir(page, 'reaproveitamento');
    const chat = page.locator('.chat').first();
    await chat.getByRole('button', { name: 'Pular animação' }).click();
    await chat.locator('.artifact-chip').first().click();
    const painel = page.locator('#painel-artefato');
    await expect(painel).toBeVisible();
    const abas = painel.getByRole('tab');
    await expect(abas).toHaveCount(3);
    await abas.nth(1).click();
    await expect(painel.locator('.social-post')).toHaveCount(3);
    await abas.nth(2).click();
    await expect(painel.locator('.email-subject')).toContainText('Do grão à xícara');
    await painel.getByRole('button', { name: 'Copiar texto' }).click();
    expect(await page.evaluate(() => window.__copiado)).toContain('Assunto: Do grão à xícara');
    await painel.getByRole('button', { name: 'Fechar painel' }).click();
    await expect(painel).toBeHidden();
  });

  test('projeto mostra instruções e arquivos; skill mostra nome, descrição e instruções', async ({ page }) => {
    await abrir(page, 'projetos');
    await expect(page.locator('.project-name')).toHaveText('Café Serra – Conteúdo');
    await expect(page.locator('.file-item')).toHaveCount(5);
    await expect(page.locator('.file-item').first()).toContainText('guia-de-tom-de-voz.pdf');
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('.skill-file code')).toHaveText('carrossel-cafe-serra');
    await expect(page.locator('.skill-file li')).toHaveCount(6);
    await expect(page.locator('.table tbody tr')).toHaveCount(5);
  });
});

test.describe('modo estudo', () => {
  test('mostra conversas completas e notas, e persiste', async ({ page }) => {
    await abrir(page, 'pedir-bem');
    await page.getByRole('button', { name: 'Estudo' }).click();
    await expect(page.getByRole('button', { name: 'Estudo' })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.chat-controls')).toHaveCount(0);
    await expect(page.locator('.compare-antes .msg')).toHaveCount(2);
    const notas = page.locator('.msg-note:visible');
    expect(await notas.count()).toBeGreaterThan(3);
    await page.reload();
    await expect(page.getByRole('button', { name: 'Estudo' })).toHaveAttribute('aria-pressed', 'true');
    await page.getByRole('button', { name: 'Apresentação' }).click();
    await expect(page.locator('.chat-controls').first()).toBeVisible();
  });
});

test.describe('prática, tour e links', () => {
  test('card de prática copia o prompt e linka para claude.ai em nova aba', async ({ page }) => {
    await abrir(page, 'pedir-bem');
    const pratica = page.locator('.practice');
    await expect(pratica.getByRole('heading')).toHaveText('Agora tente no Claude');
    await pratica.getByRole('button', { name: 'Copiar prompt' }).click();
    expect(await page.evaluate(() => window.__copiado)).toContain('Crie uma legenda para o Instagram');
    const link = pratica.getByRole('link', { name: /Abrir o Claude/ });
    await expect(link).toHaveAttribute('href', 'https://claude.ai');
    await expect(link).toHaveAttribute('target', '_blank');
  });

  test('módulos práticos têm chamada para prática', async ({ page }) => {
    for (const id of ['pedir-bem', 'projetos', 'skills', 'reaproveitamento']) {
      await abrir(page, id);
      await expect(page.locator('.practice')).toHaveCount(1);
    }
  });

  test('tour destaca os 4 elementos em sequência pelo teclado', async ({ page }) => {
    await abrir(page, 'conhecendo-o-ambiente');
    const alvos = ['campo-mensagem', 'anexar', 'historico', 'projetos'];
    await page.locator('body').click({ position: { x: 5, y: 5 } });
    for (const alvo of alvos) {
      await page.keyboard.press('Space');
      await expect(page.locator('[data-alvo="' + alvo + '"]')).toHaveClass(/is-highlight/);
    }
    await expect(page.locator('.is-highlight')).toHaveCount(1);
    await expect(page.locator('.tour-step')).toHaveText('Destaque 4 de 4');
  });

  test('módulo 7 traz os três links oficiais', async ({ page }) => {
    await abrir(page, 'cuidados-e-proximos-passos');
    for (const url of ['https://claude.ai', 'https://support.claude.com', 'https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview']) {
      await expect(page.locator('a.link-card[href="' + url + '"]')).toHaveAttribute('target', '_blank');
    }
  });
});

test.describe('tema', () => {
  test('segue o tema escuro do sistema e permite alternar', async ({ browser }) => {
    const ctx = await browser.newContext({ colorScheme: 'dark' });
    const page = await ctx.newPage();
    await abrir(page);
    await limparArmazenamento(page);
    await page.reload();
    const fundo = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(await fundo()).toBe('rgb(23, 24, 26)');
    await page.locator('#btn-tema').click();
    expect(await fundo()).toBe('rgb(250, 249, 247)');
    await ctx.close();
  });
});
