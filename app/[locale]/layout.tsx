import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { Toaster } from '@/components/ui/sonner'
import { FloatingCow } from '@/components/FloatingCow'
import { CommandPalette } from '@/components/CommandPalette'
import { ShortcutsModal } from '@/components/ShortcutsModal'
import { routing } from '@/i18n/routing'

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <FloatingCow />
      <CommandPalette />
      <ShortcutsModal />
      {children}
      <Toaster richColors position="bottom-right" />
    </NextIntlClientProvider>
  )
}
