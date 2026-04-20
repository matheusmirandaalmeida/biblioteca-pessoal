export default function Button({
    children,
    type = 'button',
    variant = 'primary',
    fullWidth = false,
    loading = false,
    ...props
}) {
    const baseClasses =
        'inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60'

    const variants = {
        primary: 'bg-slate-900 text-white hover:bg-slate-800',
        secondary: 'bg-slate-200 text-slate-900 hover:bg-slate-300',
        danger: 'bg-red-600 text-white hover:bg-red-700',
    }

    return (
        <button
            type={type}
            className={`${baseClasses} ${variants[variant]} ${fullWidth ? 'w-full' : ''}`}
            disabled={loading}
            {...props}
        >
            {loading ? 'Carregando...' : children}
        </button>
    )
}