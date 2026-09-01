import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { Check } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CHANGELOG } from '@/lib/tools/changelog'
import { SITE_URL } from '@/lib/tools/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const title = 'Changelog — Ovnimizer'
  const description = 'New tools, features and improvements shipped to Ovnimizer.'
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/${locale}/changelog` },
    openGraph: { title, description, type: 'website' },
  }
}

export default async function ChangelogPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="toptop min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 md:px-8 pt-36 pb-16 space-y-10">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Changelog</h1>
          <p className="text-muted-foreground">New tools, features and improvements.</p>
        </div>

        <div className="relative space-y-10 border-l border-border/50 pl-6">
          {CHANGELOG.map((entry) => (
            <section key={entry.version} className="relative">
              <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-ufo-green bg-background" />
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h2 className="text-lg font-bold">{entry.title}</h2>
                <span className="rounded-full bg-ufo-green/10 px-2 py-0.5 text-xs font-semibold text-ufo-green">
                  v{entry.version}
                </span>
                <time className="text-xs text-muted-foreground">
                  {new Date(entry.date).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })}
                </time>
              </div>
              <ul className="mt-3 space-y-1.5">
                {entry.changes.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-ufo-green" />
                    {c}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
