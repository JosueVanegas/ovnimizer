import { ContrastChecker } from '@/components/tools/impl/ContrastChecker'
import { makeToolMetadata, makeToolPage } from '@/lib/tools/page-factory'

export const generateMetadata = makeToolMetadata('contrast-checker')
export default makeToolPage('contrast-checker', ContrastChecker)
