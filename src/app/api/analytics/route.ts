import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { validateOrigin, forbiddenResponse } from '@/lib/security'
import { hashVisitorId, getClientIp, getCountry } from '@/lib/analytics'

export async function POST(req: NextRequest) {
  try {
    if (!validateOrigin(req)) {
      return forbiddenResponse()
    }

    const { path, collectionType, documentId } = await req.json()

    if (!path || typeof path !== 'string' || path.length > 500) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
    }

    if (!collectionType || !['post', 'video', 'page'].includes(collectionType)) {
      return NextResponse.json({ error: 'Invalid collectionType' }, { status: 400 })
    }

    const ip = getClientIp(req)
    const userAgent = req.headers.get('user-agent') || ''
    const referrer = req.headers.get('referer') || ''
    const country = getCountry(req)
    const visitorId = hashVisitorId(ip, userAgent)

    const payload = await getPayload({ config })

    await payload.create({
      collection: 'page-views',
      data: {
        path,
        collectionType,
        documentId: documentId ? Number(documentId) : undefined,
        visitorId,
        country,
        userAgent: userAgent.slice(0, 500),
        referrer: referrer.slice(0, 1000),
      },
    })

    return NextResponse.json(
      { success: true },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
