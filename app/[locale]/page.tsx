import { setRequestLocale } from 'next-intl/server'
import { ShieldCheck, Zap, Wifi, Sparkles, ArrowRight } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { SearchTrigger } from '@/components/SearchTrigger'
import { ToolCard } from '@/components/tools/ToolCard'
import { PersonalRails } from '@/components/tools/PersonalRails'
import { Link } from '@/i18n/navigation'
import {
  CATEGORIES,
  popularTools,
  recentTools,
  toolsByCategory,
} from '@/lib/tools/registry'

const FEATURES = [
  { Icon: Zap, title: 'Instant', body: 'No sign-up, no waiting. Tools run the moment the page loads.' },
  { Icon: ShieldCheck, title: 'Private', body: 'Everything runs in your browser. Your data never leaves your device.' },
  { Icon: Wifi, title: 'Works offline', body: 'Browser-only tools keep working without a connection.' },
]

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const popular = popularTools()
  const recent = recentTools(6)

  return (
    <div className="toptop min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 md:px-8 pt-36 pb-16 space-y-16">
        {/* Hero */}
        <section className="text-center space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-ufo-green/10 px-3 py-1 text-xs font-semibold text-ufo-green">
            <Sparkles className="h-3.5 w-3.5" />
            The developer toolbox
          </span>
          <h1 className="mx-auto max-w-3xl text-4xl md:text-6xl font-extrabold tracking-tight">
            Developer tools that work instantly in your browser
          </h1>
          <p className="mx-auto max-w-2xl text-base md:text-lg text-muted-foreground">
            Format, convert, generate and inspect — dozens of fast, privacy-first utilities in one
            place. No accounts, no uploads, no clutter.
          </p>
          <div className="mx-auto max-w-md">
            <SearchTrigger className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-border/60 bg-card px-4 py-3 text-sm text-muted-foreground shadow-sm transition-colors hover:border-ufo-green/50" />
          </div>
        </section>

        {/* Favorites + Recently used (client, hydrates from localStorage) */}
        <PersonalRails />

        {/* Popular */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Popular tools</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {popular.map((t) => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold">Browse by category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon
              const count = toolsByCategory(cat.id).length
              return (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.id}`}
                  className="group flex flex-col gap-2 rounded-2xl border border-border/50 bg-card p-4 transition-all hover:border-ufo-green/60 hover:shadow-md hover:shadow-ufo-green/5"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ufo-green/10 text-ufo-green transition-colors group-hover:bg-ufo-green group-hover:text-black">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{cat.label}</p>
                    <p className="text-xs text-muted-foreground">{count} tools</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Recently added */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold">Recently added</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {recent.map((t) => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
        </section>

        {/* Privacy / features */}
        <section className="rounded-3xl border border-border/50 bg-card p-6 md:p-10">
          <div className="mx-auto max-w-2xl text-center space-y-2">
            <ShieldCheck className="mx-auto h-8 w-8 text-ufo-green" />
            <h2 className="text-2xl font-bold">Privacy-first by design</h2>
            <p className="text-sm text-muted-foreground">
              Ovnimizer processes your data locally whenever technically possible. Files and text
              stay on your device — nothing is uploaded to a server.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
            {FEATURES.map(({ Icon, title, body }) => (
              <div key={title} className="space-y-1.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ufo-green/10 text-ufo-green">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="font-semibold">{title}</p>
                <p className="text-sm text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold">Frequently asked questions</h2>
          <div className="space-y-3">
            {FAQ.map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl border border-border/50 bg-card p-4"
              >
                <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold">
                  {item.q}
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-2 text-sm text-muted-foreground">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

const FAQ = [
  {
    q: 'Are my files and data uploaded anywhere?',
    a: 'No. Browser-only tools process everything locally on your device. Nothing is sent to a server.',
  },
  {
    q: 'Do I need an account?',
    a: 'Never. Every tool works instantly with no sign-up.',
  },
  {
    q: 'Is Ovnimizer free?',
    a: 'Yes — Ovnimizer is a free, open-source project built for the developer community.',
  },
]
