import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Modal from '../Modal';

describe('Modal', () => {
    it('Renderiza o modal e fecha ao clicar no botão Fechar', async () => {
        const onClose = vi.fn();
        render(<Modal isOpen={true} onClose={onClose} title="Teste">Conteúdo</Modal>);

        expect(screen.getByText('Teste')).toBeInTheDocument();
        const closeBtn = screen.getByRole('button', { name: /cancelar/i });
        await userEvent.click(closeBtn);
        expect(onClose).toHaveBeenCalled();
    });

    it('Não renderiza quando isOpen é falso', () => {
        render(<Modal isOpen={false} onClose={() => {}} title="Teste">Conteúdo</Modal>);
        expect(screen.queryByText('Teste')).not.toBeInTheDocument();
    });
});
