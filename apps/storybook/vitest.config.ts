import tailwindcss from "@tailwindcss/vite";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

// Testes visuais: renderizam as histórias num Chrome de verdade (com CSS),
// coisa que o jsdom dos testes de componente não faz.
export default defineConfig({
  plugins: [tailwindcss()],
  test: {
    include: ["src/**/*.browser.test.tsx"],
    browser: {
      enabled: true,
      headless: true,
      // No Mac usa o Chrome instalado; no CI usa o Chromium baixado pelo Playwright.
      provider: playwright({ launchOptions: process.env.CI ? {} : { channel: "chrome" } }),
      instances: [{ browser: "chromium" }],
    },
  },
});
