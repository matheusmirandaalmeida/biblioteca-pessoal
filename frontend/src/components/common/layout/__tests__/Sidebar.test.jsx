import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import Sidebar from '../Sidebar';
import { AuthProvider } from '../../../../contexts/AuthContext.jsx';

describe('Sidebar', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('Renderiza informações do usuário do MSW', async () => {
        localStorage.setItem('token', 'mock-jwt-token');
        render(
            <MemoryRouter>
                <AuthProvider>
                    <Sidebar mobileOpen={true} onClose={() => {}} />
                </AuthProvider>
            </MemoryRouter>
        );

        expect(screen.getByText('Minha Biblioteca')).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByText('Test User')).toBeInTheDocument();
        });
    });

    it('Realiza logout e chama o authService.logout', async () => {
        localStorage.setItem('token', 'mock-jwt-token');
        render(
            <MemoryRouter>
                <AuthProvider>
                    <Sidebar mobileOpen={true} onClose={() => {}} />
                </AuthProvider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Test User')).toBeInTheDocument();
        });

        await userEvent.click(screen.getByText('Sair'));
        
        await waitFor(() => {
            expect(localStorage.getItem('token')).toBeNull();
        });
    });
});
