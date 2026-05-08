import { READING_STATUS } from '../utils/readingStatus'

const mockBooks = [
    {
        id: '1',
        titulo: 'Clean Code',
        autor: 'Robert C. Martin',
        genero: 'Tecnologia',
        anoPublicacao: 2008,
        statusLeitura: READING_STATUS.LIDO,
    },
    {
        id: '2',
        titulo: 'O Hobbit',
        autor: 'J.R.R. Tolkien',
        genero: 'Fantasia',
        anoPublicacao: 1937,
        statusLeitura: READING_STATUS.LENDO,
    },
    {
        id: '3',
        titulo: 'Hábitos Atômicos',
        autor: 'James Clear',
        genero: 'Desenvolvimento pessoal',
        anoPublicacao: 2018,
        statusLeitura: READING_STATUS.QUERO_LER,
    },
]

export default mockBooks
