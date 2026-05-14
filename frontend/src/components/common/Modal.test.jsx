import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Modal from './Modal'

describe('Modal', () => {
    it('does not render content while closed', () => {
        render(
            <Modal isOpen={false} title="Excluir livro" onClose={() => { }} onConfirm={() => { }}>
                Confirmacao
            </Modal>
        )

        expect(screen.queryByText('Excluir livro')).not.toBeInTheDocument()
    })

    it('calls close and confirm handlers from visible buttons', async () => {
        const user = userEvent.setup()
        let closeCount = 0
        let confirmCount = 0

        render(
            <Modal
                isOpen
                title="Excluir livro"
                cancelText="Cancelar"
                confirmText="Excluir"
                onClose={() => {
                    closeCount += 1
                }}
                onConfirm={() => {
                    confirmCount += 1
                }}
            >
                Esta acao nao pode ser desfeita.
            </Modal>
        )

        await user.click(screen.getByRole('button', { name: 'Cancelar' }))
        await user.click(screen.getByRole('button', { name: 'Excluir' }))

        expect(closeCount).toBe(1)
        expect(confirmCount).toBe(1)
    })
})
