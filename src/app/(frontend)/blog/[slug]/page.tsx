import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'
import type { Metadata } from 'next'
import type { Media as MediaType } from '@/payload-types'
import { LikeButton } from '@/components/LikeButton'
import { CommentsSection } from '@/components/CommentsSection'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    limit: 1,
  })
  const post = docs[0]
  if (!post) return {}
  return {
    title: post.meta?.title || post.title,
    description: post.meta?.description || post.excerpt || undefined,
  }
}

export const dynamic = 'force-dynamic'

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    limit: 1,
    depth: 1,
  })

  const post = docs[0]
  if (!post) notFound()

  const comments = await payload.find({
    collection: 'comments',
    where: {
      'relatedDoc.value': { equals: post.id },
      'relatedDoc.relationTo': { equals: 'posts' },
      approved: { equals: true },
    },
    sort: '-createdAt',
    limit: 20,
  })

  const image = post.featuredImage as MediaType | undefined

  return (
    <article>
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
      <div className="flex gap-4 text-sm text-gray-500 mb-6">
        {post.publishedDate && (
          <time>{new Date(post.publishedDate).toLocaleDateString()}</time>
        )}
        <span>{post.likes ?? 0} likes</span>
      </div>

      {image?.url && (
        <Image
          src={image.url}
          alt={image.alt || post.title}
          width={1920}
          height={1080}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 768px, 896px"
          priority
          className="rounded-lg mb-8 w-full"
        />
      )}

      <div className="prose prose-sm sm:prose-base prose-gray max-w-none">
        {post.content && <RichText data={post.content} />}
      </div>

      <LikeButton collection="posts" docId={String(post.id)} initialLikes={post.likes ?? 0} />

      <CommentsSection
        collection="posts"
        docId={String(post.id)}
        totalComments={comments.totalDocs}
        initialComments={comments.docs.map((c) => ({
          id: String(c.id),
          authorName: c.authorName,
          content: c.content,
          createdAt: c.createdAt,
        }))}
      />
    </article>
  )
}
