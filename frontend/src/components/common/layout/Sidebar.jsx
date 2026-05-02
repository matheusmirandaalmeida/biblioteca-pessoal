import { BookOpen, Home, LogOut, PlusCircle } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'

const linkBase =
    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition'
const linkInactive = 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
const linkActive = 'bg-slate-900 text-white'

export default function Sidebar({ mobileOpen, onClose }) {
    const { logout, user } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    const renderNavLinkClass = ({ isActive }) =>
        `${linkBase} ${isActive ? linkActive : linkInactive}`

    return (
        <>
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/40 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`fixed left-0 top-0 z-40 flex h-full w-72 flex-col border-r border-slate-200 bg-white p-4 shadow-lg transition-transform md:static md:translate-x-0 md:shadow-none ${mobileOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-slate-900">Minha Biblioteca</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        {user?.nome || 'Usuário autenticado'}
                    </p>
                </div>

                <nav className="flex flex-1 flex-col gap-2">
                    <NavLink to="/dashboard" className={renderNavLinkClass} onClick={onClose}>
                        <Home size={18} />
                        Dashboard
                    </NavLink>

                    <NavLink to="/livros" className={renderNavLinkClass} onClick={onClose}>
                        <BookOpen size={18} />
                        Meus Livros
                    </NavLink>

                    <NavLink to="/livros/novo" className={renderNavLinkClass} onClick={onClose}>
                        <PlusCircle size={18} />
                        Cadastrar Livro
                    </NavLink>
                </nav>

                <button
                    onClick={handleLogout}
                    className="mt-6 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                    <LogOut size={18} />
                    Sair
                </button>
            </aside>
        </>
    )
}