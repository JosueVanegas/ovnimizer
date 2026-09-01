import { TextStats } from '@/components/tools/impl/TextStats'
import { makeToolMetadata, makeToolPage } from '@/lib/tools/page-factory'

export const generateMetadata = makeToolMetadata('character-counter')
export default makeToolPage('character-counter', TextStats)
