import { PasswordGenerator } from '@/components/tools/impl/PasswordGenerator'
import { makeToolMetadata, makeToolPage } from '@/lib/tools/page-factory'

export const generateMetadata = makeToolMetadata('password-generator')
export default makeToolPage('password-generator', PasswordGenerator)
