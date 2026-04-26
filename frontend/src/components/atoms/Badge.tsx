type Variant = 'default' | 'primary' | 'success' | 'warning' | 'purple'

interface BadgeProps {
  variant?: Variant
  children: React.ReactNode
  className?: string
}

const variants: Record<Variant, string> = {
  default: 'bg-slate-100 text-slate-600',
  primary: 'bg-primary-100 text-primary-700',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  purple: 'bg-violet-100 text-violet-700',
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
