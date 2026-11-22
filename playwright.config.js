import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: 'e2e',
  use: { baseURL: 'http://localhost:5288', viewport: { width: 1400, height: 900 } },
  webServer: { command: 'npx vite --port 5288 --strictPort', url: 'http://localhost:5288', reuseExistingServer: true },
})
