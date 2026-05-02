import Card from '../../../components/common/Card'
import { useAuth } from '../../../hooks/useAuth'

export default function DashboardPage() {
    const { user } = useAuth()

    return (
        <div className="space-y-6">
            <section>
                <h2 className="text-2xl font-bold text-slate-900">
                    Olá, {user?.nome || 'usuário'} 👋
                </h2>
                <p className="mt-1 text-slate-600">
                    Bem-vindo ao painel da sua biblioteca.
                </p>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
                <Card>
                    <h3 className="text-sm font-medium text-slate-500">Total de livros</h3>
                    <p className="mt-2 text-3xl font-bold text-slate-900">0</p>
                </Card>

                <Card>
                    <h3 className="text-sm font-medium text-slate-500">Lendo</h3>
                    <p className="mt-2 text-3xl font-bold text-slate-900">0</p>
                </Card>

                <Card>
                    <h3 className="text-sm font-medium text-slate-500">Finalizados</h3>
                    <p className="mt-2 text-3xl font-bold text-slate-900">0</p>
                </Card>
            </section>

            <Card>
                <h3 className="text-lg font-semibold text-slate-900">Resumo</h3>
                <p className="mt-2 text-slate-600">
                    Aqui futuramente você poderá exibir estatísticas reais vindas do backend,
                    como quantidade de livros por status de leitura, autores mais lidos e
                    últimos livros cadastrados.
                </p>
            </Card>
        </div>
    )
}