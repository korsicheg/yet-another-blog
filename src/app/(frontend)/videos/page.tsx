import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import Image from 'next/image'
import { getThumbnailUrl } from '@/lib/video'

export const dynamic = 'force-dynamic'

export default async function VideosPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageParam } = await searchParams
  const currentPage = Number(pageParam) || 1

  const payload = await getPayload({ config })
  const videos = await payload.find({
    collection: 'videos',
    where: { status: { equals: 'published' } },
    sort: '-publishedDate',
    limit: 12,
    page: currentPage,
  })

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Videos</h1>
      {videos.docs.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No videos yet. Check back soon!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {videos.docs.map((video) => {
            const thumbnail = getThumbnailUrl(video.videoUrl, video.platform)

            return (
              <Link
                key={video.id}
                href={`/videos/${video.slug}`}
                className="group block"
              >
                <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-3">
                  {thumbnail ? (
                    <Image
                      src={thumbnail}
                      alt={video.title}
                      width={768}
                      height={432}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 448px"
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                      Video
                    </div>
                  )}
                </div>
                <h2 className="font-semibold group-hover:underline">{video.title}</h2>
                <div className="flex gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {video.publishedDate && (
                    <span>{new Date(video.publishedDate).toLocaleDateString()}</span>
                  )}
                  <span>{video.likes ?? 0} likes</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {(videos.hasPrevPage || videos.hasNextPage) && (
        <div className="flex gap-4 justify-center mt-8">
          {videos.hasPrevPage && (
            <Link
              href={`/videos?page=${videos.prevPage}`}
              className="px-5 py-3 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800 text-sm min-h-[44px] flex items-center"
            >
              Previous
            </Link>
          )}
          {videos.hasNextPage && (
            <Link
              href={`/videos?page=${videos.nextPage}`}
              className="px-5 py-3 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800 text-sm min-h-[44px] flex items-center"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
