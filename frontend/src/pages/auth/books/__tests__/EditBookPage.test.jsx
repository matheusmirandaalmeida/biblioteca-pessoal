import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import EditBookPage from '../EditBookPage';
import { server } from '../../../../test/mocks/server';
import { http, HttpResponse } from 'msw';

describe('EditBookPage', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    const renderPage = (id = '1') => {
        return render(
            <MemoryRouter initialEntries={[`/livros/${id}/editar`]}>
                <Routes>
                    <Route path="/livros/:id/editar" element={<EditBookPage />} />
                    <Route path="/livros/:id" element={<div data-testid="details-mock">Details</div>} />
                </Routes>
            </MemoryRouter>
        );
    };

    it('Modo edição: campos pré-preenchidos com dados da API', async () => {
        renderPage('1');

        await waitFor(() => {
            expect(screen.getByDisplayValue('Livro 1')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Autor 1')).toBeInTheDocument();
        });
    });

    it('Edição bem-sucedida redireciona para detalhes', async () => {
        const { container } = renderPage('1');

        await waitFor(() => {
            expect(screen.getByDisplayValue('Livro 1')).toBeInTheDocument();
        });

        await userEvent.clear(container.querySelector('input[name="titulo"]'));
        await userEvent.type(container.querySelector('input[name="titulo"]'), 'Livro Atualizado');
        
        await userEvent.click(screen.getByRole('button', { name: /Salvar Alterações/i }));

        await waitFor(() => {
            expect(screen.getByTestId('details-mock')).toBeInTheDocument();
        });
    });

    it('Livro inexistente exibe erro', async () => {
        server.use(
            http.get('http://localhost:8080/api/books/:id', () => {
                return HttpResponse.json({ message: 'Não encontrado' }, { status: 404 });
            })
        );
        renderPage('999');

        await waitFor(() => {
            expect(screen.getByText('Não encontrado')).toBeInTheDocument();
        });
    });

    it('Erro na edição (salvar) exibe alerta', async () => {
        server.use(
            http.put('http://localhost:8080/api/books/:id', () => {
                return HttpResponse.json({ message: 'Erro ao editar' }, { status: 500 });
            })
        );
        const { container } = renderPage('1');

        await waitFor(() => {
            expect(screen.getByDisplayValue('Livro 1')).toBeInTheDocument();
        });

        await userEvent.clear(container.querySelector('input[name="titulo"]'));
        await userEvent.type(container.querySelector('input[name="titulo"]'), 'Livro Atualizado');
        
        await userEvent.click(screen.getByRole('button', { name: /Salvar Alterações/i }));

        await waitFor(() => {
            expect(screen.getByText('Erro ao editar')).toBeInTheDocument();
        });
    });

    it('Campos vazios ao editar exibem erro', async () => {
        const { container } = renderPage('1');

        await waitFor(() => {
            expect(screen.getByDisplayValue('Livro 1')).toBeInTheDocument();
        });

        await userEvent.clear(container.querySelector('input[name="titulo"]'));
        await userEvent.clear(container.querySelector('input[name="autor"]'));
        
        await userEvent.click(screen.getByRole('button', { name: /Salvar Alterações/i }));

        await waitFor(() => {
            expect(screen.getByText('Preencha título e autor.')).toBeInTheDocument();
        });
    });

    it('Cancela a edição redireciona para detalhes', async () => {
        renderPage('1');

        await waitFor(() => {
            expect(screen.getByDisplayValue('Livro 1')).toBeInTheDocument();
        });
        
        await userEvent.click(screen.getByRole('button', { name: /Cancelar/i }));

        await waitFor(() => {
            expect(screen.getByTestId('details-mock')).toBeInTheDocument();
        });
    });
});
