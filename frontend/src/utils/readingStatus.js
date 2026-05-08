export const READING_STATUS = {
    QUERO_LER: 'QUERO_LER',
    LENDO: 'LENDO',
    LIDO: 'LIDO',
}

export const READING_STATUS_OPTIONS = [
    {
        value: READING_STATUS.QUERO_LER,
        label: 'Quero ler',
        badgeClass: 'bg-red-100 text-red-700 ring-red-200',
    },
    {
        value: READING_STATUS.LENDO,
        label: 'Lendo',
        badgeClass: 'bg-yellow-100 text-yellow-800 ring-yellow-200',
    },
    {
        value: READING_STATUS.LIDO,
        label: 'Lido',
        badgeClass: 'bg-green-100 text-green-700 ring-green-200',
    },
]

export const getReadingStatus = (status) =>
    READING_STATUS_OPTIONS.find((option) => option.value === status) || READING_STATUS_OPTIONS[0]
