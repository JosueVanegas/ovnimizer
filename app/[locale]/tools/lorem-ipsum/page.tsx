import { LoremIpsum } from '@/components/tools/impl/LoremIpsum'
import { makeToolMetadata, makeToolPage } from '@/lib/tools/page-factory'

export const generateMetadata = makeToolMetadata('lorem-ipsum')
export default makeToolPage('lorem-ipsum', LoremIpsum)
