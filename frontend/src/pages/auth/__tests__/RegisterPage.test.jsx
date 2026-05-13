import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import RegisterPage from '../RegisterPage';
import { AuthProvider } from '../../../contexts/AuthContext.jsx';
import { server } from '../../../test/mocks/server';
import { http, HttpResponse } from 'msw';

describe('RegisterPage', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    const renderPage = () => {
        return render(
            <MemoryRouter initialEntries={['/cadastro']}>
                <AuthProvider>
                    <Routes>
                        <Route path="/cadastro" element={<RegisterPage />} />
                        <Route path="/login" element={<div data-testid="login-mock">Login</div>} />
                    </Routes>
                </AuthProvider>
            </MemoryRouter>
        );
    };

    it('Renderiza campos e botão', () => {
        const { container } = renderPage();
        expect(container.querySelector('input[name="nome"]')).toBeInTheDocument();
        expect(container.querySelector('input[name="email"]')).toBeInTheDocument();
        expect(container.querySelector('input[name="senha"]')).toBeInTheDocument();
        expect(container.querySelector('input[name="confirmarSenha"]')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Cadastrar/i })).toBeInTheDocument();
    });

    it('Validações parametrizadas (campos vazios, senhas não coincidem)', async () => {
        const { container } = renderPage();
        const btn = screen.getByRole('button', { name: /Cadastrar/i });
        
        // Empty
        await userEvent.click(btn);
        await waitFor(() => {
            expect(screen.getByText('Preencha todos os campos.')).toBeInTheDocument();
        });

        // Passwords do not match
        await userEvent.type(container.querySelector('input[name="nome"]'), 'Test');
        await userEvent.type(container.querySelector('input[name="email"]'), 'test@test.com');
        await userEvent.type(container.querySelector('input[name="senha"]'), '123');
        await userEvent.type(container.querySelector('input[name="confirmarSenha"]'), '456');
        await userEvent.click(btn);
        await waitFor(() => {
            expect(screen.getByText('As senhas não coincidem.')).toBeInTheDocument();
        });
    });

    it('Cadastro bem-sucedido exibe mensagem e redireciona', async () => {
        const { container } = renderPage();

        await userEvent.type(container.querySelector('input[name="nome"]'), 'Test');
        await userEvent.type(container.querySelector('input[name="email"]'), 'new@example.com');
        await userEvent.type(container.querySelector('input[name="senha"]'), 'password123');
        await userEvent.type(container.querySelector('input[name="confirmarSenha"]'), 'password123');
        
        await userEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

        await waitFor(() => {
            expect(screen.getByText('Cadastro realizado com sucesso. Faça login para continuar.')).toBeInTheDocument();
        });

        // Wait for redirect timeout
        await waitFor(() => {
            expect(screen.getByTestId('login-mock')).toBeInTheDocument();
        }, { timeout: 3000 });
    });

    it('Email duplicado exibe erro', async () => {
        const { container } = renderPage();

        await userEvent.type(container.querySelector('input[name="nome"]'), 'Test');
        await userEvent.type(container.querySelector('input[name="email"]'), 'duplicate@example.com');
        await userEvent.type(container.querySelector('input[name="senha"]'), 'password123');
        await userEvent.type(container.querySelector('input[name="confirmarSenha"]'), 'password123');
        
        await userEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

        await waitFor(() => {
            expect(screen.getByText('Email já cadastrado')).toBeInTheDocument();
        });
    });

    it('Erro 500 exibe erro genérico', async () => {
        server.use(
            http.post('http://localhost:8080/auth/register', () => {
                return HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 });
            })
        );
        const { container } = renderPage();

        await userEvent.type(container.querySelector('input[name="nome"]'), 'Test');
        await userEvent.type(container.querySelector('input[name="email"]'), 'error@example.com');
        await userEvent.type(container.querySelector('input[name="senha"]'), 'password123');
        await userEvent.type(container.querySelector('input[name="confirmarSenha"]'), 'password123');
        
        await userEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

        await waitFor(() => {
            expect(screen.getByText('Internal Server Error')).toBeInTheDocument();
        });
    });
});
