import { describe, it, expect } from 'vitest';
import bookService from '../bookService';
import { server } from '../../test/mocks/server';
import { http, HttpResponse } from 'msw';

describe('bookService', () => {
    it('getAll() retorna lista', async () => {
        const api = (await import('../../api/api')).default;
        console.log('BASE URL IS:', api.defaults.baseURL);
        localStorage.setItem('token', 'mock-jwt-token');
        const books = await bookService.getAll();
        expect(books).toHaveLength(1);
        expect(books[0].titulo).toBe('Livro 1');
    });

    it('getAll() sem token (erro 401)', async () => {
        localStorage.removeItem('token');
        await expect(bookService.getAll()).rejects.toThrow();
    });

    it('getAll() com erro 500', async () => {
        localStorage.setItem('token', 'mock-jwt-token');
        server.use(
            http.get('http://localhost:8080/api/books', () => {
                return HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 });
            })
        );
        await expect(bookService.getAll()).rejects.toThrow();
    });

    it('getById() com ID válido', async () => {
        const book = await bookService.getById('1');
        expect(book.id).toBe('1');
    });

    it('getById() com ID inexistente (erro 404)', async () => {
        await expect(bookService.getById('999')).rejects.toThrow();
    });

    it('create() com dados válidos', async () => {
        const newBook = await bookService.create({ titulo: 'Novo Livro', autor: 'Novo Autor' });
        expect(newBook.id).toBe('2');
        expect(newBook.titulo).toBe('Novo Livro');
    });

    it('create() sem campos obrigatórios (erro 400)', async () => {
        await expect(bookService.create({ titulo: '' })).rejects.toThrow();
    });

    it('update() com dados válidos', async () => {
        const updatedBook = await bookService.update('1', { titulo: 'Livro Editado' });
        expect(updatedBook.titulo).toBe('Livro Editado');
    });

    it('update() com ID inexistente', async () => {
        await expect(bookService.update('999', { titulo: 'Livro Editado' })).rejects.toThrow();
    });

    it('remove() com ID válido', async () => {
        const response = await bookService.remove('1');
        // The mock returns an empty response or success message depending on backend
        expect(response).toBeDefined();
    });

    it('remove() com ID inexistente', async () => {
        await expect(bookService.remove('999')).rejects.toThrow();
    });

    describe('searchExternal() parametrizado', () => {
        const scenarios = [
            { query: 'External', expectedLength: 1 },
            { query: 'external', expectedLength: 1 }, // case-insensitive mock check
            { query: 'notfound', expectedLength: 0 }
        ];

        scenarios.forEach(({ query, expectedLength }) => {
            it(`busca com query "${query}" deve retornar ${expectedLength} resultados`, async () => {
                const results = await bookService.searchExternal(query);
                expect(results).toHaveLength(expectedLength);
            });
        });
    });
});
