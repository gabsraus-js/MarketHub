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
        <label htmlFor={inputId} className="block text-sm font-medium text-fg mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-subtle pointer-events-none">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          className={[
            'w-full rounded-xl px-4 py-2.5 text-sm text-fg placeholder-fg-subtle',
            'bg-white/60 dark:bg-slate-900/50',
            'border border-white/70 dark:border-white/10',
            'backdrop-blur-sm shadow-soft',
            'transition-all duration-150',
            'focus:outline-none focus:ring-2 focus:ring-primary/25',
            'focus:border-primary/50 focus:bg-white/80 dark:focus:bg-slate-900/70',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'neuro:bg-background neuro:backdrop-blur-none neuro:border-transparent neuro:shadow-neuro-inset',
            'neuro:focus:ring-0 neuro:focus:border-transparent neuro:focus:bg-background neuro:focus:shadow-neuro-inset',
            icon ? 'pl-10' : '',
            error
              ? 'border-red-400/60 focus:border-red-400 focus:ring-red-400/20'
              : '',
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
