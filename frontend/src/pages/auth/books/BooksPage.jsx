import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../../components/common/Button'
import Card from '../../../components/common/Card'
import Loading from '../../../components/common/Loading'
import bookService from '../../../services/bookService'

export default function BooksPage() {
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setLoading(true)
                const data = await bookService.getAll()
                setBooks(data)
            } catch (err) {
                setError(err.response?.data?.message || 'Erro ao carregar livros.')
            } finally {
                setLoading(false)
            }
        }

        fetchBooks()
    }, [])

    if (loading) {
        return <Loading text="Carregando livros..." />
    }

    if (error) {
        return (
            <div className="rounded-lg bg-red-50 p-4 text-red-600">
                {error}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Meus Livros</h2>
                    <p className="text-slate-600">
                        Gerencie os livros cadastrados na sua biblioteca.
                    </p>
                </div>

                <Link to="/livros/novo">
                    <Button>Novo livro</Button>
                </Link>
            </div>

            {books.length === 0 ? (
                <Card>
                    <h3 className="text-lg font-semibold text-slate-900">
                        Nenhum livro cadastrado
                    </h3>
                    <p className="mt-2 text-slate-600">
                        Você ainda não possui livros cadastrados. Clique em “Novo livro” para começar.
                    </p>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {books.map((book) => (
                        <Card key={book.id}>
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold text-slate-900">
                                    {book.titulo}
                                </h3>
                                <p className="text-sm text-slate-600">Autor: {book.autor}</p>
                                <p className="text-sm text-slate-600">Gênero: {book.genero}</p>
                                <p className="text-sm text-slate-600">
                                    Status: {book.statusLeitura}
                                </p>
                            </div>

                            <div className="mt-4 flex gap-2">
                                <Link to={`/livros/${book.id}`} className="flex-1">
                                    <Button variant="secondary" fullWidth>
                                        Detalhes
                                    </Button>
                                </Link>

                                <Link to={`/livros/${book.id}/editar`} className="flex-1">
                                    <Button fullWidth>Editar</Button>
                                </Link>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}