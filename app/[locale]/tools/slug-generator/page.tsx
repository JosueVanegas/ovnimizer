import { SlugGenerator } from '@/components/tools/impl/SlugGenerator'
import { makeToolMetadata, makeToolPage } from '@/lib/tools/page-factory'

export const generateMetadata = makeToolMetadata('slug-generator')
export default makeToolPage('slug-generator', SlugGenerator)
