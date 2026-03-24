import { getPayload } from 'payload'
import config from '@payload-config'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'
import type { Metadata } from 'next'
import type { Media as MediaType } from '@/payload-types'

export const metadata: Metadata = {
  title: 'About',
}

export const dynamic = 'force-dynamic'

export default async function AboutPage() {
  const payload = await getPayload({ config })
  const about = await payload.findGlobal({
    slug: 'about',
    depth: 1,
  })

  const image = about.profileImage as MediaType | undefined

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">{about.heading || 'About Me'}</h1>

      {image?.url && (
        <Image
          src={image.url}
          alt={image.alt || 'Profile'}
          width={300}
          height={300}
          sizes="(max-width: 640px) 150px, 300px"
          priority
          className="rounded-full mb-8 w-[150px] h-[150px] sm:w-[300px] sm:h-[300px]"
        />
      )}

      {about.content && (
        <div className="prose prose-sm sm:prose-base prose-gray dark:prose-invert max-w-none">
          <RichText data={about.content} />
        </div>
      )}
    </div>
  )
}
