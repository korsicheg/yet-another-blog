import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { validateOrigin, forbiddenResponse } from '@/lib/security'

export async function POST(req: NextRequest) {
  try {
    if (!validateOrigin(req)) {
      return forbiddenResponse()
    }

    const { collection, id } = await req.json()

    if (!['posts', 'videos'].includes(collection)) {
      return NextResponse.json({ error: 'Invalid collection' }, { status: 400 })
    }

    if (!id) {
      return NextResponse.json({ error: 'Missing document ID' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    const doc = await payload.findByID({
      collection,
      id: Number(id),
      depth: 0,
    })

    if (!doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    const newLikes = ((doc as Record<string, unknown>).likes as number || 0) + 1

    await payload.update({
      collection,
      id: Number(id),
      data: { likes: newLikes },
    })

    return NextResponse.json(
      { success: true, likes: newLikes },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
