import { UnixTimestamp } from '@/components/tools/impl/UnixTimestamp'
import { makeToolMetadata, makeToolPage } from '@/lib/tools/page-factory'

export const generateMetadata = makeToolMetadata('unix-timestamp')
export default makeToolPage('unix-timestamp', UnixTimestamp)
