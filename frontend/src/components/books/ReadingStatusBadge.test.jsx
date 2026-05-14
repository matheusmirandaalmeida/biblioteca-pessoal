import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import ReadingStatusBadge from './ReadingStatusBadge'
import { READING_STATUS } from '../../utils/readingStatus'

describe('ReadingStatusBadge', () => {
    it('renders the matching reading status label', () => {
        render(<ReadingStatusBadge status={READING_STATUS.LIDO} />)

        expect(screen.getByText('Lido')).toBeInTheDocument()
    })

    it('falls back to Quero ler for unknown status', () => {
        render(<ReadingStatusBadge status="DESCONHECIDO" />)

        expect(screen.getByText('Quero ler')).toBeInTheDocument()
    })
})
