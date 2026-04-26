import { Button } from '@/components/atoms/Button'

export function HeroSection() {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-10 right-1/4 w-80 h-80 bg-violet-100 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="relative max-w-3xl mx-auto text-center px-4">
        <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-1.5 text-sm text-slate-600 font-medium mb-8 shadow-soft">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          New marketplaces added weekly
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 leading-[1.1] tracking-tight mb-6">
          Discover &amp; join the{' '}
          <span className="gradient-text">best marketplaces</span>
        </h1>

        <p className="text-xl text-slate-500 leading-relaxed mb-10 max-w-xl mx-auto">
          Your single gateway to hundreds of online marketplaces. Find the right communities, join in seconds, and grow your presence everywhere.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button href="/marketplaces" size="lg">
            Browse Marketplaces
          </Button>
          <Button href="/profile" variant="secondary" size="lg">
            View Your Profile
          </Button>
        </div>
      </div>
    </section>
  )
}
