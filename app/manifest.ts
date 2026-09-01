import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Ovnimizer — Developer Toolbox',
    short_name: 'Ovnimizer',
    description:
      'Fast, privacy-first developer tools that run entirely in your browser. No uploads, no accounts.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#64ff17',
    categories: ['productivity', 'utilities', 'developer'],
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: '/icon-maskable.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
      { src: '/logo.png', sizes: '722x722', type: 'image/png', purpose: 'any' },
    ],
  }
}
