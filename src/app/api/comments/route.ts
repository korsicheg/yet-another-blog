import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { validateOrigin, forbiddenResponse } from '@/lib/security'

export async function POST(req: NextRequest) {
  try {
    if (!validateOrigin(req)) {
      return forbiddenResponse()
    }

    const { authorName, content, collection, docId } = await req.json()

    if (!authorName || !content || !collection || !docId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!['posts', 'videos'].includes(collection)) {
      return NextResponse.json({ error: 'Invalid collection' }, { status: 400 })
    }

    if (authorName.length > 100 || content.length > 2000) {
      return NextResponse.json({ error: 'Input too long' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    try {
      await payload.findByID({ collection, id: docId, depth: 0 })
    } catch {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    await payload.create({
      collection: 'comments',
      data: {
        authorName,
        content,
        relatedDoc: {
          relationTo: collection,
          value: Number(docId),
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Comment submitted for moderation',
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
