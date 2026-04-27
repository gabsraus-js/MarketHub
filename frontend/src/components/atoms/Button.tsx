'use client'

import { forwardRef } from 'react'
import { Link } from '@/i18n/navigation'

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
  primary: [
    'bg-gradient-to-b from-primary to-primary-hover text-primary-fg',
    'border border-primary/20',
    'shadow-soft hover:shadow-soft-md',
    'before:absolute before:inset-x-0 before:top-0 before:h-px',
    'before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent',
    'before:pointer-events-none',
    'neuro:bg-primary neuro:bg-none neuro:border-transparent neuro:before:hidden neuro:shadow-neuro-sm neuro:active:shadow-neuro-inset',
  ].join(' '),
  secondary: [
    'bg-white/60 dark:bg-white/6 text-fg',
    'border border-white/70 dark:border-white/10',
    'backdrop-blur-sm shadow-soft hover:shadow-soft-md',
    'hover:bg-white/80 dark:hover:bg-white/10',
    'before:absolute before:inset-x-0 before:top-0 before:h-px',
    'before:bg-gradient-to-r before:from-transparent before:via-white/80 before:to-transparent',
    'dark:before:via-white/20 before:pointer-events-none',
    'neuro:bg-background neuro:backdrop-blur-none neuro:border-transparent neuro:before:hidden neuro:shadow-neuro-sm neuro:hover:shadow-neuro',
  ].join(' '),
  ghost:
    'text-fg-muted hover:text-fg hover:bg-white/40 dark:hover:bg-white/6 backdrop-blur-sm neuro:backdrop-blur-none neuro:hover:bg-background neuro:hover:shadow-neuro-sm',
  outline: [
    'border border-primary/50 text-primary',
    'backdrop-blur-sm',
    'hover:bg-primary/8 dark:hover:bg-primary/10',
    'neuro:backdrop-blur-none neuro:border-primary/40',
  ].join(' '),
}

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
  md: 'px-4 py-2 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3 text-base rounded-xl gap-2',
}

const base =
  'relative overflow-hidden inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]'

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
