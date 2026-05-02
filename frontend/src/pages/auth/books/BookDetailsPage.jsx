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
    const [deleting, setDeleting] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchBook = async () => {
            try {
                setLoading(true)
                const data = await bookService.getById(id)
                setBook(data)
            } catch (err) {
                setError(err.response?.data?.message || 'Erro ao carregar livro.')
            } finally {
                setLoading(false)
            }
        }

        fetchBook()
    }, [id])

    const handleDelete = async () => {
        setError('')
        setDeleting(true)

        try {
            await bookService.remove(id)
            navigate('/livros')
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao remover livro.')
        } finally {
            setDeleting(false)
        }
    }

    if (loading) {
        return <Loading text="Carregando livro..." />
    }

    if (error && !book) {
        return (
            <div className="rounded-lg bg-red-50 p-4 text-red-600">
                {error}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Detalhes do Livro</h2>
                <p className="text-slate-600">Dados retornados pelo backend.</p>
            </div>

            <Card className="max-w-2xl">
                <div className="space-y-3">
                    <h3 className="text-xl font-bold text-slate-900">{book?.title}</h3>
                    <p className="text-slate-600"><strong>Autor:</strong> {book?.author}</p>
                    <p className="text-slate-600">
                        <strong>Editora:</strong> {book?.publisher || 'Não informada'}
                    </p>
                    <p className="text-slate-600">
                        <strong>Data de publicação:</strong> {book?.publishedDate || 'Não informada'}
                    </p>
                </div>

                {error && (
                    <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <div className="mt-6 flex gap-3">
                    <Button type="button" onClick={() => navigate(`/livros/${id}/editar`)}>
                        Editar
                    </Button>
                    <Button type="button" variant="secondary" onClick={() => navigate('/livros')}>
                        Voltar
                    </Button>
                    <Button
                        type="button"
                        variant="danger"
                        loading={deleting}
                        onClick={handleDelete}
                    >
                        Excluir
                    </Button>
                </div>
            </Card>
        </div>
    )
}
