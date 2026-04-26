type Variant = 'default' | 'primary' | 'success' | 'warning' | 'purple'

interface BadgeProps {
  variant?: Variant
  children: React.ReactNode
  className?: string
}

const variants: Record<Variant, string> = {
  default: 'bg-card-raised text-fg-muted',
  primary: 'bg-primary-subtle text-primary',
  // status colors are intentionally fixed hues — dark: variants expected here
  success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
  purple:  'bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300',
}

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
