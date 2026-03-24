'use client'

import { useState, useEffect } from 'react'

export function LikeButton({
  collection,
  docId,
  initialLikes,
}: {
  collection: 'posts' | 'videos'
  docId: string
  initialLikes: number
}) {
  const storageKey = `liked_${collection}_${docId}`
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(initialLikes)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLiked(localStorage.getItem(storageKey) === 'true')
  }, [storageKey])

  const handleLike = async () => {
    if (liked || loading) return
    setLoading(true)

    try {
      const res = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collection, id: docId }),
      })

      if (res.ok) {
        setLikes((prev) => prev + 1)
        setLiked(true)
        localStorage.setItem(storageKey, 'true')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={liked || loading}
      className="flex items-center gap-2 mt-8 px-5 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-sm min-h-[44px]"
    >
      <span className="text-lg">{liked ? '\u2665' : '\u2661'}</span>
      <span>{likes}</span>
    </button>
  )
}
