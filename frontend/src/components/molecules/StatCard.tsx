interface StatCardProps {
  label: string
  value: string | number
  icon?: React.ReactNode
  trend?: string
  className?: string
}

export function StatCard({ label, value, icon, trend, className = '' }: StatCardProps) {
  return (
    <div className={`bg-card rounded-2xl border border-border-subtle shadow-soft p-5 ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-fg-subtle uppercase tracking-wider">{label}</p>
          <p className="mt-1.5 text-2xl font-bold text-fg">{value}</p>
          {trend && <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">{trend}</p>}
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-primary-subtle flex items-center justify-center text-primary shrink-0">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
