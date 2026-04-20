import api from '../api/api'
import { PREVIEW_MODE } from '../config/env'
import mockBooks from '../mocks/mockBooks'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const bookService = {
    async getAll() {
        if (PREVIEW_MODE) {
            await delay(300)
            return mockBooks
        }

        const { data } = await api.get('/books')
        return data
    },

    async getById(id) {
        if (PREVIEW_MODE) {
            await delay(200)
            return mockBooks.find((book) => book.id === id)
        }

        const { data } = await api.get(`/books/${id}`)
        return data
    },

    async create(payload) {
        if (PREVIEW_MODE) {
            await delay(300)
            return { id: crypto.randomUUID(), ...payload }
        }

        const { data } = await api.post('/books', payload)
        return data
    },

    async update(id, payload) {
        if (PREVIEW_MODE) {
            await delay(300)
            return { id, ...payload }
        }

        const { data } = await api.put(`/books/${id}`, payload)
        return data
    },

    async remove(id) {
        if (PREVIEW_MODE) {
            await delay(300)
            return { success: true, id }
        }

        const { data } = await api.delete(`/books/${id}`)
        return data
    },
}

export default bookService