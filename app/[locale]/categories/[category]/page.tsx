import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ToolCard } from '@/components/tools/ToolCard'
import { Link } from '@/i18n/navigation'
import { ChevronRight } from 'lucide-react'
import { CATEGORIES, CATEGORY_MAP, toolsByCategory } from '@/lib/tools/registry'
import type { ToolCategoryId } from '@/lib/tools/types'
import { SITE_URL } from '@/lib/tools/seo'

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>
}): Promise<Metadata> {
  const { locale, category } = await params
  const cat = CATEGORY_MAP[category as ToolCategoryId]
  if (!cat) return {}
  const title = `${cat.label} Tools — Ovnimizer`
  return {
    title,
    description: cat.description,
    alternates: { canonical: `${SITE_URL}/${locale}/categories/${cat.id}` },
    openGraph: { title, description: cat.description, type: 'website' },
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>
}) {
  const { locale, category } = await params
  setRequestLocale(locale)
  const cat = CATEGORY_MAP[category as ToolCategoryId]
  if (!cat) notFound()

  const tools = toolsByCategory(cat.id)
  const Icon = cat.icon

  return (
    <div className="toptop min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 md:px-8 pt-36 pb-16 space-y-8">
        <nav className="flex items-center gap-1 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-foreground transition-colors">Tools</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{cat.label}</span>
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ufo-green/10 text-ufo-green">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{cat.label} tools</h1>
            <p className="text-sm text-muted-foreground">{cat.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {tools.map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
