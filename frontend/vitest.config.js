import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    environmentOptions: {
      jsdom: {
        url: 'http://localhost:3000'
      }
    },
    setupFiles: ['./src/test/setup.js'],
    globals: true,
    env: {
      VITE_API_URL: 'http://localhost:8080'
    },
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'lcov', 'html'],
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/test/**', 'src/main.jsx', 'src/**/__tests__/**', 'src/config/**'],
      thresholds: { lines: 80, functions: 80, branches: 80, statements: 80 },
    },
  },
});
