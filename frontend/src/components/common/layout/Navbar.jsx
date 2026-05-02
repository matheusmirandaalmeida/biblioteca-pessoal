import { Menu } from 'lucide-react'

export default function Navbar({ onOpenSidebar }) {
    return (
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm">
            <div className="flex items-center gap-3">
                <button
                    onClick={onOpenSidebar}
                    className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
                >
                    <Menu size={22} />
                </button>

                <div>
                    <h1 className="text-lg font-semibold text-slate-800">
                        Gerenciador de Biblioteca Pessoal
                    </h1>
                    <p className="text-sm text-slate-500">
                        Organize seus livros com praticidade
                    </p>
                </div>
            </div>
        </header>
    )
}