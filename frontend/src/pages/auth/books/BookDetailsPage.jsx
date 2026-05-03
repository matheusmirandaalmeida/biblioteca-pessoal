import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Card from '../../../components/common/Card'
import Button from '../../../components/common/Button'
import Loading from '../../../components/common/Loading'
import bookService from '../../../services/bookService'

export default function BookDetailsPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [book, setBook] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchBook = async () => {
            try {
                setLoading(true)
                const data = await bookService.getById(id)

                if (!data) {
                    setError('Livro nao encontrado.')
                    return
                }

                setBook(data)
            } catch (err) {
                setError(err.response?.data?.message || 'Erro ao carregar detalhes do livro.')
            } finally {
                setLoading(false)
            }
        }

        fetchBook()
    }, [id])

    if (loading) {
        return <Loading text="Carregando detalhes do livro..." />
    }

    if (error) {
        return (
            <div className="space-y-4">
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
                    {error}
                </div>
                <Button type="button" variant="secondary" onClick={() => navigate('/livros')}>
                    Voltar
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Detalhes do Livro</h2>
                <p className="text-slate-600">Visualização detalhada do livro.</p>
            </div>

            <Card className="max-w-2xl">
                <div className="space-y-3">
                    <h3 className="text-xl font-bold text-slate-900">{book.titulo}</h3>
                    <p className="text-slate-600"><strong>Autor:</strong> {book.autor}</p>
                    <p className="text-slate-600"><strong>Genero:</strong> {book.genero || '-'}</p>
                    <p className="text-slate-600"><strong>Ano:</strong> {book.anoPublicacao || '-'}</p>
                    <p className="text-slate-600"><strong>ISBN:</strong> {book.isbn || '-'}</p>
                    <p className="text-slate-600"><strong>Status:</strong> {book.statusLeitura}</p>
                </div>

                <div className="mt-6 flex gap-3">
                    <Button type="button" onClick={() => navigate(`/livros/${id}/editar`)}>
                        Editar
                    </Button>
                    <Button type="button" variant="secondary" onClick={() => navigate('/livros')}>
                        Voltar
                    </Button>
                </div>
            </Card>
        </div>
    )
}
