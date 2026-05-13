import '@testing-library/jest-dom';
import { server } from './mocks/server';
import { beforeAll, afterEach, afterAll, vi } from 'vitest';

// Use preview mode para evitar problemas com as rotas
vi.mock('../config/env', () => ({
  PREVIEW_MODE: false,
  BOOKS_PREVIEW_MODE: false,
}));

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));

afterEach(() => {
  server.resetHandlers();
  localStorage.clear();
  vi.clearAllMocks();
});

afterAll(() => server.close());
