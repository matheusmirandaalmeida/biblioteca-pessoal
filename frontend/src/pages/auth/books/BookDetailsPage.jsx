import Card from '../../../components/common/Card'
import Button from '../../../components/common/Button'

export default function BookDetailsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Detalhes do Livro</h2>
                <p className="text-slate-600">Visualização detalhada da página.</p>
            </div>

            <Card className="max-w-2xl">
                <div className="space-y-3">
                    <h3 className="text-xl font-bold text-slate-900">Clean Code</h3>
                    <p className="text-slate-600"><strong>Autor:</strong> Robert C. Martin</p>
                    <p className="text-slate-600"><strong>Gênero:</strong> Tecnologia</p>
                    <p className="text-slate-600"><strong>Ano:</strong> 2008</p>
                    <p className="text-slate-600"><strong>ISBN:</strong> 9780132350884</p>
                    <p className="text-slate-600"><strong>Status:</strong> LIDO</p>
                </div>

                <div className="mt-6 flex gap-3">
                    <Button type="button">Editar</Button>
                    <Button type="button" variant="secondary">Voltar</Button>
                </div>
            </Card>
        </div>
    )
}