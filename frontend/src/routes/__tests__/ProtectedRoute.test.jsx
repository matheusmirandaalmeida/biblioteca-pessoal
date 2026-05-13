import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import ProtectedRoute from '../ProtectedRoute';
import { AuthProvider } from '../../contexts/AuthContext.jsx';
import { server } from '../../test/mocks/server';
import { http, HttpResponse } from 'msw';

describe('ProtectedRoute', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('Exibe conteúdo durante loading (Loading component)', async () => {
        localStorage.setItem('token', 'mock-jwt-token');
        server.use(
            http.get('http://localhost:8080/auth/me', async () => {
                await new Promise(r => setTimeout(r, 100));
                return HttpResponse.json({ id: 1, nome: 'Test', email: 'test@example.com' });
            })
        );
        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <AuthProvider>
                    <Routes>
                        <Route path="/dashboard" element={
                            <ProtectedRoute>
                                <div data-testid="protected-content">Conteúdo Protegido</div>
                            </ProtectedRoute>
                        } />
                    </Routes>
                </AuthProvider>
            </MemoryRouter>
        );
        expect(screen.getByText('Verificando sessão...')).toBeInTheDocument();
        expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
        
        await waitFor(() => {
            expect(screen.getByTestId('protected-content')).toBeInTheDocument();
        });
    });

    it('Redireciona para login sem token', async () => {
        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <AuthProvider>
                    <Routes>
                        <Route path="/dashboard" element={
                            <ProtectedRoute>
                                <div data-testid="protected-content">Conteúdo Protegido</div>
                            </ProtectedRoute>
                        } />
                        <Route path="/login" element={<div data-testid="login-page">Página de Login</div>} />
                    </Routes>
                </AuthProvider>
            </MemoryRouter>
        );
        await waitFor(() => {
            expect(screen.getByTestId('login-page')).toBeInTheDocument();
        });
        expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('Exibe conteúdo com token válido', async () => {
        localStorage.setItem('token', 'mock-jwt-token');
        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <AuthProvider>
                    <Routes>
                        <Route path="/dashboard" element={
                            <ProtectedRoute>
                                <div data-testid="protected-content">Conteúdo Protegido</div>
                            </ProtectedRoute>
                        } />
                    </Routes>
                </AuthProvider>
            </MemoryRouter>
        );
        await waitFor(() => {
            expect(screen.getByTestId('protected-content')).toBeInTheDocument();
        });
    });
});
