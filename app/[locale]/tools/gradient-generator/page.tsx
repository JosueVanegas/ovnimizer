import { GradientGenerator } from '@/components/tools/impl/GradientGenerator'
import { makeToolMetadata, makeToolPage } from '@/lib/tools/page-factory'

export const generateMetadata = makeToolMetadata('gradient-generator')
export default makeToolPage('gradient-generator', GradientGenerator)
