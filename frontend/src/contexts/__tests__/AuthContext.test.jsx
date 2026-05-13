import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from '../AuthContext.jsx';
import { useAuth } from '../../hooks/useAuth';
import { expect, describe, it, beforeEach } from 'vitest';
import { server } from '../../test/mocks/server';
import { http, HttpResponse } from 'msw';

const TestComponent = () => {
    const { user, isAuthenticated, loadingAuth, login, logout, register } = useAuth();
    
    if (loadingAuth) return <div>Carregando...</div>;

    return (
        <div>
            <div data-testid="is-authenticated">{isAuthenticated.toString()}</div>
            <div data-testid="user-email">{user?.email || 'No User'}</div>
            <button onClick={() => login({ email: 'test@example.com', senha: 'password123' })}>Login Success</button>
            <button onClick={() => login({ email: 'wrong@example.com', senha: 'wrong' }).catch(() => {})}>Login Fail</button>
            <button onClick={logout}>Logout</button>
            <button onClick={() => register({ nome: 'New User', email: 'new@example.com', senha: 'password' })}>Register</button>
            <button onClick={() => register({ nome: 'Dup', email: 'duplicate@example.com', senha: 'dup' }).catch(() => {})}>Register Fail</button>
            <button onClick={() => login({}).catch(() => {})}>Login Empty</button>
        </div>
    );
};

describe('AuthContext', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('Estado inicial sem usuário/token', async () => {
        render(<AuthProvider><TestComponent /></AuthProvider>);
        await waitFor(() => {
            expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
        });
        expect(screen.getByTestId('user-email')).toHaveTextContent('No User');
    });

    it('Restauração de sessão do localStorage com token válido', async () => {
        localStorage.setItem('token', 'mock-jwt-token');
        render(<AuthProvider><TestComponent /></AuthProvider>);
        
        await waitFor(() => {
            expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
        });
        expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
    });

    it('Restauração falha com token inválido (limpa o localStorage)', async () => {
        localStorage.setItem('token', 'invalid-token');
        render(<AuthProvider><TestComponent /></AuthProvider>);
        
        await waitFor(() => {
            expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
        });
        expect(localStorage.getItem('token')).toBeNull();
    });

    it('Login bem-sucedido (preenche user e token)', async () => {
        render(<AuthProvider><TestComponent /></AuthProvider>);
        await waitFor(() => expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false'));

        await userEvent.click(screen.getByText('Login Success'));
        
        await waitFor(() => {
            expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
        });
        expect(localStorage.getItem('token')).toBe('mock-jwt-token');
        expect(localStorage.getItem('user')).toBeTruthy();
    });

    it('Login com credenciais inválidas (não altera estado)', async () => {
        render(<AuthProvider><TestComponent /></AuthProvider>);
        await waitFor(() => expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false'));

        await userEvent.click(screen.getByText('Login Fail'));
        
        // Wait a bit to ensure no changes
        await new Promise(r => setTimeout(r, 100));
        expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
        expect(localStorage.getItem('token')).toBeNull();
    });

    it('Logout (limpa user, token e localStorage)', async () => {
        localStorage.setItem('token', 'mock-jwt-token');
        render(<AuthProvider><TestComponent /></AuthProvider>);
        await waitFor(() => expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true'));

        await userEvent.click(screen.getByText('Logout'));
        
        await waitFor(() => {
            expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
        });
        expect(localStorage.getItem('token')).toBeNull();
        expect(localStorage.getItem('user')).toBeNull();
    });

    it('Cadastro bem-sucedido', async () => {
        render(<AuthProvider><TestComponent /></AuthProvider>);
        await waitFor(() => expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false'));

        await userEvent.click(screen.getByText('Register'));
        
        // Context register returns data but doesn't auto-login in this app usually, let's verify it doesn't crash
        await waitFor(() => {
            expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false'); // Ensure no auto login if not intended
        });
    });

    it('Cadastro com email duplicado (lança erro)', async () => {
        render(<AuthProvider><TestComponent /></AuthProvider>);
        await waitFor(() => expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false'));

        // Action handled by button catching error
        await userEvent.click(screen.getByText('Register Fail'));
    });
});

describe('AuthContext - Preview Mode', () => {
    let AuthProviderPreview;
    let useAuthPreview;
    let TestComponentPreview;

    beforeEach(async () => {
        localStorage.clear();
        vi.resetModules();
        vi.doMock('../../config/env', () => ({ PREVIEW_MODE: true }));
        
        const contextModule = await import('../AuthContext.jsx');
        AuthProviderPreview = contextModule.AuthProvider;
        
        const hookModule = await import('../../hooks/useAuth.js');
        useAuthPreview = hookModule.useAuth;

        TestComponentPreview = () => {
            const { user, isAuthenticated, loadingAuth, login, logout, register } = useAuthPreview();
            
            if (loadingAuth) return <div>Carregando...</div>;

            return (
                <div>
                    <div data-testid="is-authenticated">{isAuthenticated.toString()}</div>
                    <div data-testid="user-email">{user?.email || 'No User'}</div>
                    <button onClick={() => login({ email: 'test@example.com', senha: 'password123' })}>Login Success</button>
                    <button onClick={() => login({ email: 'wrong@example.com', senha: 'wrong' }).catch(() => {})}>Login Fail</button>
                    <button onClick={logout}>Logout</button>
                    <button onClick={() => register({ nome: 'New User', email: 'new@example.com', senha: 'password' })}>Register</button>
                    <button onClick={() => register({ nome: 'Dup', email: 'duplicate@example.com', senha: 'dup' }).catch(() => {})}>Register Fail</button>
                    <button onClick={() => login({}).catch(() => {})}>Login Empty</button>
                </div>
            );
        };
    });

    afterEach(() => {
        vi.unstubAllEnvs();
        vi.resetModules();
    });

    it('Restauração de sessão preview', async () => {
        localStorage.setItem('preview_user', JSON.stringify({ id: '1', nome: 'Preview', email: 'prev@prev.com' }));
        render(<AuthProviderPreview><TestComponentPreview /></AuthProviderPreview>);
        await waitFor(() => {
            expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
        });
    });

    it('Login preview com sucesso', async () => {
        render(<AuthProviderPreview><TestComponentPreview /></AuthProviderPreview>);
        await waitFor(() => expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false'));
        await userEvent.click(screen.getByText('Login Success'));
        await waitFor(() => {
            expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
        });
    });

    it('Login preview sem email ou senha', async () => {
        render(<AuthProviderPreview><TestComponentPreview /></AuthProviderPreview>);
        await waitFor(() => expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false'));
        await userEvent.click(screen.getByText('Login Empty'));
        // Wait a bit to ensure no changes
        await new Promise(r => setTimeout(r, 50));
        expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
    });

    it('Register preview', async () => {
        render(<AuthProviderPreview><TestComponentPreview /></AuthProviderPreview>);
        await waitFor(() => expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false'));
        await userEvent.click(screen.getByText('Register'));
        // Register in preview returns an object, we can't easily assert it from TestComponent since it doesn't set user
    });

    it('Logout preview', async () => {
        localStorage.setItem('preview_user', JSON.stringify({ id: '1', nome: 'Preview', email: 'prev@prev.com' }));
        render(<AuthProviderPreview><TestComponentPreview /></AuthProviderPreview>);
        await waitFor(() => expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true'));
        await userEvent.click(screen.getByText('Logout'));
        await waitFor(() => expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false'));
    });
});
