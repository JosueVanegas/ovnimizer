import { RemoveDuplicateLines } from '@/components/tools/impl/RemoveDuplicateLines'
import { makeToolMetadata, makeToolPage } from '@/lib/tools/page-factory'

export const generateMetadata = makeToolMetadata('remove-duplicate-lines')
export default makeToolPage('remove-duplicate-lines', RemoveDuplicateLines)
