'use client'

import { useState, useRef, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { usePathname, Link } from '@/i18n/navigation'
import { routing, Locale } from '@/i18n/routing'
import { ChevronDown, Check } from 'lucide-react'
import ReactCountryFlag from 'react-country-flag'

const LOCALES: Record<Locale, { countryCode: string; code: string; name: string }> = {
  es: { countryCode: 'ES', code: 'ES', name: 'Español'   },
  en: { countryCode: 'GB', code: 'EN', name: 'English'   },
  pt: { countryCode: 'PT', code: 'PT', name: 'Português' },
  it: { countryCode: 'IT', code: 'IT', name: 'Italiano'  },
  ja: { countryCode: 'JP', code: 'JA', name: '日本語'     },
  ru: { countryCode: 'RU', code: 'RU', name: 'Русский'   },
  de: { countryCode: 'DE', code: 'DE', name: 'Deutsch'   },
}

function Flag({ countryCode }: { countryCode: string }) {
  return (
    <ReactCountryFlag
      countryCode={countryCode}
      svg
      style={{ width: '1.15em', height: '0.85em', borderRadius: '2px' }}
      aria-hidden="true"
    />
  )
}

export function LanguageSwitcher() {
  const locale   = useLocale() as Locale
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const current = LOCALES[locale]

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-sm font-medium hover:bg-muted/60 transition-colors"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select language"
      >
        <Flag countryCode={current.countryCode} />
        <span>{current.code}</span>
        <ChevronDown
          className={[
            'w-3 h-3 text-muted-foreground transition-transform duration-200',
            open ? 'rotate-180' : '',
          ].join(' ')}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-1 z-50 bg-popover border border-border/40 rounded-xl shadow-xl overflow-hidden min-w-37 animate-slide-up"
          role="listbox"
        >
          {routing.locales.map((l) => {
            const info   = LOCALES[l]
            const active = l === locale
            return (
              <Link
                key={l}
                href={pathname}
                locale={l}
                onClick={() => setOpen(false)}
                role="option"
                aria-selected={active}
                className={[
                  'flex items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-muted/60',
                  active ? 'bg-muted/40' : '',
                ].join(' ')}
              >
                <Flag countryCode={info.countryCode} />
                <span className="font-semibold w-6 shrink-0">{info.code}</span>
                <span className="text-muted-foreground text-xs truncate">{info.name}</span>
                {active && <Check className="w-3 h-3 text-emerald-500 ml-auto shrink-0" />}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
