import { ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import type { ToolMeta } from '@/lib/tools/types'
import { FavoriteButton } from './FavoriteButton'

export function ToolCard({
  tool,
  title,
  desc,
  soonLabel = 'Soon',
  className,
}: {
  tool: ToolMeta
  title?: string
  desc?: string
  soonLabel?: string
  className?: string
}) {
  const Icon = tool.icon
  const soon = tool.status === 'soon'
  const displayTitle = title ?? tool.title
  const displayDesc = desc ?? tool.description

  return (
    <div
      className={cn(
        'group relative flex flex-col rounded-2xl border border-border/50 bg-card p-4 transition-all',
        soon ? 'opacity-70' : 'hover:border-ufo-green/60 hover:shadow-md hover:shadow-ufo-green/5',
        className,
      )}
    >
      {soon ? (
        <span className="absolute inset-0 cursor-not-allowed" aria-disabled />
      ) : (
        <Link href={tool.href} aria-label={displayTitle} className="absolute inset-0 z-0 rounded-2xl" />
      )}

      <div className="pointer-events-none relative z-[1] flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ufo-green/10 text-ufo-green transition-colors group-hover:bg-ufo-green group-hover:text-black">
          <Icon className="h-5 w-5" />
        </div>
        {soon ? (
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            {soonLabel}
          </span>
        ) : (
          <div className="flex items-center gap-1">
            <FavoriteButton slug={tool.slug} className="pointer-events-auto" />
            <ArrowRight className="h-4 w-4 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:text-ufo-green" />
          </div>
        )}
      </div>

      <div className="pointer-events-none relative z-[1] mt-3 space-y-1">
        <h3 className="text-sm font-semibold leading-tight">{displayTitle}</h3>
        <p className="line-clamp-2 text-xs text-muted-foreground">{displayDesc}</p>
      </div>
    </div>
  )
}
