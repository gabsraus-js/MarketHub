'use client'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

export function Input({ label, error, icon, className = '', id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          className={[
            'w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400',
            'shadow-soft transition-all duration-150',
            'focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100',
            'disabled:bg-slate-50 disabled:text-slate-400',
            icon ? 'pl-10' : '',
            error ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-slate-200',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  )
}
