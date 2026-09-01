import { TextStats } from '@/components/tools/impl/TextStats'
import { makeToolMetadata, makeToolPage } from '@/lib/tools/page-factory'

export const generateMetadata = makeToolMetadata('word-counter')
export default makeToolPage('word-counter', TextStats)
