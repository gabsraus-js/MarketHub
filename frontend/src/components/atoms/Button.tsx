'use client'

import { forwardRef } from 'react'
import Link from 'next/link'

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  href?: string
  loading?: boolean
  children: React.ReactNode
}

const variants: Record<Variant, string> = {
  primary:
    'bg-primary-500 text-white hover:bg-primary-600 shadow-soft hover:shadow-soft-md active:bg-primary-700',
  secondary:
    'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-soft',
  ghost: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
  outline: 'border border-primary-200 text-primary-600 hover:bg-primary-50',
}

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
  md: 'px-4 py-2 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3 text-base rounded-xl gap-2',
}

const base =
  'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', href, loading, children, className = '', disabled, ...props }, ref) => {
    const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`

    if (href) {
      return (
        <Link href={href} className={cls}>
          {children}
        </Link>
      )
    }

    return (
      <button ref={ref} className={cls} disabled={disabled || loading} {...props}>
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {children}
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
