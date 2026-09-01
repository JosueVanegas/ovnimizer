export interface ChangelogEntry {
  version: string
  date: string
  title: string
  changes: string[]
}

// Newest first.
export const CHANGELOG: ChangelogEntry[] = [
  {
    version: '1.2.0',
    date: '2026-07-15',
    title: 'JSON category complete',
    changes: [
      'JSON Validator with line/column error locations',
      'JSON Diff — see exactly what changed between two documents',
      'JSON Minifier',
      'JSON → TypeScript with structural interface de-duplication',
      'JSON → YAML and JSON → CSV converters',
    ],
  },
  {
    version: '1.1.0',
    date: '2026-07-14',
    title: 'Personalization, PWA & more tools',
    changes: [
      'Favorites and Recently-used tools, saved locally',
      'Installable PWA with offline support for browser-only tools',
      'Keyboard shortcuts help (press ?)',
      'New tools: Gradient Generator, Contrast Checker, QR Generator, Lorem Ipsum, Slug Generator',
      'Text tools: Character/Word counters, Sort Lines, Remove Duplicate Lines',
      'CSS generators: Border Radius, Box Shadow, Clamp',
      'HTML Escape / Unescape',
    ],
  },
  {
    version: '1.0.0',
    date: '2026-07-10',
    title: 'Ovnimizer becomes a developer toolbox',
    changes: [
      'Brand-new homepage tool directory with categories',
      'Command palette search (⌘K / Ctrl+K)',
      'First tools: JSON Formatter, Base64, JWT Decoder, UUID, Hash, Case Converter, URL Encoder, HEX↔RGB, Password Generator, Unix Timestamp',
      'Image Optimizer and Converter carried over from the original app',
      'Everything runs locally in your browser — privacy-first',
    ],
  },
]
