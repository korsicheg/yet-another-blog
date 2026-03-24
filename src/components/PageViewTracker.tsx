'use client'

import { useEffect } from 'react'

export function PageViewTracker({
  path,
  collectionType,
  documentId,
}: {
  path: string
  collectionType: 'post' | 'video' | 'page'
  documentId?: string
}) {
  useEffect(() => {
    const storageKey = `viewed_${path}`
    if (sessionStorage.getItem(storageKey)) return
    sessionStorage.setItem(storageKey, '1')

    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, collectionType, documentId }),
    }).catch(() => {})
  }, [path, collectionType, documentId])

  return null
}
