// Testes E2E (apenas desenvolvimento). Rodam contra index.html via file://.
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: '.',
  testMatch: /.*\.spec\.js/,
  timeout: 30000,
  fullyParallel: true,
  reporter: [['list']],
  use: { browserName: 'chromium' },
  projects: [
    { name: 'desktop-1440', use: { viewport: { width: 1440, height: 900 } } },
    { name: 'mobile-375', use: { viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true } }
  ]
});
