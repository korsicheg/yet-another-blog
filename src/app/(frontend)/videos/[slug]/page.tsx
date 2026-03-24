import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { LikeButton } from '@/components/LikeButton'
import { CommentsSection } from '@/components/CommentsSection'

type Props = {
  params: Promise<{ slug: string }>
}

function getEmbedUrl(videoUrl: string, platform: string | null | undefined): string {
  if (platform === 'youtube') {
    const match = videoUrl.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
    return match ? `https://www.youtube.com/embed/${match[1]}` : videoUrl
  }
  if (platform === 'vimeo') {
    const match = videoUrl.match(/vimeo\.com\/(\d+)/)
    return match ? `https://player.vimeo.com/video/${match[1]}` : videoUrl
  }
  return videoUrl
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'videos',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    limit: 1,
  })
  const video = docs[0]
  if (!video) return {}
  return {
    title: video.title,
    description: video.description || undefined,
  }
}

export const dynamic = 'force-dynamic'

export default async function VideoPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'videos',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    limit: 1,
  })

  const video = docs[0]
  if (!video) notFound()

  const embedUrl = getEmbedUrl(video.videoUrl, video.platform)

  const comments = await payload.find({
    collection: 'comments',
    where: {
      'relatedDoc.value': { equals: video.id },
      'relatedDoc.relationTo': { equals: 'videos' },
      approved: { equals: true },
    },
    sort: '-createdAt',
    limit: 20,
  })

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">{video.title}</h1>
      <div className="flex gap-4 text-sm text-gray-500 mb-6">
        {video.publishedDate && (
          <time>{new Date(video.publishedDate).toLocaleDateString()}</time>
        )}
        <span>{video.likes ?? 0} likes</span>
      </div>

      <div className="aspect-video mb-6">
        <iframe
          src={embedUrl}
          className="w-full h-full rounded-lg"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          title={video.title}
        />
      </div>

      {video.description && (
        <p className="text-gray-700 mb-6 whitespace-pre-line">{video.description}</p>
      )}

      <LikeButton collection="videos" docId={String(video.id)} initialLikes={video.likes ?? 0} />

      <CommentsSection
        collection="videos"
        docId={String(video.id)}
        totalComments={comments.totalDocs}
        initialComments={comments.docs.map((c) => ({
          id: String(c.id),
          authorName: c.authorName,
          content: c.content,
          createdAt: c.createdAt,
        }))}
      />
    </div>
  )
}
