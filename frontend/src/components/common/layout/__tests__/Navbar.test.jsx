import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Navbar from '../Navbar';

describe('Navbar', () => {
    it('Renderiza o título', () => {
        render(<Navbar onOpenSidebar={vi.fn()} />);
        expect(screen.getByText('Gerenciador de Biblioteca Pessoal')).toBeInTheDocument();
    });

    it('Chama onOpenSidebar ao clicar no botão', async () => {
        const onOpenMock = vi.fn();
        render(<Navbar onOpenSidebar={onOpenMock} />);
        
        const btn = screen.getByRole('button');
        await userEvent.click(btn);
        
        expect(onOpenMock).toHaveBeenCalled();
    });
});
