import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import BooksPage from '../BooksPage';
import { server } from '../../../../test/mocks/server';
import { http, HttpResponse } from 'msw';

describe('BooksPage', () => {
    beforeEach(() => {
        localStorage.clear();
        localStorage.setItem('token', 'mock');
    });

    const renderPage = () => {
        render(
            <MemoryRouter>
                <BooksPage />
            </MemoryRouter>
        );
    };

    it('Exibe todos os livros após carregamento', async () => {
        renderPage();

        await waitFor(() => {
            expect(screen.getByText('Livro 1')).toBeInTheDocument();
        });
    });

    it('Estado vazio quando API retorna []', async () => {
        server.use(
            http.get('http://localhost:8080/api/books', () => {
                return HttpResponse.json([]);
            })
        );
        renderPage();

        await waitFor(() => {
            expect(screen.getByText('Nenhum livro cadastrado')).toBeInTheDocument();
        });
    });

    it('Erro quando API retorna 500', async () => {
        server.use(
            http.get('http://localhost:8080/api/books', () => {
                return HttpResponse.json({ message: 'Erro interno' }, { status: 500 });
            })
        );
        renderPage();

        await waitFor(() => {
            expect(screen.getByText('Erro interno')).toBeInTheDocument();
        });
    });

    it('Navega para /livros/novo ao clicar em Novo Livro', async () => {
        server.use(
            http.get('http://localhost:8080/api/books', () => {
                return HttpResponse.json([]);
            })
        );
        renderPage();

        await waitFor(() => {
            expect(screen.getByText('Nenhum livro cadastrado')).toBeInTheDocument();
        });
        
        const novoLivroLinks = screen.getAllByRole('link', { name: /Novo livro/i });
        expect(novoLivroLinks[0]).toHaveAttribute('href', '/livros/novo');
    });

    it('Navega para edição ao clicar em Editar', async () => {
        renderPage();

        await waitFor(() => {
            const editLink = screen.getByRole('link', { name: /Editar/i });
            expect(editLink).toHaveAttribute('href', '/livros/1/editar');
        });
    });
});
