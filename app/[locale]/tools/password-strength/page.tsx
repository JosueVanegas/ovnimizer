import { PasswordStrength } from '@/components/tools/impl/PasswordStrength'
import { makeToolMetadata, makeToolPage } from '@/lib/tools/page-factory'

export const generateMetadata = makeToolMetadata('password-strength')
export default makeToolPage('password-strength', PasswordStrength)
