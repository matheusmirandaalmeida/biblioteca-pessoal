import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import Button from './Button'

describe('Button', () => {
    it('shows loading state and disables interaction', () => {
        render(<Button loading>Salvar</Button>)

        const button = screen.getByRole('button', { name: 'Carregando...' })

        expect(button).toBeDisabled()
        expect(button).toHaveTextContent('Carregando...')
    })
})
