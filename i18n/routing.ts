import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['es', 'en', 'pt', 'it', 'ja', 'ru', 'de'],
  defaultLocale: 'es',
})

export type Locale = (typeof routing.locales)[number]
