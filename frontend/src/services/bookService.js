import api from '../api/api'
import { READING_STATUS } from '../utils/readingStatus'

const normalizeBook = (book) => ({
    ...book,
    titulo: book.titulo ?? book.title,
    autor: book.autor ?? book.autor,
    genero: book.genero ?? book.genero,
    anoPublicacao: book.anoPublicacao ?? book.publishedDate?.slice?.(0, 4),
    statusLeitura: book.statusLeitura ?? READING_STATUS.QUERO_LER,
    userId: book.userId ?? null,
})

const bookService = {
    async getAll() {
        const { data } = await api.get('/api/books')
        return data.map(normalizeBook)
    },

    async getById(id) {
        const { data } = await api.get(`/api/books/${id}`)
        return normalizeBook(data)
    },

    async searchExternal(query) {
        const { data } = await api.get('/api/books/external-search', {
            params: { query },
        })
        return data.map(normalizeBook)
    },

    async create(payload) {
        const { data } = await api.post('/api/books', payload)
        return normalizeBook(data)
    },

    async update(id, payload) {
        const { data } = await api.put(`/api/books/${id}`, payload)
        return normalizeBook(data)
    },

    async remove(id) {
        const { data } = await api.delete(`/api/books/${id}`)
        return data
    },
}

export default bookService
