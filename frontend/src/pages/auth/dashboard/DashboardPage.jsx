import { useEffect, useState } from 'react'
import Card from '../../../components/common/Card'
import { useAuth } from '../../../hooks/useAuth'
import bookService from '../../../services/bookService'

export default function DashboardPage() {
    const { user } = useAuth()
    const [books, setBooks] = useState([])

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const data = await bookService.getAll()
                setBooks(data)
            } catch {
                setBooks([])
            }
        }

        fetchBooks()
    }, [])

    const totalAuthors = new Set(books.map((book) => book.author).filter(Boolean)).size
    const totalPublishers = new Set(books.map((book) => book.publisher).filter(Boolean)).size
    const latestBook = books[books.length - 1]

    return (
        <div className="space-y-6">
            <section>
                <h2 className="text-2xl font-bold text-slate-900">
                    Olá, {user?.nome || 'usuário'} 👋
                </h2>
                <p className="mt-1 text-slate-600">
                    Bem-vindo ao painel da sua biblioteca.
                </p>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
                <Card>
                    <h3 className="text-sm font-medium text-slate-500">Total de livros</h3>
                    <p className="mt-2 text-3xl font-bold text-slate-900">{books.length}</p>
                </Card>

                <Card>
                    <h3 className="text-sm font-medium text-slate-500">Autores</h3>
                    <p className="mt-2 text-3xl font-bold text-slate-900">{totalAuthors}</p>
                </Card>

                <Card>
                    <h3 className="text-sm font-medium text-slate-500">Gêneros</h3>
                    <p className="mt-2 text-3xl font-bold text-slate-900">{totalGenres}</p>
                </Card>
            </section>

            <Card>
                <h3 className="text-lg font-semibold text-slate-900">Resumo</h3>
                <p className="mt-2 text-slate-600">
                    {latestBook
                        ? `Último livro carregado: ${latestBook.titulo}, de ${latestBook.autor}.`
                        : 'Nenhum livro retornado pelo backend até agora.'}
                </p>
            </Card>
        </div>
    )
}
