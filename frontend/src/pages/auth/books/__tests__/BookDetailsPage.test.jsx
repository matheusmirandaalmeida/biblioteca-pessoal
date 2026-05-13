import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import BookDetailsPage from '../BookDetailsPage';
import { server } from '../../../../test/mocks/server';
import { http, HttpResponse } from 'msw';

describe('BookDetailsPage', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    const renderPage = (id = '1') => {
        render(
            <MemoryRouter initialEntries={[`/livros/${id}`]}>
                <Routes>
                    <Route path="/livros/:id" element={<BookDetailsPage />} />
                    <Route path="/livros" element={<div data-testid="livros-mock">Livros</div>} />
                </Routes>
            </MemoryRouter>
        );
    };

    it('Deleta livro e remove da lista (redireciona)', async () => {
        renderPage('1');

        await waitFor(() => {
            expect(screen.getByText('Livro 1')).toBeInTheDocument();
        });

        const btns = screen.getAllByRole('button', { name: /Excluir/i });
        await userEvent.click(btns[0]);
        
        const confirmBtns = screen.getAllByRole('button', { name: 'Excluir' });
        await userEvent.click(confirmBtns[1]);

        await waitFor(() => {
            expect(screen.getByTestId('livros-mock')).toBeInTheDocument();
        });
    });

    it('Cancela deleção mantém livro (modal fecha)', async () => {
        renderPage('1');

        await waitFor(() => {
            expect(screen.getByText('Livro 1')).toBeInTheDocument();
        });

        const btns = screen.getAllByRole('button', { name: /Excluir/i });
        await userEvent.click(btns[0]);
        
        // click Cancel
        await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

        expect(screen.queryByText(/Tem certeza que deseja excluir o livro/)).not.toBeInTheDocument();
    });

    it('Erro na deleção exibe alerta', async () => {
        server.use(
            http.delete('http://localhost:8080/api/books/:id', () => {
                return HttpResponse.json({ message: 'Erro de permissão' }, { status: 403 });
            })
        );

        renderPage('1');

        await waitFor(() => {
            expect(screen.getByText('Livro 1')).toBeInTheDocument();
        });

        const btns = screen.getAllByRole('button', { name: /Excluir/i });
        await userEvent.click(btns[0]);
        
        const confirmBtns = screen.getAllByRole('button', { name: 'Excluir' });
        await userEvent.click(confirmBtns[1]);

        await waitFor(() => {
            expect(screen.getByText('Erro de permissão')).toBeInTheDocument();
        });
    });



    it('Navega para edição ao clicar em Editar', async () => {
        render(
            <MemoryRouter initialEntries={[`/livros/1`]}>
                <Routes>
                    <Route path="/livros/:id" element={<BookDetailsPage />} />
                    <Route path="/livros/1/editar" element={<div data-testid="edit-mock">Edit</div>} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Livro 1')).toBeInTheDocument();
        });

        const editarBtn = screen.getByRole('button', { name: 'Editar' });
        await userEvent.click(editarBtn);
        
        await waitFor(() => {
            expect(screen.getByTestId('edit-mock')).toBeInTheDocument();
        });
    });

    it('Navega para lista ao clicar em Voltar na página normal', async () => {
        renderPage('1');

        await waitFor(() => {
            expect(screen.getByText('Livro 1')).toBeInTheDocument();
        });

        const voltarBtn = screen.getByRole('button', { name: 'Voltar' });
        await userEvent.click(voltarBtn);
        
        await waitFor(() => {
            expect(screen.getByTestId('livros-mock')).toBeInTheDocument();
        });
    });

    it('Exibe mensagem de rede genérica em caso de erro 500 sem message', async () => {
        server.use(
            http.get('http://localhost:8080/api/books/:id', () => {
                return HttpResponse.error();
            })
        );

        renderPage('1');

        await waitFor(() => {
            expect(screen.getByText('Erro ao carregar detalhes do livro.')).toBeInTheDocument();
        });
    });
});
