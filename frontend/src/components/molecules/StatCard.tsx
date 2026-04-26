interface StatCardProps {
  label: string
  value: string | number
  icon?: React.ReactNode
  trend?: string
  className?: string
}

export function StatCard({ label, value, icon, trend, className = '' }: StatCardProps) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 shadow-soft p-5 ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</p>
          <p className="mt-1.5 text-2xl font-bold text-slate-900">{value}</p>
          {trend && <p className="mt-1 text-xs text-emerald-600 font-medium">{trend}</p>}
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-500 shrink-0">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
