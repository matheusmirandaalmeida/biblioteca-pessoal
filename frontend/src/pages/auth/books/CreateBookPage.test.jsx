import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import CreateBookPage from './CreateBookPage'

const renderCreateBookPage = (service) => {
    render(
        <MemoryRouter>
            <CreateBookPage service={service} />
        </MemoryRouter>
    )
}

describe('CreateBookPage', () => {
    it('shows a clear empty state when the external API returns no books', async () => {
        const user = userEvent.setup()
        const searchedQueries = []

        renderCreateBookPage({
            searchExternal: async (query) => {
                searchedQueries.push(query)
                return []
            },
            create: async () => ({}),
        })

        await user.type(screen.getByLabelText('Pesquisar na API'), 'livro inexistente')
        await user.click(screen.getByRole('button', { name: /buscar/i }))

        expect(searchedQueries).toEqual(['livro inexistente'])
        expect(await screen.findByText('Nenhum resultado encontrado')).toBeInTheDocument()
        expect(screen.getByText(/A API respondeu, mas nao encontrou livros/)).toBeInTheDocument()
    })

    it('shows result count when the external API returns books', async () => {
        const user = userEvent.setup()

        renderCreateBookPage({
            searchExternal: async () => [
                {
                    titulo: 'Clean Code',
                    autor: 'Robert C. Martin',
                    statusLeitura: 'QUERO_LER',
                },
            ],
            create: async () => ({}),
        })

        await user.type(screen.getByLabelText('Pesquisar na API'), 'clean code')
        await user.click(screen.getByRole('button', { name: /buscar/i }))

        expect(await screen.findByText(/API consultada com sucesso/)).toBeInTheDocument()
        expect(screen.getByText('Clean Code')).toBeInTheDocument()
    })
})
