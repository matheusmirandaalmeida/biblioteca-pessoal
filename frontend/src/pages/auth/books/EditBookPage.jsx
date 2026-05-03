import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Card from '../../../components/common/Card'
import Input from '../../../components/common/Input'
import Button from '../../../components/common/Button'
import Loading from '../../../components/common/Loading'
import bookService from '../../../services/bookService'

const initialForm = {
    titulo: '',
    autor: '',
    genero: '',
    anoPublicacao: '',
    isbn: '',
    statusLeitura: 'QUERO_LER',
}

export default function EditBookPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [formData, setFormData] = useState(initialForm)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchBook = async () => {
            try {
                setLoading(true)
                const book = await bookService.getById(id)

                if (!book) {
                    setError('Livro nao encontrado.')
                    return
                }

                setFormData({
                    titulo: book.titulo || '',
                    autor: book.autor || '',
                    genero: book.genero || '',
                    anoPublicacao: book.anoPublicacao || '',
                    isbn: book.isbn || '',
                    statusLeitura: book.statusLeitura || 'QUERO_LER',
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
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const buildPayload = () => ({
        titulo: formData.titulo.trim(),
        autor: formData.autor.trim(),
        genero: formData.genero?.trim() || null,
        anoPublicacao: formData.anoPublicacao ? Number(formData.anoPublicacao) : null,
        isbn: formData.isbn?.trim() || null,
        statusLeitura: formData.statusLeitura || 'QUERO_LER',
    })

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')

        if (!formData.titulo.trim() || !formData.autor.trim()) {
            setError('Preencha titulo e autor.')
            return
        }

        try {
            setSaving(true)
            await bookService.update(id, buildPayload())
            navigate(`/livros/${id}`)
        } catch (err) {
            setError(err.response?.data?.message || 'Nao foi possivel salvar as alteracoes.')
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
                <p className="text-slate-600">Atualize os dados do livro.</p>
            </div>

            {error && (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
                    {error}
                </div>
            )}

            <Card className="max-w-3xl">
                <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
                    <Input
                        label="Titulo"
                        name="titulo"
                        value={formData.titulo}
                        onChange={handleChange}
                    />
                    <Input
                        label="Autor"
                        name="autor"
                        value={formData.autor}
                        onChange={handleChange}
                    />
                    <Input
                        label="Genero"
                        name="genero"
                        value={formData.genero}
                        onChange={handleChange}
                    />
                    <Input
                        label="Ano de Publicacao"
                        name="anoPublicacao"
                        type="number"
                        value={formData.anoPublicacao}
                        onChange={handleChange}
                    />
                    <Input
                        label="ISBN"
                        name="isbn"
                        value={formData.isbn}
                        onChange={handleChange}
                    />

                    <div className="w-full">
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                            Status de Leitura
                        </label>
                        <select
                            name="statusLeitura"
                            value={formData.statusLeitura}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                        >
                            <option value="QUERO_LER">QUERO_LER</option>
                            <option value="LENDO">LENDO</option>
                            <option value="LIDO">LIDO</option>
                        </select>
                    </div>

                    <div className="md:col-span-2 flex gap-3">
                        <Button type="submit" loading={saving}>
                            Salvar Alterações
                        </Button>
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

