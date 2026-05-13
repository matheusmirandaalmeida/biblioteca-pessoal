import { describe, it, expect } from 'vitest';
import { getReadingStatus, READING_STATUS } from '../readingStatus';

describe('readingStatus', () => {
    it('getReadingStatus retorna a opção correta para cada status válido', () => {
        expect(getReadingStatus(READING_STATUS.LIDO)).toEqual({
            value: 'LIDO',
            label: 'Lido',
            badgeClass: 'bg-green-100 text-green-700 ring-green-200',
        });
        expect(getReadingStatus(READING_STATUS.LENDO)).toEqual({
            value: 'LENDO',
            label: 'Lendo',
            badgeClass: 'bg-yellow-100 text-yellow-800 ring-yellow-200',
        });
        expect(getReadingStatus(READING_STATUS.QUERO_LER)).toEqual({
            value: 'QUERO_LER',
            label: 'Quero ler',
            badgeClass: 'bg-red-100 text-red-700 ring-red-200',
        });
    });

    it('getReadingStatus retorna a opção padrão (QUERO_LER) para status inválido ou desconhecido', () => {
        const defaultOption = {
            value: 'QUERO_LER',
            label: 'Quero ler',
            badgeClass: 'bg-red-100 text-red-700 ring-red-200',
        };
        expect(getReadingStatus('STATUS_INVALIDO')).toEqual(defaultOption);
        expect(getReadingStatus(null)).toEqual(defaultOption);
    });
});
