import {
  Image as ImageIcon,
  Braces,
  Binary,
  KeyRound,
  Hash as HashIcon,
  Fingerprint,
  Type,
  Link2,
  Code2,
  Paintbrush,
  Shapes,
  Palette,
  Search,
  GitBranch,
  Wrench,
  Clock,
  Lock,
  QrCode,
  Ruler,
  ShieldCheck,
  FileJson,
  FileCode,
  ScanLine,
} from 'lucide-react'
import type { CategoryMeta, ToolCategoryId, ToolMeta } from './types'

export const CATEGORIES: CategoryMeta[] = [
  { id: 'images', label: 'Images', description: 'Optimize, convert and transform images', icon: ImageIcon },
  { id: 'json', label: 'JSON', description: 'Format, validate and convert JSON', icon: Braces },
  { id: 'base64', label: 'Base64', description: 'Encode and decode Base64', icon: Binary },
  { id: 'jwt', label: 'JWT', description: 'Inspect JSON Web Tokens', icon: KeyRound },
  { id: 'hash', label: 'Hash', description: 'Generate cryptographic hashes', icon: HashIcon },
  { id: 'uuid', label: 'UUID', description: 'Generate unique identifiers', icon: Fingerprint },
  { id: 'text', label: 'Text', description: 'Transform and analyze text', icon: Type },
  { id: 'url', label: 'URL', description: 'Encode, decode and parse URLs', icon: Link2 },
  { id: 'html', label: 'HTML', description: 'Beautify, minify and escape HTML', icon: Code2 },
  { id: 'css', label: 'CSS', description: 'Beautify, minify and generate CSS', icon: Paintbrush },
  { id: 'svg', label: 'SVG', description: 'Optimize and convert SVG', icon: Shapes },
  { id: 'colors', label: 'Colors', description: 'Convert, generate and check colors', icon: Palette },
  { id: 'seo', label: 'SEO', description: 'Metadata, robots and sitemaps', icon: Search },
  { id: 'git', label: 'Git', description: 'Commits and .gitignore helpers', icon: GitBranch },
  { id: 'utilities', label: 'Utilities', description: 'Everyday developer utilities', icon: Wrench },
]

export const CATEGORY_MAP: Record<ToolCategoryId, CategoryMeta> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
) as Record<ToolCategoryId, CategoryMeta>

const READY = '2026-07-15'

// Full catalog. `status: 'ready'` tools have a working page; `'soon'` tools are
// surfaced in the directory/search but not yet linkable.
export const TOOLS: ToolMeta[] = [
  // ---- Images ----
  { slug: 'image-optimizer', href: '/optimize', title: 'Image Optimizer', category: 'images', icon: ImageIcon, status: 'ready', popular: true, addedAt: READY, description: 'Compress and resize images without changing format.', keywords: ['compress', 'optimize', 'resize', 'webp', 'quality'], aliases: ['minify image', 'shrink'] },
  { slug: 'image-converter', href: '/convert', title: 'Convert Image', category: 'images', icon: ImageIcon, status: 'ready', popular: true, addedAt: READY, description: 'Convert between JPG, PNG, WebP, AVIF, TIFF, BMP.', keywords: ['convert', 'jpg', 'png', 'webp', 'avif', 'tiff'], aliases: ['change format'] },
  { slug: 'resize-image', href: '/tools/resize-image', title: 'Resize Image', category: 'images', icon: Ruler, status: 'soon', description: 'Resize images to exact dimensions.', keywords: ['resize', 'scale', 'dimensions'] },
  { slug: 'heic-converter', href: '/tools/heic-converter', title: 'HEIC Converter', category: 'images', icon: ImageIcon, status: 'soon', description: 'Convert HEIC/HEIF photos to JPG or PNG.', keywords: ['heic', 'heif', 'iphone', 'jpg'] },
  { slug: 'exif-remover', href: '/tools/exif-remover', title: 'EXIF Remover', category: 'images', icon: ScanLine, status: 'soon', description: 'Strip metadata from images.', keywords: ['exif', 'metadata', 'privacy', 'gps'] },
  { slug: 'blur-placeholder', href: '/tools/blur-placeholder', title: 'Blur Placeholder Generator', category: 'images', icon: ImageIcon, status: 'soon', description: 'Generate base64 blur placeholders (LQIP).', keywords: ['blurhash', 'lqip', 'placeholder', 'next'] },
  { slug: 'responsive-image', href: '/tools/responsive-image', title: 'Responsive Image Generator', category: 'images', icon: ImageIcon, status: 'soon', description: 'Generate srcset and multiple sizes.', keywords: ['srcset', 'responsive', 'sizes'] },
  { slug: 'favicon-generator', href: '/tools/favicon-generator', title: 'Favicon Generator', category: 'images', icon: ImageIcon, status: 'soon', description: 'Generate favicons in all sizes.', keywords: ['favicon', 'ico', 'apple-touch'] },

  // ---- JSON ----
  { slug: 'json-formatter', href: '/tools/json-formatter', title: 'JSON Formatter', category: 'json', icon: FileJson, status: 'ready', popular: true, addedAt: READY, description: 'Format, validate and minify JSON instantly.', keywords: ['json', 'format', 'pretty', 'beautify', 'validate', 'minify'], aliases: ['json beautifier', 'json pretty print'] },
  { slug: 'json-validator', href: '/tools/json-validator', title: 'JSON Validator', category: 'json', icon: FileJson, status: 'ready', addedAt: READY, description: 'Validate JSON and pinpoint errors by line and column.', keywords: ['json', 'validate', 'lint', 'error'] },
  { slug: 'json-diff', href: '/tools/json-diff', title: 'JSON Diff', category: 'json', icon: FileJson, status: 'ready', addedAt: READY, description: 'Compare two JSON documents and see what changed.', keywords: ['json', 'diff', 'compare', 'changes'] },
  { slug: 'json-minifier', href: '/tools/json-minifier', title: 'JSON Minifier', category: 'json', icon: FileJson, status: 'ready', addedAt: READY, description: 'Minify JSON to the smallest size.', keywords: ['json', 'minify', 'compress'] },
  { slug: 'json-to-typescript', href: '/tools/json-to-typescript', title: 'JSON → TypeScript', category: 'json', icon: FileCode, status: 'ready', addedAt: READY, popular: true, description: 'Generate TypeScript interfaces from JSON.', keywords: ['json', 'typescript', 'types', 'interface'] },
  { slug: 'json-to-yaml', href: '/tools/json-to-yaml', title: 'JSON → YAML', category: 'json', icon: FileCode, status: 'ready', addedAt: READY, description: 'Convert JSON to YAML.', keywords: ['json', 'yaml', 'convert'] },
  { slug: 'json-to-csv', href: '/tools/json-to-csv', title: 'JSON → CSV', category: 'json', icon: FileCode, status: 'ready', addedAt: READY, description: 'Convert a JSON array to CSV.', keywords: ['json', 'csv', 'convert', 'excel'] },

  // ---- Base64 ----
  { slug: 'base64', href: '/tools/base64', title: 'Base64 Encode / Decode', category: 'base64', icon: Binary, status: 'ready', popular: true, addedAt: READY, description: 'Encode and decode Base64 text.', keywords: ['base64', 'encode', 'decode', 'atob', 'btoa'], aliases: ['b64'] },
  { slug: 'base64-image', href: '/tools/base64-image', title: 'Image ↔ Base64', category: 'base64', icon: ImageIcon, status: 'ready', addedAt: READY, description: 'Convert images to and from Base64 data URIs.', keywords: ['base64', 'image', 'data uri', 'encode', 'decode'] },
  { slug: 'base64-file', href: '/tools/base64-file', title: 'File ↔ Base64', category: 'base64', icon: Binary, status: 'ready', addedAt: READY, description: 'Convert any file to and from Base64.', keywords: ['base64', 'file', 'data uri', 'encode', 'decode'] },

  // ---- JWT ----
  { slug: 'jwt-decoder', href: '/tools/jwt-decoder', title: 'JWT Decoder', category: 'jwt', icon: KeyRound, status: 'ready', popular: true, addedAt: READY, description: 'Decode and inspect JSON Web Tokens locally.', keywords: ['jwt', 'token', 'decode', 'auth', 'bearer'], aliases: ['json web token'] },

  // ---- Hash ----
  { slug: 'hash-generator', href: '/tools/hash-generator', title: 'Hash Generator', category: 'hash', icon: HashIcon, status: 'ready', addedAt: READY, description: 'Generate SHA-1, SHA-256, SHA-384 and SHA-512 hashes.', keywords: ['hash', 'sha256', 'sha512', 'sha1', 'checksum', 'digest'], aliases: ['md5', 'sha'] },

  // ---- UUID ----
  { slug: 'uuid-generator', href: '/tools/uuid-generator', title: 'UUID Generator', category: 'uuid', icon: Fingerprint, status: 'ready', popular: true, addedAt: READY, description: 'Generate UUID v4 identifiers in bulk.', keywords: ['uuid', 'guid', 'v4', 'id', 'random'], aliases: ['nanoid', 'ulid'] },

  // ---- Text ----
  { slug: 'case-converter', href: '/tools/case-converter', title: 'Case Converter', category: 'text', icon: Type, status: 'ready', addedAt: READY, description: 'Convert text between camelCase, snake_case and more.', keywords: ['case', 'camel', 'snake', 'kebab', 'uppercase', 'title'], aliases: ['text case'] },
  { slug: 'remove-duplicate-lines', href: '/tools/remove-duplicate-lines', title: 'Remove Duplicate Lines', category: 'text', icon: Type, status: 'ready', addedAt: READY, description: 'Remove duplicate lines, keeping order.', keywords: ['duplicate', 'lines', 'dedupe', 'unique'] },
  { slug: 'sort-lines', href: '/tools/sort-lines', title: 'Sort Lines', category: 'text', icon: Type, status: 'ready', addedAt: READY, description: 'Sort lines alphabetically, numerically or by length.', keywords: ['sort', 'lines', 'order', 'alphabetize'] },
  { slug: 'character-counter', href: '/tools/character-counter', title: 'Character Counter', category: 'text', icon: Type, status: 'ready', addedAt: READY, description: 'Count characters, words, lines and reading time.', keywords: ['count', 'characters', 'length'] },
  { slug: 'word-counter', href: '/tools/word-counter', title: 'Word Counter', category: 'text', icon: Type, status: 'ready', addedAt: READY, description: 'Count words, sentences and reading time.', keywords: ['count', 'words', 'reading time'] },
  { slug: 'lorem-ipsum', href: '/tools/lorem-ipsum', title: 'Lorem Ipsum Generator', category: 'text', icon: Type, status: 'ready', addedAt: READY, description: 'Generate placeholder text in paragraphs, sentences or words.', keywords: ['lorem', 'ipsum', 'placeholder', 'dummy', 'filler'] },

  // ---- URL ----
  { slug: 'url-encoder', href: '/tools/url-encoder', title: 'URL Encoder / Decoder', category: 'url', icon: Link2, status: 'ready', addedAt: READY, description: 'Percent-encode and decode URLs and components.', keywords: ['url', 'encode', 'decode', 'percent', 'uri'], aliases: ['encodeuricomponent'] },
  { slug: 'query-parser', href: '/tools/query-parser', title: 'Query Parser', category: 'url', icon: Link2, status: 'ready', addedAt: READY, description: 'Parse query strings into key/value pairs and JSON.', keywords: ['query', 'params', 'parse', 'querystring'] },
  { slug: 'url-builder', href: '/tools/url-builder', title: 'URL Builder', category: 'url', icon: Link2, status: 'ready', addedAt: READY, description: 'Build URLs from a base and query parameters.', keywords: ['url', 'build', 'params', 'querystring'] },

  // ---- HTML ----
  { slug: 'html-beautifier', href: '/tools/html-beautifier', title: 'HTML Beautifier', category: 'html', icon: Code2, status: 'soon', description: 'Format and indent HTML.', keywords: ['html', 'beautify', 'format'] },
  { slug: 'html-minifier', href: '/tools/html-minifier', title: 'HTML Minifier', category: 'html', icon: Code2, status: 'soon', description: 'Minify HTML markup.', keywords: ['html', 'minify', 'compress'] },
  { slug: 'escape-html', href: '/tools/escape-html', title: 'Escape HTML', category: 'html', icon: Code2, status: 'ready', addedAt: READY, description: 'Escape special HTML characters to entities.', keywords: ['html', 'escape', 'entities', 'encode'] },
  { slug: 'unescape-html', href: '/tools/unescape-html', title: 'Unescape HTML', category: 'html', icon: Code2, status: 'ready', addedAt: READY, description: 'Decode HTML entities back to text.', keywords: ['html', 'unescape', 'entities', 'decode'] },

  // ---- CSS ----
  { slug: 'css-beautifier', href: '/tools/css-beautifier', title: 'CSS Beautifier', category: 'css', icon: Paintbrush, status: 'soon', description: 'Format and indent CSS.', keywords: ['css', 'beautify', 'format'] },
  { slug: 'css-minifier', href: '/tools/css-minifier', title: 'CSS Minifier', category: 'css', icon: Paintbrush, status: 'soon', description: 'Minify CSS.', keywords: ['css', 'minify', 'compress'] },
  { slug: 'border-radius', href: '/tools/border-radius', title: 'Border Radius Generator', category: 'css', icon: Paintbrush, status: 'ready', addedAt: READY, description: 'Visually generate CSS border-radius.', keywords: ['border', 'radius', 'css', 'rounded', 'corners'] },
  { slug: 'box-shadow', href: '/tools/box-shadow', title: 'Box Shadow Generator', category: 'css', icon: Paintbrush, status: 'ready', addedAt: READY, popular: true, description: 'Visually generate CSS box-shadow.', keywords: ['box', 'shadow', 'css', 'drop shadow', 'inset'] },
  { slug: 'clamp-generator', href: '/tools/clamp-generator', title: 'Clamp Generator', category: 'css', icon: Paintbrush, status: 'ready', addedAt: READY, description: 'Generate fluid responsive CSS clamp() values.', keywords: ['clamp', 'fluid', 'responsive', 'css', 'typography'] },

  // ---- SVG ----
  { slug: 'svg-optimizer', href: '/tools/svg-optimizer', title: 'SVG Optimizer', category: 'svg', icon: Shapes, status: 'soon', description: 'Optimize and shrink SVG files.', keywords: ['svg', 'optimize', 'svgo'] },
  { slug: 'svg-viewer', href: '/tools/svg-viewer', title: 'SVG Viewer', category: 'svg', icon: Shapes, status: 'soon', description: 'Preview raw SVG markup.', keywords: ['svg', 'viewer', 'preview'] },
  { slug: 'svg-to-react', href: '/tools/svg-to-react', title: 'SVG → React', category: 'svg', icon: FileCode, status: 'soon', description: 'Convert SVG to a React component.', keywords: ['svg', 'react', 'component'] },
  { slug: 'svg-to-jsx', href: '/tools/svg-to-jsx', title: 'SVG → JSX', category: 'svg', icon: FileCode, status: 'soon', description: 'Convert SVG to JSX.', keywords: ['svg', 'jsx', 'convert'] },
  { slug: 'svg-color-editor', href: '/tools/svg-color-editor', title: 'SVG Color Editor', category: 'svg', icon: Palette, status: 'soon', description: 'Recolor SVG paths.', keywords: ['svg', 'color', 'edit'] },

  // ---- Colors ----
  { slug: 'hex-rgb', href: '/tools/hex-rgb', title: 'HEX ↔ RGB Converter', category: 'colors', icon: Palette, status: 'ready', addedAt: READY, description: 'Convert colors between HEX, RGB and HSL.', keywords: ['color', 'hex', 'rgb', 'hsl', 'convert'], aliases: ['color converter'] },
  { slug: 'color-picker', href: '/tools/color-picker', title: 'Color Picker', category: 'colors', icon: Palette, status: 'ready', addedAt: READY, description: 'Pick colors and copy HEX, RGB and HSL values.', keywords: ['color', 'picker', 'eyedropper', 'hex', 'rgb'] },
  { slug: 'gradient-generator', href: '/tools/gradient-generator', title: 'Gradient Generator', category: 'colors', icon: Palette, status: 'ready', addedAt: READY, popular: true, description: 'Create CSS linear and radial gradients visually.', keywords: ['gradient', 'css', 'linear', 'radial', 'background'] },
  { slug: 'tailwind-palette', href: '/tools/tailwind-palette', title: 'Tailwind Palette Generator', category: 'colors', icon: Palette, status: 'ready', addedAt: READY, description: 'Generate a Tailwind color scale from one color.', keywords: ['tailwind', 'palette', 'color', 'scale', 'shades'] },
  { slug: 'contrast-checker', href: '/tools/contrast-checker', title: 'Contrast Checker (WCAG)', category: 'colors', icon: Palette, status: 'ready', addedAt: READY, description: 'Check color contrast ratios against WCAG AA and AAA.', keywords: ['contrast', 'wcag', 'accessibility', 'a11y', 'ratio'] },

  // ---- SEO ----
  { slug: 'metadata-generator', href: '/tools/metadata-generator', title: 'Metadata Generator', category: 'seo', icon: Search, status: 'ready', addedAt: READY, popular: true, description: 'Generate meta, Open Graph and Twitter card tags.', keywords: ['seo', 'meta', 'open graph', 'twitter', 'tags'] },
  { slug: 'robots-generator', href: '/tools/robots-generator', title: 'robots.txt Generator', category: 'seo', icon: Search, status: 'ready', addedAt: READY, description: 'Generate a robots.txt file.', keywords: ['robots', 'seo', 'crawl', 'txt'] },
  { slug: 'sitemap-generator', href: '/tools/sitemap-generator', title: 'sitemap.xml Generator', category: 'seo', icon: Search, status: 'ready', addedAt: READY, description: 'Generate a sitemap.xml from a list of URLs.', keywords: ['sitemap', 'seo', 'xml'] },
  { slug: 'slug-generator', href: '/tools/slug-generator', title: 'Slug Generator', category: 'seo', icon: Search, status: 'ready', addedAt: READY, description: 'Turn any text into a clean, URL-safe slug.', keywords: ['slug', 'url', 'seo', 'permalink', 'kebab'] },

  // ---- Git ----
  { slug: 'conventional-commit', href: '/tools/conventional-commit', title: 'Conventional Commit Generator', category: 'git', icon: GitBranch, status: 'ready', addedAt: READY, description: 'Build conventional commit messages.', keywords: ['git', 'commit', 'conventional', 'message'] },
  { slug: 'gitignore-generator', href: '/tools/gitignore-generator', title: '.gitignore Generator', category: 'git', icon: GitBranch, status: 'ready', addedAt: READY, description: 'Generate .gitignore files from templates.', keywords: ['git', 'gitignore', 'ignore', 'template'] },

  // ---- Utilities ----
  { slug: 'password-generator', href: '/tools/password-generator', title: 'Password Generator', category: 'utilities', icon: Lock, status: 'ready', popular: true, addedAt: READY, description: 'Generate strong, random passwords locally.', keywords: ['password', 'random', 'secure', 'generate'], aliases: ['pwgen'] },
  { slug: 'unix-timestamp', href: '/tools/unix-timestamp', title: 'Unix Timestamp Converter', category: 'utilities', icon: Clock, status: 'ready', addedAt: READY, description: 'Convert between Unix timestamps and dates.', keywords: ['unix', 'timestamp', 'epoch', 'date', 'time'], aliases: ['epoch converter'] },
  { slug: 'password-strength', href: '/tools/password-strength', title: 'Password Strength Checker', category: 'utilities', icon: ShieldCheck, status: 'ready', addedAt: READY, description: 'Estimate password strength and crack time.', keywords: ['password', 'strength', 'entropy', 'crack'] },
  { slug: 'random-string', href: '/tools/random-string', title: 'Random String Generator', category: 'utilities', icon: Wrench, status: 'ready', addedAt: READY, description: 'Generate random strings, tokens and hex.', keywords: ['random', 'string', 'token', 'hex', 'nonce'] },
  { slug: 'qr-generator', href: '/tools/qr-generator', title: 'QR Generator', category: 'utilities', icon: QrCode, status: 'ready', addedAt: READY, popular: true, description: 'Generate downloadable QR codes from text or URLs.', keywords: ['qr', 'code', 'generate', 'url', 'png'] },
  { slug: 'qr-reader', href: '/tools/qr-reader', title: 'QR Reader', category: 'utilities', icon: QrCode, status: 'ready', addedAt: READY, description: 'Decode QR codes from an image.', keywords: ['qr', 'code', 'read', 'scan', 'decode'] },
]

export const TOOL_MAP: Record<string, ToolMeta> = Object.fromEntries(
  TOOLS.map((t) => [t.slug, t]),
)

export function getTool(slug: string): ToolMeta | undefined {
  return TOOL_MAP[slug]
}

export function toolsByCategory(id: ToolCategoryId): ToolMeta[] {
  return TOOLS.filter((t) => t.category === id)
}

export function readyTools(): ToolMeta[] {
  return TOOLS.filter((t) => t.status === 'ready')
}

export function popularTools(): ToolMeta[] {
  return TOOLS.filter((t) => t.popular)
}

export function recentTools(limit = 6): ToolMeta[] {
  return [...TOOLS]
    .filter((t) => t.addedAt)
    .sort((a, b) => (b.addedAt! > a.addedAt! ? 1 : -1))
    .slice(0, limit)
}

/** Lightweight relevance search over name/keyword/alias/category. */
export function searchTools(query: string): ToolMeta[] {
  const q = query.trim().toLowerCase()
  if (!q) return TOOLS
  const terms = q.split(/\s+/)

  const scored = TOOLS.map((tool) => {
    const haystackTitle = tool.title.toLowerCase()
    const haystackRest = [
      tool.description,
      tool.category,
      ...(tool.keywords ?? []),
      ...(tool.aliases ?? []),
    ]
      .join(' ')
      .toLowerCase()

    let score = 0
    for (const term of terms) {
      if (haystackTitle.startsWith(term)) score += 6
      else if (haystackTitle.includes(term)) score += 4
      else if (haystackRest.includes(term)) score += 2
      else return { tool, score: -1 }
    }
    return { tool, score }
  })

  return scored
    .filter((s) => s.score >= 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.tool)
}
