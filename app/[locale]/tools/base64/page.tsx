import { Base64Tool } from '@/components/tools/impl/Base64Tool'
import { makeToolMetadata, makeToolPage } from '@/lib/tools/page-factory'

export const generateMetadata = makeToolMetadata('base64')
export default makeToolPage('base64', Base64Tool)
