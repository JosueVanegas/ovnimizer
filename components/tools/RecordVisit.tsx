'use client'

import { useEffect } from 'react'
import { recordRecent } from '@/lib/tools/storage'

/** Records a tool visit in localStorage on mount. Renders nothing. */
export function RecordVisit({ slug }: { slug: string }) {
  useEffect(() => {
    recordRecent(slug)
  }, [slug])
  return null
}
