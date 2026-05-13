import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import DashboardPage from '../DashboardPage';
import { AuthProvider } from '../../../../contexts/AuthContext.jsx';

describe('DashboardPage', () => {
    it('Renderiza o dashboard e o nome do usuário vindo da auth', async () => {
        // Mock user via localStorage que será restaurado no AuthProvider
        localStorage.setItem('token', 'mock-jwt-token');
        
        render(
            <MemoryRouter>
                <AuthProvider>
                    <DashboardPage />
                </AuthProvider>
            </MemoryRouter>
        );

        expect(screen.getByText(/Bem-vindo/i)).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByText(/Test User/i)).toBeInTheDocument();
        });
    });

    it('Renderiza o dashboard sem o nome se não houver usuário', async () => {
        localStorage.clear();
        render(
            <MemoryRouter>
                <AuthProvider>
                    <DashboardPage />
                </AuthProvider>
            </MemoryRouter>
        );

        expect(screen.getByText(/Bem-vindo/i)).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.queryByText(/Test User/i)).not.toBeInTheDocument();
        });
    });
});
