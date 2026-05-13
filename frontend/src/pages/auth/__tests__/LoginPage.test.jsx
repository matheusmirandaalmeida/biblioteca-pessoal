import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import LoginPage from '../LoginPage';
import { AuthProvider } from '../../../contexts/AuthContext.jsx';
import { server } from '../../../test/mocks/server';
import { http, HttpResponse } from 'msw';

describe('LoginPage', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    const renderPage = () => {
        return render(
            <MemoryRouter initialEntries={['/login']}>
                <AuthProvider>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/dashboard" element={<div data-testid="dashboard-mock">Dashboard</div>} />
                    </Routes>
                </AuthProvider>
            </MemoryRouter>
        );
    };

    it('Renderiza campos e botão', () => {
        const { container } = renderPage();
        expect(container.querySelector('input[name="email"]')).toBeInTheDocument();
        expect(container.querySelector('input[name="senha"]')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Entrar/i })).toBeInTheDocument();
    });

    it('Validações parametrizadas (email vazio, senha vazia)', async () => {
        const { container } = renderPage();
        const btn = screen.getByRole('button', { name: /Entrar/i });
        
        // Both empty
        await userEvent.click(btn);
        await waitFor(() => {
            expect(screen.getByText('Preencha email e senha.')).toBeInTheDocument();
        });

        // Password empty
        await userEvent.type(container.querySelector('input[name="email"]'), 'test@test.com');
        await userEvent.click(btn);
        await waitFor(() => {
            expect(screen.getByText('Preencha email e senha.')).toBeInTheDocument();
        });
    });

    it('Login bem-sucedido redireciona para dashboard', async () => {
        const { container } = renderPage();

        await userEvent.type(container.querySelector('input[name="email"]'), 'test@example.com');
        await userEvent.type(container.querySelector('input[name="senha"]'), 'password123');
        
        await userEvent.click(screen.getByRole('button', { name: /Entrar/i }));

        await waitFor(() => {
            expect(screen.getByTestId('dashboard-mock')).toBeInTheDocument();
        });
    });

    it('Erro 401 exibe mensagem de erro', async () => {
        const { container } = renderPage();

        await userEvent.type(container.querySelector('input[name="email"]'), 'test@example.com');
        await userEvent.type(container.querySelector('input[name="senha"]'), 'wrong');
        
        await userEvent.click(screen.getByRole('button', { name: /Entrar/i }));

        await waitFor(() => {
            expect(screen.getByText('Credenciais inválidas')).toBeInTheDocument();
        });
    });

    it('Erro 500 exibe mensagem genérica de erro', async () => {
        server.use(
            http.post('http://localhost:8080/auth/login', () => {
                return HttpResponse.json({ message: 'Erro ao conectar no servidor' }, { status: 500 });
            })
        );
        const { container } = renderPage();

        await userEvent.type(container.querySelector('input[name="email"]'), 'test@example.com');
        await userEvent.type(container.querySelector('input[name="senha"]'), 'wrong');
        
        await userEvent.click(screen.getByRole('button', { name: /Entrar/i }));

        await waitFor(() => {
            expect(screen.getByText('Erro ao conectar no servidor')).toBeInTheDocument();
        });
    });

    it('Link para cadastro funciona (presença do link)', () => {
        renderPage();
        const registerLink = screen.getByRole('link', { name: /Cadastre-se/i });
        expect(registerLink).toBeInTheDocument();
        expect(registerLink).toHaveAttribute('href', '/cadastro');
    });
});
