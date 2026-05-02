import Card from '../../../components/common/Card'
import Input from '../../../components/common/Input'
import Button from '../../../components/common/Button'

export default function EditBookPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Editar Livro</h2>
                <p className="text-slate-600">Visualização da tela de edição.</p>
            </div>

            <Card className="max-w-3xl">
                <form className="grid gap-4 md:grid-cols-2">
                    <Input label="Título" defaultValue="Clean Code" />
                    <Input label="Autor" defaultValue="Robert C. Martin" />
                    <Input label="Gênero" defaultValue="Tecnologia" />
                    <Input label="Ano de Publicação" defaultValue="2008" />
                    <Input label="ISBN" defaultValue="9780132350884" />

                    <div className="w-full">
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                            Status de Leitura
                        </label>
                        <select
                            defaultValue="LIDO"
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                        >
                            <option value="LIDO">LIDO</option>
                            <option value="LENDO">LENDO</option>
                            <option value="QUERO_LER">QUERO_LER</option>
                        </select>
                    </div>

                    <div className="md:col-span-2 flex gap-3">
                        <Button type="button">Salvar Alterações</Button>
                        <Button type="button" variant="secondary">Cancelar</Button>
                    </div>
                </form>
            </Card>
        </div>
    )
}