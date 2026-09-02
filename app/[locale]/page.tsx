import { setRequestLocale, getTranslations } from 'next-intl/server'
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

const FEATURE_ICONS = [Zap, ShieldCheck, Wifi] as const
const FEATURE_KEYS = ['featureInstant', 'featurePrivate', 'featureOffline'] as const
const FAQ_KEYS = [1, 2, 3] as const

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('home')
  const tCat = await getTranslations('cat')
  const tt = await getTranslations('t')
  const tc = await getTranslations('common')

  const popular = popularTools()
  const recent = recentTools(6)
  const soonLabel = tc('soon')

  return (
    <div className="toptop min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 md:px-8 pt-36 pb-16 space-y-16">
        {/* Hero */}
        <section className="text-center space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-ufo-green/10 px-3 py-1 text-xs font-semibold text-ufo-green">
            <Sparkles className="h-3.5 w-3.5" />
            {t('badge')}
          </span>
          <h1 className="mx-auto max-w-3xl text-4xl md:text-6xl font-extrabold tracking-tight">
            {t('title')}
          </h1>
          <p className="mx-auto max-w-2xl text-base md:text-lg text-muted-foreground">
            {t('subtitle')}
          </p>
          <div className="mx-auto max-w-md">
            <SearchTrigger className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-border/60 bg-card px-4 py-3 text-sm text-muted-foreground shadow-sm transition-colors hover:border-ufo-green/50" />
          </div>
        </section>

        <PersonalRails />

        {/* Popular */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">{t('popular')}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {popular.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} title={tt(`${tool.slug}.title`)} desc={tt(`${tool.slug}.desc`)} soonLabel={soonLabel} />
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold">{t('categories')}</h2>
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
                    <p className="text-sm font-semibold">{tCat(`${cat.id}.label`)}</p>
                    <p className="text-xs text-muted-foreground">{t('nTools', { count })}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Recently added */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold">{t('recent')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {recent.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} title={tt(`${tool.slug}.title`)} desc={tt(`${tool.slug}.desc`)} soonLabel={soonLabel} />
            ))}
          </div>
        </section>

        {/* Privacy / features */}
        <section className="rounded-3xl border border-border/50 bg-card p-6 md:p-10">
          <div className="mx-auto max-w-2xl text-center space-y-2">
            <ShieldCheck className="mx-auto h-8 w-8 text-ufo-green" />
            <h2 className="text-2xl font-bold">{t('privacyTitle')}</h2>
            <p className="text-sm text-muted-foreground">{t('privacyDesc')}</p>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
            {FEATURE_KEYS.map((key, i) => {
              const Icon = FEATURE_ICONS[i]
              return (
                <div key={key} className="space-y-1.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ufo-green/10 text-ufo-green">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="font-semibold">{t(key)}</p>
                  <p className="text-sm text-muted-foreground">{t(`${key}Desc`)}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* FAQ */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold">{t('faq')}</h2>
          <div className="space-y-3">
            {FAQ_KEYS.map((n) => (
              <details
                key={n}
                className="group rounded-2xl border border-border/50 bg-card p-4"
              >
                <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold">
                  {t(`faqQ${n}`)}
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-2 text-sm text-muted-foreground">{t(`faqA${n}`)}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
