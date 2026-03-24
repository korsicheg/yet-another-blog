import { createHash } from 'crypto'

export function hashVisitorId(ip: string, userAgent: string): string {
  const daySalt = new Date().toISOString().slice(0, 10)
  return createHash('sha256')
    .update(`${ip}:${userAgent}:${daySalt}`)
    .digest('hex')
    .slice(0, 16)
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return req.headers.get('x-real-ip') || 'unknown'
}

export function getCountry(req: Request): string {
  return req.headers.get('x-vercel-ip-country') || 'Unknown'
}
