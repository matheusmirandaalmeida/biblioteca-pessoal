import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AuthContext } from '../../contexts/authContext'
import LoginPage from './LoginPage'

const renderLoginPage = () => {
    let loginCalls = 0

    render(
        <AuthContext.Provider
            value={{
                user: null,
                isAuthenticated: false,
                loadingAuth: false,
                login: async () => {
                    loginCalls += 1
                },
                register: async () => { },
                logout: async () => { },
            }}
        >
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        </AuthContext.Provider>
    )

    return {
        getLoginCalls: () => loginCalls,
    }
}

describe('LoginPage', () => {
    it('validates required credentials before submitting', async () => {
        const user = userEvent.setup()
        const { getLoginCalls } = renderLoginPage()

        await user.click(screen.getByRole('button', { name: 'Entrar' }))

        expect(screen.getByText('Preencha email e senha.')).toBeInTheDocument()
        expect(getLoginCalls()).toBe(0)
    })
})
