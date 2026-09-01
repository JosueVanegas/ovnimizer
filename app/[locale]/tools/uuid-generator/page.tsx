import { UuidGenerator } from '@/components/tools/impl/UuidGenerator'
import { makeToolMetadata, makeToolPage } from '@/lib/tools/page-factory'

export const generateMetadata = makeToolMetadata('uuid-generator')
export default makeToolPage('uuid-generator', UuidGenerator)
