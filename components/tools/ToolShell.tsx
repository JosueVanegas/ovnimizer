import { ChevronRight } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Link } from '@/i18n/navigation'
import { CATEGORY_MAP, toolsByCategory } from '@/lib/tools/registry'
import type { ToolMeta } from '@/lib/tools/types'
import { LocalBadge } from './ui'
import { ShareButton } from './ShareButton'
import { ToolCard } from './ToolCard'
import { FavoriteButton } from './FavoriteButton'
import { RecordVisit } from './RecordVisit'

export function ToolShell({ tool, children }: { tool: ToolMeta; children: React.ReactNode }) {
  const category = CATEGORY_MAP[tool.category]
  const CategoryIcon = category.icon
  const related = toolsByCategory(tool.category)
    .filter((t) => t.slug !== tool.slug)
    .sort((a, b) => (a.status === b.status ? 0 : a.status === 'ready' ? -1 : 1))
    .slice(0, 4)

  return (
    <div className="toptop min-h-screen flex flex-col">
      <RecordVisit slug={tool.slug} />
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 md:px-8 pt-36 pb-16 space-y-6">
        <nav className="flex items-center gap-1 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-foreground transition-colors">Tools</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={`/categories/${category.id}`} className="hover:text-foreground transition-colors">
            {category.label}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{tool.title}</span>
        </nav>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ufo-green/10 text-ufo-green">
              <CategoryIcon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{tool.title}</h1>
              <p className="text-sm text-muted-foreground">{tool.description}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <LocalBadge />
            <FavoriteButton slug={tool.slug} variant="labeled" />
            <ShareButton title={tool.title} />
          </div>
        </div>

        <section className="rounded-2xl border border-border/50 bg-card p-4 md:p-6">{children}</section>

        {related.length > 0 && (
          <section className="space-y-3 pt-2">
            <h2 className="text-sm font-semibold text-muted-foreground">Related tools</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {related.map((t) => (
                <ToolCard key={t.slug} tool={t} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
