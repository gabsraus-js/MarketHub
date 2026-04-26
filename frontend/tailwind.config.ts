import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── semantic tokens ─────────────────────────────────────────
        // CSS vars flip between light/dark automatically.
        // Usage: bg-primary, text-fg, border-border, bg-card, etc.
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          hover:   'rgb(var(--color-primary-hover) / <alpha-value>)',
          subtle:  'rgb(var(--color-primary-subtle) / <alpha-value>)',
          fg:      'rgb(var(--color-primary-fg) / <alpha-value>)',
        },
        background: 'rgb(var(--color-bg) / <alpha-value>)',
        card: {
          DEFAULT: 'rgb(var(--color-card) / <alpha-value>)',
          raised:  'rgb(var(--color-card-raised) / <alpha-value>)',
        },
        border: {
          DEFAULT: 'rgb(var(--color-border) / <alpha-value>)',
          subtle:  'rgb(var(--color-border-subtle) / <alpha-value>)',
        },
        fg: {
          DEFAULT: 'rgb(var(--color-fg) / <alpha-value>)',
          muted:   'rgb(var(--color-fg-muted) / <alpha-value>)',
          subtle:  'rgb(var(--color-fg-subtle) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft:    '0 2px 8px 0 rgba(0,0,0,0.06)',
        'soft-md': '0 4px 16px 0 rgba(0,0,0,0.08)',
        'soft-lg': '0 8px 32px 0 rgba(0,0,0,0.10)',
      },
    },
  },
  plugins: [],
}

export default config
