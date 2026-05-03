import { PlusCircle, Save, Search } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../../components/common/Card'
import Input from '../../../components/common/Input'
import Button from '../../../components/common/Button'
import bookService from '../../../services/bookService'

const initialForm = {
    titulo: '',
    autor: '',
    genero: '',
    anoPublicacao: '',
    isbn: '',
    statusLeitura: 'QUERO_LER',
}

export default function CreateBookPage() {
    const navigate = useNavigate()
    const [mode, setMode] = useState('search')
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [formData, setFormData] = useState(initialForm)
    const [loadingSearch, setLoadingSearch] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const buildPayload = (book) => ({
        titulo: book.titulo.trim(),
        autor: book.autor.trim(),
        genero: book.genero?.trim() || null,
        anoPublicacao: book.anoPublicacao ? Number(book.anoPublicacao) : null,
        isbn: book.isbn?.trim() || null,
        statusLeitura: book.statusLeitura || 'QUERO_LER',
    })

    const searchBooks = async (event) => {
        event.preventDefault()
        setError('')

        if (!query.trim()) {
            setError('Digite um titulo, autor ou ISBN para pesquisar.')
            return
        }

        try {
            setLoadingSearch(true)
            const data = await bookService.searchExternal(query.trim())
            setResults(data)
        } catch (err) {
            setError(err.response?.data?.message || 'Nao foi possivel pesquisar livros.')
        } finally {
            setLoadingSearch(false)
        }
    }

    const saveBook = async (book) => {
        setError('')

        try {
            setSaving(true)
            await bookService.create(buildPayload(book))
            navigate('/livros')
        } catch (err) {
            setError(err.response?.data?.message || 'Nao foi possivel salvar o livro.')
        } finally {
            setSaving(false)
        }
    }

    const submitManual = async (event) => {
        event.preventDefault()

        if (!formData.titulo.trim() || !formData.autor.trim()) {
            setError('Preencha titulo e autor.')
            return
        }

        await saveBook(formData)
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Cadastrar Livro</h2>
                <p className="text-slate-600">Pesquise online ou preencha os dados manualmente.</p>
            </div>

            <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1">
                <button
                    type="button"
                    onClick={() => setMode('search')}
                    className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${mode === 'search'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                >
                    <Search size={16} />
                    Pesquisar
                </button>
                <button
                    type="button"
                    onClick={() => setMode('manual')}
                    className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${mode === 'manual'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                >
                    <PlusCircle size={16} />
                    Manual
                </button>
            </div>

            {error && (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
                    {error}
                </div>
            )}

            {mode === 'search' && (
                <div className="space-y-4">
                    <Card className="max-w-3xl">
                        <form onSubmit={searchBooks} className="flex flex-col gap-3 sm:flex-row">
                            <Input
                                label="Pesquisar na API"
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Titulo, autor ou ISBN"
                            />
                            <div className="flex items-end">
                                <Button type="submit" loading={loadingSearch}>
                                    <Search size={16} className="mr-2" />
                                    Buscar
                                </Button>
                            </div>
                        </form>
                    </Card>

                    {results.length > 0 && (
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {results.map((book, index) => (
                                <Card key={`${book.isbn || book.titulo}-${index}`}>
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-semibold text-slate-900">
                                            {book.titulo}
                                        </h3>
                                        <p className="text-sm text-slate-600">Autor: {book.autor}</p>
                                        {book.genero && (
                                            <p className="text-sm text-slate-600">Genero: {book.genero}</p>
                                        )}
                                        {book.anoPublicacao && (
                                            <p className="text-sm text-slate-600">Ano: {book.anoPublicacao}</p>
                                        )}
                                        {book.isbn && (
                                            <p className="text-sm text-slate-600">ISBN: {book.isbn}</p>
                                        )}
                                    </div>

                                    <div className="mt-4">
                                        <Button fullWidth loading={saving} onClick={() => saveBook(book)}>
                                            <Save size={16} className="mr-2" />
                                            Cadastrar
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {mode === 'manual' && (
            <Card className="max-w-3xl">
                    <form onSubmit={submitManual} className="grid gap-4 md:grid-cols-2">
                    <Input
                        label="Titulo"
                        name="titulo"
                        value={formData.titulo}
                        onChange={handleChange}
                        placeholder="Digite o titulo do livro"
                    />
                    <Input
                        label="Autor"
                        name="autor"
                        value={formData.autor}
                        onChange={handleChange}
                        placeholder="Digite o autor"
                    />
                    <Input
                        label="Genero"
                        name="genero"
                        value={formData.genero}
                        onChange={handleChange}
                        placeholder="Digite o genero"
                    />
                    <Input
                        label="Ano de Publicacao"
                        name="anoPublicacao"
                        type="number"
                        value={formData.anoPublicacao}
                        onChange={handleChange}
                        placeholder="Ex: 2020"
                    />
                    <Input
                        label="ISBN"
                        name="isbn"
                        value={formData.isbn}
                        onChange={handleChange}
                        placeholder="Digite o ISBN"
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

                    <div className="md:col-span-2">
                        <Button type="submit" loading={saving}>
                            <Save size={16} className="mr-2" />
                            Salvar Livro
                        </Button>
                    </div>
                </form>
            </Card>
            )}
        </div>
    )
}
