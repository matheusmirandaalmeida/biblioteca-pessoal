import api from '../api/api'

const authService = {
    async register(payload) {
        const { data } = await api.post('/auth/register', payload)
        return data
    },

    async login(credentials) {
        const { data } = await api.post('/auth/login', credentials)
        return data
    },

    async logout() {
        const { data } = await api.post('/auth/logout')
        return data
    },

    async getMe() {
        const { data } = await api.get('/auth/me')
        return data
    },
}

export default authService