import { useEffect, useMemo, useState } from 'react'
import authService from '../services/authService'
import { PREVIEW_MODE } from '../config/env'
import { AuthContext } from './authContext'

// Usuário de preview para desenvolvimento sem backend
const previewUser = {
    id: '1',
    nome: 'Lucas',
    email: 'lucas@preview.com',
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loadingAuth, setLoadingAuth] = useState(true)

    useEffect(() => {
        const loadUser = async () => {
            if (PREVIEW_MODE) {
                const savedPreviewUser = localStorage.getItem('preview_user')

                if (savedPreviewUser) {
                    setUser(JSON.parse(savedPreviewUser))
                }

                setLoadingAuth(false)
                return
            }

            const token = localStorage.getItem('token')

            if (!token) {
                setLoadingAuth(false)
                return
            }

            try {
                const me = await authService.getMe()
                setUser(me)
            } catch {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                setUser(null)
            } finally {
                setLoadingAuth(false)
            }
        }

        loadUser()
    }, [])

    const login = async (credentials) => {
        if (PREVIEW_MODE) {
            if (!credentials.email || !credentials.senha) {
                throw new Error('Preencha email e senha.')
            }

            localStorage.setItem('preview_user', JSON.stringify(previewUser))
            setUser(previewUser)
            return
        }

        const response = await authService.login(credentials)
        localStorage.setItem('token', response.token)

        const me = await authService.getMe()
        localStorage.setItem('user', JSON.stringify(me))
        setUser(me)
    }

    const register = async (payload) => {
        if (PREVIEW_MODE) {
            return {
                id: '1',
                nome: payload.nome,
                email: payload.email,
            }
        }

        return await authService.register(payload)
    }

    const logout = async () => {
        if (PREVIEW_MODE) {
            localStorage.removeItem('preview_user')
            setUser(null)
            return
        }

        try {
            await authService.logout()
        } finally {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            setUser(null)
        }
    }

    const value = useMemo(() => ({
        user,
        isAuthenticated: !!user,
        loadingAuth,
        login,
        register,
        logout,
    }), [user, loadingAuth])

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
