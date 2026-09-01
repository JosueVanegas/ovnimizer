import { SortLines } from '@/components/tools/impl/SortLines'
import { makeToolMetadata, makeToolPage } from '@/lib/tools/page-factory'

export const generateMetadata = makeToolMetadata('sort-lines')
export default makeToolPage('sort-lines', SortLines)
