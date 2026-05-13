import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import MainLayout from '../MainLayout';
import { AuthProvider } from '../../../../contexts/AuthContext.jsx';

describe('MainLayout', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('Renderiza o layout com sidebar e navbar', async () => {
        localStorage.setItem('token', 'mock-jwt-token');
        render(
            <MemoryRouter>
                <AuthProvider>
                    <MainLayout />
                </AuthProvider>
            </MemoryRouter>
        );

        expect(screen.getByText('Gerenciador de Biblioteca Pessoal')).toBeInTheDocument();
        expect(screen.getByText('Minha Biblioteca')).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByText('Test User')).toBeInTheDocument();
        });
    });

    it('Abre e fecha o sidebar em telas pequenas', async () => {
        localStorage.setItem('token', 'mock-jwt-token');
        render(
            <MemoryRouter>
                <AuthProvider>
                    <MainLayout />
                </AuthProvider>
            </MemoryRouter>
        );

        const menuBtn = screen.getByRole('button', { name: '' }); 
        await userEvent.click(menuBtn);

        const dashboardLink = screen.getByText('Dashboard');
        await userEvent.click(dashboardLink);
    });
});
