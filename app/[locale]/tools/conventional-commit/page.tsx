import { ConventionalCommit } from '@/components/tools/impl/ConventionalCommit'
import { makeToolMetadata, makeToolPage } from '@/lib/tools/page-factory'

export const generateMetadata = makeToolMetadata('conventional-commit')
export default makeToolPage('conventional-commit', ConventionalCommit)
