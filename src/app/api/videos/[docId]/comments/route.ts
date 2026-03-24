import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import type { Where } from 'payload'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ docId: string }> },
) {
  const { docId } = await params
  const after = req.nextUrl.searchParams.get('after')

  const payload = await getPayload({ config })

  const where: Where = {
    'relatedDoc.value': { equals: Number(docId) },
    'relatedDoc.relationTo': { equals: 'videos' },
    approved: { equals: true },
    ...(after ? { createdAt: { less_than: after } } : {}),
  }

  const comments = await payload.find({
    collection: 'comments',
    where,
    sort: '-createdAt',
    limit: 20,
  })

  return NextResponse.json(
    {
      docs: comments.docs.map((c) => ({
        id: String(c.id),
        authorName: c.authorName,
        content: c.content,
        createdAt: c.createdAt,
      })),
      hasMore: comments.hasNextPage,
    },
    { headers: { 'Cache-Control': 'public, max-age=60' } },
  )
}
