'use client'

import { useState } from 'react'

type Comment = {
  id: string
  authorName: string
  content: string
  createdAt: string
}

export function CommentsSection({
  collection,
  docId,
  totalComments,
  initialComments,
}: {
  collection: 'posts' | 'videos'
  docId: string
  totalComments: number
  initialComments: Comment[]
}) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [authorName, setAuthorName] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(initialComments.length < totalComments)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!authorName.trim() || !content.trim()) return

    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName: authorName.trim(),
          content: content.trim(),
          collection,
          docId,
        }),
      })

      if (res.ok) {
        setSubmitted(true)
        setAuthorName('')
        setContent('')
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to submit comment')
      }
    } catch {
      setError('Failed to submit comment. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleLoadMore = async () => {
    setLoadingMore(true)
    try {
      const lastComment = comments[comments.length - 1]
      const res = await fetch(
        `/api/${collection}/${docId}/comments?after=${lastComment?.createdAt || ''}`,
      )
      if (res.ok) {
        const data = await res.json()
        setComments((prev) => [...prev, ...data.docs])
        setHasMore(data.hasMore)
      }
    } catch {
      // silently fail — user can retry
    } finally {
      setLoadingMore(false)
    }
  }

  return (
    <section className="mt-8 sm:mt-12 border-t border-gray-200 dark:border-gray-800 pt-6 sm:pt-8">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Comments</h2>

      {comments.length > 0 ? (
        <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-100 dark:border-gray-800 pb-3 sm:pb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">{comment.authorName}</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-line">{comment.content}</p>
            </div>
          ))}

          {hasMore && (
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="w-full py-3 text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-60 transition-colors min-h-[44px]"
            >
              {loadingMore ? 'Loading...' : 'Load more comments'}
            </button>
          )}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 sm:mb-8">No comments yet. Be the first!</p>
      )}

      {submitted ? (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-sm text-green-800 dark:text-green-300">
          Thank you! Your comment has been submitted and is awaiting moderation.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Leave a comment</h3>
          <input
            type="text"
            placeholder="Your name"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            maxLength={100}
            required
            className="w-full px-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 min-h-[44px]"
          />
          <textarea
            placeholder="Your comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={2000}
            required
            rows={3}
            className="w-full px-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 resize-vertical"
          />
          {error && <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-60 disabled:cursor-not-allowed transition-colors min-h-[44px]"
          >
            {submitting ? 'Submitting...' : 'Submit Comment'}
          </button>
        </form>
      )}
    </section>
  )
}
