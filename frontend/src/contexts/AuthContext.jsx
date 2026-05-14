import { useEffect, useMemo, useState } from 'react'
import authService from '../services/authService'
import { AuthContext } from './authContext'

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loadingAuth, setLoadingAuth] = useState(true)

    useEffect(() => {
        const loadUser = async () => {
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
        const response = await authService.login(credentials)
        localStorage.setItem('token', response.token)

        const me = await authService.getMe()
        localStorage.setItem('user', JSON.stringify(me))
        setUser(me)
    }

    const register = async (payload) => {
        return await authService.register(payload)
    }

    const logout = async () => {
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
