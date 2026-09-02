'use client'

import { Star } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { useFavorites } from '@/hooks/usePersonalization'

export function FavoriteButton({
  slug,
  variant = 'icon',
  className,
}: {
  slug: string
  variant?: 'icon' | 'labeled'
  className?: string
}) {
  const { isFavorite, toggle, mounted } = useFavorites()
  const tc = useTranslations('common')
  const active = mounted && isFavorite(slug)

  function onClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    toggle(slug)
  }

  if (variant === 'labeled') {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors',
          active
            ? 'border-ufo-green/50 bg-ufo-green/10 text-ufo-green'
            : 'border-border/60 bg-muted/40 hover:bg-muted/70',
          className,
        )}
      >
        <Star className={cn('h-3.5 w-3.5', active && 'fill-current')} />
        {active ? tc('favorited') : tc('favorite')}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={active ? tc('removeFavorite') : tc('addFavorite')}
      aria-pressed={active}
      className={cn(
        'flex h-7 w-7 items-center justify-center rounded-lg transition-colors',
        active
          ? 'text-ufo-green'
          : 'text-muted-foreground/40 hover:text-muted-foreground hover:bg-muted/60',
        className,
      )}
    >
      <Star className={cn('h-4 w-4', active && 'fill-current')} />
    </button>
  )
}
