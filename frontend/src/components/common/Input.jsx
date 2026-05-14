import { useId } from 'react'

export default function Input({ label, error, className = '', id, ...props }) {
    const generatedId = useId()
    const inputId = id || generatedId

    return (
        <div className="w-full">
            {label && (
                <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-slate-700">
                    {label}
                </label>
            )}

            <input
                id={inputId}
                className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-200 ${className}`}
                {...props}
            />

            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    )
}
