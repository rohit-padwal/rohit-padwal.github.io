import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  workers: 2,
  use: { baseURL: 'http://127.0.0.1:4175', trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
  webServer: [
    { command: 'node tests/pages-server.mjs', url: 'http://127.0.0.1:4175', reuseExistingServer: false },
    { command: 'node tests/pages-server.mjs', env: { TEST_SITE_DIR: 'dist', TEST_PORT: '4176' }, url: 'http://127.0.0.1:4176', reuseExistingServer: false },
  ],
});
