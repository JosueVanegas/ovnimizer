import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ShieldCheck, ArrowLeft } from 'lucide-react'

const sections = [
  'local',
  'noCollection',
  'noTracking',
  'cloudIntegration',
  'openSource',
  'gdpr',
] as const

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'privacy' })

  return (
    <>
      <Header />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 md:px-8 py-12 space-y-10">
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('back')}
          </Link>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ufo-green/10 border border-ufo-green/20 text-ufo-green text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              {t('badge')}
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">{t('title')}</h1>
            <p className="text-muted-foreground text-base leading-relaxed">{t('intro')}</p>
          </div>
        </div>

        <div className="space-y-6">
          {sections.map((key) => (
            <div
              key={key}
              className="rounded-2xl border border-border/40 bg-card p-6 space-y-2"
            >
              <h2 className="font-bold text-base">
                {t(`${key}Title` as Parameters<typeof t>[0])}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t(`${key}Body` as Parameters<typeof t>[0])}
              </p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </>
  )
}
