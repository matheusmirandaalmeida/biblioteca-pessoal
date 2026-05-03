import api from '../api/api'
import { BOOKS_PREVIEW_MODE } from '../config/env'
import mockBooks from '../mocks/mockBooks'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const normalizeBook = (book) => ({
    ...book,
    titulo: book.titulo ?? book.title,
    autor: book.autor ?? book.author,
    genero: book.genero ?? book.publisher,
    anoPublicacao: book.anoPublicacao ?? book.publishedDate?.slice?.(0, 4),
    statusLeitura: book.statusLeitura ?? 'QUERO_LER',
})

const bookService = {
    async getAll() {
        if (BOOKS_PREVIEW_MODE) {
            await delay(300)
            return mockBooks
        }

        const { data } = await api.get('/api/books')
        return data.map(normalizeBook)
    },

    async getById(id) {
        if (BOOKS_PREVIEW_MODE) {
            await delay(200)
            return mockBooks.find((book) => book.id === id)
        }

        const { data } = await api.get(`/api/books/${id}`)
        return normalizeBook(data)
    },

    async searchExternal(query) {
        if (BOOKS_PREVIEW_MODE) {
            await delay(300)
            return mockBooks.filter((book) =>
                `${book.titulo} ${book.autor}`.toLowerCase().includes(query.toLowerCase())
            )
        }

        const { data } = await api.get('/api/books/external-search', {
            params: { query },
        })
        return data.map(normalizeBook)
    },

    async create(payload) {
        if (BOOKS_PREVIEW_MODE) {
            await delay(300)
            return { id: crypto.randomUUID(), ...payload }
        }

        const { data } = await api.post('/api/books', payload)
        return normalizeBook(data)
    },

    async update(id, payload) {
        if (BOOKS_PREVIEW_MODE) {
            await delay(300)
            return { id, ...payload }
        }

        const { data } = await api.put(`/api/books/${id}`, payload)
        return normalizeBook(data)
    },

    async remove(id) {
        if (BOOKS_PREVIEW_MODE) {
            await delay(300)
            return { success: true, id }
        }

        const { data } = await api.delete(`/api/books/${id}`)
        return data
    },
}

export default bookService
