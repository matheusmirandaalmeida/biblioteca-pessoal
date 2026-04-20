import Card from '../../../components/common/Card'
import Input from '../../../components/common/Input'
import Button from '../../../components/common/Button'

export default function CreateBookPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Cadastrar Livro</h2>
                <p className="text-slate-600">Visualização inicial do formulário.</p>
            </div>

            <Card className="max-w-3xl">
                <form className="grid gap-4 md:grid-cols-2">
                    <Input label="Título" placeholder="Digite o título do livro" />
                    <Input label="Autor" placeholder="Digite o autor" />
                    <Input label="Gênero" placeholder="Digite o gênero" />
                    <Input label="Ano de Publicação" placeholder="Ex: 2020" />
                    <Input label="ISBN" placeholder="Digite o ISBN" />

                    <div className="w-full">
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                            Status de Leitura
                        </label>
                        <select className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200">
                            <option>LIDO</option>
                            <option>LENDO</option>
                            <option>QUERO_LER</option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <Button type="button">Salvar Livro</Button>
                    </div>
                </form>
            </Card>
        </div>
    )
}