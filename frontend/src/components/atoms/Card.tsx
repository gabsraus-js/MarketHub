'use client'

import { forwardRef } from 'react'

type Variant = 'glass' | 'solid' | 'raised'
type Padding = 'none' | 'sm' | 'md' | 'lg'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Variant
  padding?: Padding
  children?: React.ReactNode
}

const variants: Record<Variant, string> = {
  glass: [
    'relative overflow-hidden',
    'bg-white/55 dark:bg-slate-900/60',
    'backdrop-blur-xl',
    'border border-white/60 dark:border-white/10',
    'shadow-soft-md',
    'before:absolute before:inset-x-0 before:top-0 before:h-px before:pointer-events-none before:z-10',
    'before:bg-gradient-to-r before:from-transparent before:via-white/80 before:to-transparent',
    'dark:before:via-white/20',
  ].join(' '),
  solid: 'bg-card border border-border shadow-soft',
  raised: 'bg-card-raised border border-border-subtle shadow-soft-md',
}

const paddings: Record<Padding, string> = {
  none: '',
  sm:   'p-3',
  md:   'p-5',
  lg:   'p-8',
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'glass', padding = 'md', children, className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`rounded-2xl ${variants[variant]} ${paddings[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
)

Card.displayName = 'Card'
