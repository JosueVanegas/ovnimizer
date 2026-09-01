import { RobotsGenerator } from '@/components/tools/impl/RobotsGenerator'
import { makeToolMetadata, makeToolPage } from '@/lib/tools/page-factory'

export const generateMetadata = makeToolMetadata('robots-generator')
export default makeToolPage('robots-generator', RobotsGenerator)
