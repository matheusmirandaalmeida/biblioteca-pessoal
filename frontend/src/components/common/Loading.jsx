export default function Loading({ text = 'Carregando...', fullScreen = false }) {
    const content = (
        <div className="flex flex-col items-center justify-center gap-3 py-10">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900" />
            <p className="text-sm text-slate-600">{text}</p>
        </div>
    )

    if (fullScreen) {
        return <div className="flex min-h-screen items-center justify-center bg-slate-100">{content}</div>
    }

    return content
}