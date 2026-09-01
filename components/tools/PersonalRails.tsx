'use client'

import { Star, History } from 'lucide-react'
import { ToolCard } from './ToolCard'
import { TOOL_MAP } from '@/lib/tools/registry'
import { useFavorites, useRecents } from '@/hooks/usePersonalization'
import type { ToolMeta } from '@/lib/tools/types'

function toTools(slugs: string[]): ToolMeta[] {
  return slugs.map((s) => TOOL_MAP[s]).filter((t): t is ToolMeta => Boolean(t))
}

function Rail({ icon, title, tools }: { icon: React.ReactNode; title: string; tools: ToolMeta[] }) {
  if (!tools.length) return null
  return (
    <section className="space-y-4">
      <h2 className="flex items-center gap-2 text-lg font-bold">
        {icon}
        {title}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {tools.map((t) => (
          <ToolCard key={t.slug} tool={t} />
        ))}
      </div>
    </section>
  )
}

export function PersonalRails() {
  const { favorites, mounted: favMounted } = useFavorites()
  const { recents, mounted: recentMounted } = useRecents()

  if (!favMounted || !recentMounted) return null

  const favTools = toTools(favorites)
  const recentTools = toTools(recents).slice(0, 6)

  if (!favTools.length && !recentTools.length) return null

  return (
    <div className="space-y-10">
      <Rail
        icon={<Star className="h-4 w-4 fill-ufo-green text-ufo-green" />}
        title="Favorites"
        tools={favTools}
      />
      <Rail
        icon={<History className="h-4 w-4 text-ufo-green" />}
        title="Recently used"
        tools={recentTools}
      />
    </div>
  )
}
