import { defineConfig, devices } from '@playwright/test';

const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: process.env.CI ? 2 : 2,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  timeout: 30000,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:3000',
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo',
    reducedMotion: 'reduce',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    launchOptions: executablePath
      ? {
          executablePath,
          args: ['--no-sandbox', '--no-zygote', '--disable-dev-shm-usage'],
        }
      : {},
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } },
  ],
  webServer: {
    command: 'npm run dev -- --host 0.0.0.0',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
  },
});
