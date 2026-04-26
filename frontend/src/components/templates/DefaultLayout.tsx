import { Header } from '@/components/organisms/Header'

interface Props {
  children: React.ReactNode
  className?: string
}

export function DefaultLayout({ children, className = '' }: Props) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className={`max-w-6xl mx-auto px-4 sm:px-6 pb-16 ${className}`}>
        {children}
      </main>
    </div>
  )
}
