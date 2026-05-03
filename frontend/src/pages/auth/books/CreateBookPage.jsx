import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../../components/common/Card'
import Input from '../../../components/common/Input'
import Button from '../../../components/common/Button'
import bookService from '../../../services/bookService'

const initialForm = {
    title: '',
    author: '',
    publisher: '',
    publishedDate: '',
}

export default function CreateBookPage() {
    const navigate = useNavigate()
    const [form, setForm] = useState(initialForm)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (event) => {
        const { name, value } = event.target
        setForm((current) => ({ ...current, [name]: value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')
        setLoading(true)

        try {
            const book = await bookService.create({
                ...form,
                publishedDate: form.publishedDate || null,
            })
            navigate(`/livros/${book.id}`)
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao cadastrar livro.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Cadastrar Livro</h2>
                <p className="text-slate-600">Preencha os dados usados pelo backend.</p>
            </div>

            <Card className="max-w-3xl">
                <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
                    <Input
                        label="Título"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Digite o título do livro"
                        required
                    />
                    <Input
                        label="Autor"
                        name="author"
                        value={form.author}
                        onChange={handleChange}
                        placeholder="Digite o autor"
                        required
                    />
                    <Input
                        label="Editora"
                        name="publisher"
                        value={form.publisher}
                        onChange={handleChange}
                        placeholder="Digite a editora"
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

                    <div className="flex gap-3 md:col-span-2">
                        <Button type="submit" loading={loading}>Salvar Livro</Button>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => navigate('/livros')}
                        >
                            Cancelar
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    )
}
