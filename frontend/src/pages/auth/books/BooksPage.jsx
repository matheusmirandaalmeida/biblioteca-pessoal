import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookDashed } from 'lucide-react'
import Button from '../../../components/common/Button'
import Card from '../../../components/common/Card'
import Loading from '../../../components/common/Loading'
import ReadingStatusBadge from '../../../components/books/ReadingStatusBadge'
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
                <Card className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="mb-4 rounded-full bg-slate-100 p-4 text-slate-400">
                        <BookDashed size={48} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900">
                        Nenhum livro cadastrado
                    </h3>
                    <p className="mt-2 max-w-sm text-slate-500">
                        Você ainda não possui livros cadastrados na sua biblioteca pessoal. Clique em <strong className="font-medium text-slate-700">"Novo livro"</strong> para começar.
                    </p>
                    <Link to="/livros/novo" className="mt-6">
                        <Button>Adicionar Primeiro Livro</Button>
                    </Link>
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
                                <p className="text-sm text-slate-600">
                                    Gênero: {book.genero || 'Não informado'}
                                </p>
                                <p className="text-sm text-slate-600">
                                    Publicação: {book.anoPublicacao || 'Não informada'}
                                </p>
                                <div className="pt-1">
                                    <ReadingStatusBadge status={book.statusLeitura} />
                                </div>
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
