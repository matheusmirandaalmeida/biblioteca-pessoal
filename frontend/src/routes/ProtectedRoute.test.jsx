import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AuthContext } from '../contexts/authContext'
import ProtectedRoute from './ProtectedRoute'

const renderProtectedRoute = ({ isAuthenticated, loadingAuth }) => {
    render(
        <AuthContext.Provider
            value={{
                user: isAuthenticated ? { id: 'user-1', nome: 'Maria' } : null,
                isAuthenticated,
                loadingAuth,
                login: async () => { },
                register: async () => { },
                logout: async () => { },
            }}
        >
            <MemoryRouter initialEntries={['/dashboard']}>
                <Routes>
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <h1>Area privada</h1>
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/login" element={<h1>Entrar</h1>} />
                </Routes>
            </MemoryRouter>
        </AuthContext.Provider>
    )
}

describe('ProtectedRoute', () => {
    it('shows loading while auth state is being checked', () => {
        renderProtectedRoute({ isAuthenticated: false, loadingAuth: true })

        expect(screen.getByText('Verificando sessão...')).toBeInTheDocument()
    })

    it('redirects unauthenticated users to login', () => {
        renderProtectedRoute({ isAuthenticated: false, loadingAuth: false })

        expect(screen.getByRole('heading', { name: 'Entrar' })).toBeInTheDocument()
    })

    it('renders private content for authenticated users', () => {
        renderProtectedRoute({ isAuthenticated: true, loadingAuth: false })

        expect(screen.getByRole('heading', { name: 'Area privada' })).toBeInTheDocument()
    })
})
