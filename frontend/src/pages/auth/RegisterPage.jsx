import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'

export default function RegisterPage() {
    const navigate = useNavigate()
    const { register } = useAuth()

    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        confirmarSenha: '',
    })

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (!formData.nome || !formData.email || !formData.senha || !formData.confirmarSenha) {
            setError('Preencha todos os campos.')
            return
        }

        if (formData.senha !== formData.confirmarSenha) {
            setError('As senhas não coincidem.')
            return
        }

        try {
            setLoading(true)

            await register({
                nome: formData.nome,
                email: formData.email,
                senha: formData.senha,
            })

            setSuccess('Cadastro realizado com sucesso. Faça login para continuar.')

            setTimeout(() => {
                navigate('/login')
            }, 1200)
        } catch (err) {
            setError(
                err.response?.data?.message || 'Não foi possível realizar o cadastro.'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
            <Card className="w-full max-w-md">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-slate-900">Criar conta</h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Cadastre-se para começar a gerenciar seus livros
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Nome"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        placeholder="Seu nome completo"
                    />

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
                        placeholder="Crie uma senha"
                    />

                    <Input
                        label="Confirmar senha"
                        type="password"
                        name="confirmarSenha"
                        value={formData.confirmarSenha}
                        onChange={handleChange}
                        placeholder="Repita a senha"
                    />

                    {error && (
                        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    {success && (
                        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-600">
                            {success}
                        </p>
                    )}

                    <Button type="submit" fullWidth loading={loading}>
                        Cadastrar
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-600">
                    Já possui conta?{' '}
                    <Link to="/login" className="font-medium text-slate-900 hover:underline">
                        Entrar
                    </Link>
                </p>
            </Card>
        </div>
    )
}