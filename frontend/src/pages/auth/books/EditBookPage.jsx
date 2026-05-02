import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Card from '../../../components/common/Card'
import Input from '../../../components/common/Input'
import Button from '../../../components/common/Button'
import Loading from '../../../components/common/Loading'
import bookService from '../../../services/bookService'

const initialForm = {
    title: '',
    author: '',
    publisher: '',
    publishedDate: '',
}

export default function EditBookPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [form, setForm] = useState(initialForm)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchBook = async () => {
            try {
                setLoading(true)
                const book = await bookService.getById(id)
                setForm({
                    title: book?.title || '',
                    author: book?.author || '',
                    publisher: book?.publisher || '',
                    publishedDate: book?.publishedDate || '',
                })
            } catch (err) {
                setError(err.response?.data?.message || 'Erro ao carregar livro.')
            } finally {
                setLoading(false)
            }
        }

        fetchBook()
    }, [id])

    const handleChange = (event) => {
        const { name, value } = event.target
        setForm((current) => ({ ...current, [name]: value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')
        setSaving(true)

        try {
            await bookService.update(id, {
                ...form,
                publishedDate: form.publishedDate || null,
            })
            navigate(`/livros/${id}`)
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao salvar alterações.')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return <Loading text="Carregando livro..." />
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Editar Livro</h2>
                <p className="text-slate-600">Atualize os dados usados pelo backend.</p>
            </div>

            <Card className="max-w-3xl">
                <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
                    <Input
                        label="Título"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Autor"
                        name="author"
                        value={form.author}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Editora"
                        name="publisher"
                        value={form.publisher}
                        onChange={handleChange}
                    />
                    <Input
                        label="Data de publicação"
                        name="publishedDate"
                        type="date"
                        value={form.publishedDate}
                        onChange={handleChange}
                    />

                    {error && (
                        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 md:col-span-2">
                            {error}
                        </div>
                    )}

                    <div className="md:col-span-2 flex gap-3">
                        <Button type="submit" loading={saving}>Salvar Alterações</Button>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => navigate(`/livros/${id}`)}
                        >
                            Cancelar
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    )
}
