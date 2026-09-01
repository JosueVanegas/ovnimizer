import { TailwindPalette } from '@/components/tools/impl/TailwindPalette'
import { makeToolMetadata, makeToolPage } from '@/lib/tools/page-factory'

export const generateMetadata = makeToolMetadata('tailwind-palette')
export default makeToolPage('tailwind-palette', TailwindPalette)
