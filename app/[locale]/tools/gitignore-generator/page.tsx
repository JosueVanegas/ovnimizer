import { GitignoreGenerator } from '@/components/tools/impl/GitignoreGenerator'
import { makeToolMetadata, makeToolPage } from '@/lib/tools/page-factory'

export const generateMetadata = makeToolMetadata('gitignore-generator')
export default makeToolPage('gitignore-generator', GitignoreGenerator)
