import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import Image from 'next/image'
import type { Media as MediaType } from '@/payload-types'

export const dynamic = 'force-dynamic'

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageParam } = await searchParams
  const currentPage = Number(pageParam) || 1

  const payload = await getPayload({ config })
  const posts = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    sort: '-publishedDate',
    limit: 10,
    page: currentPage,
    depth: 1,
  })

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      {posts.docs.length === 0 ? (
        <p className="text-gray-500">No posts yet. Check back soon!</p>
      ) : (
        <div className="space-y-8">
          {posts.docs.map((post) => {
            const image = post.featuredImage as MediaType | undefined

            return (
              <article key={post.id} className="border-b border-gray-100 pb-6">
                {image?.sizes?.blogCard?.url && (
                  <Link href={`/blog/${post.slug}`}>
                    <Image
                      src={image.sizes.blogCard.url}
                      alt={image.alt || post.title}
                      width={768}
                      height={320}
                      className="rounded-lg mb-4 w-full"
                    />
                  </Link>
                )}
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-2xl font-semibold hover:underline">{post.title}</h2>
                </Link>
                {post.excerpt && <p className="text-gray-600 mt-2">{post.excerpt}</p>}
                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                  {post.publishedDate && (
                    <span>{new Date(post.publishedDate).toLocaleDateString()}</span>
                  )}
                  <span>{post.likes ?? 0} likes</span>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {(posts.hasPrevPage || posts.hasNextPage) && (
        <div className="flex gap-4 justify-center mt-8">
          {posts.hasPrevPage && (
            <Link
              href={`/?page=${posts.prevPage}`}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm"
            >
              Previous
            </Link>
          )}
          {posts.hasNextPage && (
            <Link
              href={`/?page=${posts.nextPage}`}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
