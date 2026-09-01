import { ClampGenerator } from '@/components/tools/impl/ClampGenerator'
import { makeToolMetadata, makeToolPage } from '@/lib/tools/page-factory'

export const generateMetadata = makeToolMetadata('clamp-generator')
export default makeToolPage('clamp-generator', ClampGenerator)
