import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'

export default function LoginPage() {
    const navigate = useNavigate()
    const { login } = useAuth()

    const [formData, setFormData] = useState({
        email: '',
        senha: '',
    })

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!formData.email || !formData.senha) {
            setError('Preencha email e senha.')
            return
        }

        try {
            setLoading(true)
            await login(formData)
            navigate('/dashboard')
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Erro ao fazer login.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
            <Card className="w-full max-w-md">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-slate-900">Entrar</h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Acesse sua biblioteca pessoal
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="seuemail@exemplo.com"
                    />

                    <Input
                        label="Senha"
                        type="password"
                        name="senha"
                        value={formData.senha}
                        onChange={handleChange}
                        placeholder="Digite sua senha"
                    />

                    {error && (
                        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    <Button type="submit" fullWidth loading={loading}>
                        Entrar
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-600">
                    Não tem conta?{' '}
                    <Link to="/cadastro" className="font-medium text-slate-900 hover:underline">
                        Cadastre-se
                    </Link>
                </p>
            </Card>
        </div>
    )
}