'use client'

import { useTransition } from 'react'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const toggle = () => {
    startTransition(() => {
      router.replace(pathname, { locale: locale === 'en' ? 'pt' : 'en' })
    })
  }

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      aria-label="Toggle language"
      className="w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold text-fg-muted hover:text-fg hover:bg-card-raised transition-all duration-150 disabled:opacity-50"
    >
      {locale === 'en' ? 'PT' : 'EN'}
    </button>
  )
}
