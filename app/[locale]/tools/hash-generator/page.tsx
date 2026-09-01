import { HashGenerator } from '@/components/tools/impl/HashGenerator'
import { makeToolMetadata, makeToolPage } from '@/lib/tools/page-factory'

export const generateMetadata = makeToolMetadata('hash-generator')
export default makeToolPage('hash-generator', HashGenerator)
