import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import CreateBookPage from '../CreateBookPage';
import { server } from '../../../../test/mocks/server';
import { http, HttpResponse } from 'msw';

describe('CreateBookPage', () => {
    beforeEach(() => {
        localStorage.clear();
        localStorage.setItem('token', 'mock');
    });

    const renderPage = () => {
        return render(
            <MemoryRouter initialEntries={['/livros/novo']}>
                <Routes>
                    <Route path="/livros/novo" element={<CreateBookPage />} />
                    <Route path="/livros" element={<div data-testid="livros-mock">Livros</div>} />
                </Routes>
            </MemoryRouter>
        );
    };

    it('Modo pesquisa e criação: sucesso na pesquisa e cadastro redireciona para lista', async () => {
        renderPage();

        // Pesquisar
        await userEvent.type(screen.getByPlaceholderText(/Título, autor ou ISBN/i), 'External Book');
        await userEvent.click(screen.getByRole('button', { name: /Buscar/i }));

        await waitFor(() => {
            expect(screen.getByText('External Book')).toBeInTheDocument();
        });

        // Cadastrar
        await userEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

        await waitFor(() => {
            expect(screen.getByTestId('livros-mock')).toBeInTheDocument();
        });
    });

    it('Modo criação manual: campos vazios exibem erro', async () => {
        renderPage();

        // Mudar para manual
        await userEvent.click(screen.getByRole('button', { name: /Manual/i }));
        
        const btnSalvar = screen.getByRole('button', { name: /Salvar Livro/i });
        await userEvent.click(btnSalvar);

        expect(screen.getByText('Preencha título e autor.')).toBeInTheDocument();
    });

    it('Modo criação manual: sucesso', async () => {
        const { container } = renderPage();

        await userEvent.click(screen.getByRole('button', { name: /Manual/i }));
        
        await userEvent.type(container.querySelector('input[name="titulo"]'), 'Novo Manual');
        await userEvent.type(container.querySelector('input[name="autor"]'), 'Autor Manual');
        await userEvent.click(screen.getByRole('button', { name: /Salvar Livro/i }));

        await waitFor(() => {
            expect(screen.getByTestId('livros-mock')).toBeInTheDocument();
        });
    });

    it('Erro 500 ao salvar exibe alerta', async () => {
        server.use(
            http.post('http://localhost:8080/api/books', () => {
                return HttpResponse.json({ message: 'Erro ao salvar' }, { status: 500 });
            })
        );
        const { container } = renderPage();

        await userEvent.click(screen.getByRole('button', { name: /Manual/i }));
        
        await userEvent.type(container.querySelector('input[name="titulo"]'), 'Novo Manual');
        await userEvent.type(container.querySelector('input[name="autor"]'), 'Autor Manual');
        await userEvent.click(screen.getByRole('button', { name: /Salvar Livro/i }));

        await waitFor(() => {
            expect(screen.getByText('Erro ao salvar')).toBeInTheDocument();
        });
    });

    it('Pesquisa sem query exibe erro', async () => {
        renderPage();

        await userEvent.click(screen.getByRole('button', { name: /Buscar/i }));

        await waitFor(() => {
            expect(screen.getByText('Digite um título, autor ou ISBN para pesquisar.')).toBeInTheDocument();
        });
    });

    it('Erro na pesquisa da API exibe mensagem', async () => {
        server.use(
            http.get('http://localhost:8080/api/books/external-search', () => {
                return HttpResponse.json({ message: 'Erro na busca externa' }, { status: 500 });
            })
        );
        renderPage();

        await userEvent.type(screen.getByPlaceholderText(/Título, autor ou ISBN/i), 'External Book');
        await userEvent.click(screen.getByRole('button', { name: /Buscar/i }));

        await waitFor(() => {
            expect(screen.getByText('Erro na busca externa')).toBeInTheDocument();
        });
    });

    it('Alternar entre modos de pesquisa e manual', async () => {
        renderPage();

        await userEvent.click(screen.getByRole('button', { name: /Manual/i }));
        expect(screen.getByRole('button', { name: /Salvar Livro/i })).toBeInTheDocument();

        await userEvent.click(screen.getByRole('button', { name: /Pesquisar/i }));
        expect(screen.getByRole('button', { name: /Buscar/i })).toBeInTheDocument();
    });
});
