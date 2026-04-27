interface StatCardProps {
  label: string
  value: string | number
  icon?: React.ReactNode
  trend?: string
  className?: string
}

export function StatCard({ label, value, icon, trend, className = '' }: StatCardProps) {
  return (
    <div className={`relative rounded-2xl p-px bg-gradient-to-br from-white/50 via-white/20 to-white/5 dark:from-white/12 dark:via-white/5 dark:to-transparent shadow-soft ${className}`}>
      <div className="relative rounded-[15px] bg-white/60 dark:bg-slate-900/65 backdrop-blur-xl overflow-hidden p-5 h-full">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent pointer-events-none" />
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
    </div>
  )
}
