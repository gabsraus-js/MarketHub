'use client'

import { useTranslations } from 'next-intl'
import { usePathname, Link } from '@/i18n/navigation'
import { Avatar } from '@/components/atoms/Avatar'
import { LanguageSwitcher } from '@/components/atoms/LanguageSwitcher'
import { useTheme } from '@/components/ThemeProvider'

function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="w-9 h-9 flex items-center justify-center rounded-xl text-fg-muted hover:text-fg hover:bg-card-raised transition-all duration-150"
    >
      {theme === 'dark' ? (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  )
}

export function Header() {
  const t = useTranslations('nav')
  const pathname = usePathname()

  const navItems = [
    { label: t('dashboard'),    href: '/'             },
    { label: t('marketplaces'), href: '/marketplaces' },
    { label: t('products'),     href: '/products'     },
    { label: t('profile'),      href: '/profile'      },
  ]

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border-subtle">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-soft">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-bold text-fg text-lg tracking-tight">MarketHub</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                pathname === item.href
                  ? 'text-primary bg-primary-subtle'
                  : 'text-fg-muted hover:text-fg hover:bg-card-raised'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <Link href="/profile" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <Avatar fallback="Alex Johnson" size="sm" />
            <span className="hidden sm:block text-sm font-medium text-fg-muted">Alex</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
