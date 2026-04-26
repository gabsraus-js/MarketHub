interface AvatarProps {
  src?: string | null
  alt?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  fallback?: string
  className?: string
}

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
}

export function Avatar({ src, alt = '', size = 'md', fallback, className = '' }: AvatarProps) {
  const sizeClass = sizes[size]
  const label = fallback || alt
  const initials = label
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${sizeClass} rounded-full object-cover ring-2 ring-white shadow-soft ${className}`}
      />
    )
  }

  return (
    <div
      className={`${sizeClass} rounded-full bg-gradient-to-br from-primary-400 to-violet-500 flex items-center justify-center text-white font-semibold ring-2 ring-white shadow-soft ${className}`}
    >
      {initials || '?'}
    </div>
  )
}
