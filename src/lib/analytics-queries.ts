import type { Payload } from 'payload'

export type AnalyticsSummary = {
  totalViews: number
  uniqueVisitors: number
  period: string
}

export type DailyViewData = {
  date: string
  views: number
  uniqueVisitors: number
}

export type TopPage = {
  path: string
  views: number
}

export type TopCountry = {
  country: string
  visitors: number
}

export async function getAnalyticsSummary(
  payload: Payload,
  days: number = 30,
): Promise<AnalyticsSummary> {
  const since = new Date()
  since.setDate(since.getDate() - days)

  const result = await payload.find({
    collection: 'page-views',
    where: { createdAt: { greater_than: since.toISOString() } },
    limit: 0,
  })

  const allViews = await payload.find({
    collection: 'page-views',
    where: { createdAt: { greater_than: since.toISOString() } },
    limit: 10000,
    select: { visitorId: true },
  })

  const uniqueVisitors = new Set(allViews.docs.map((d) => d.visitorId)).size

  return {
    totalViews: result.totalDocs,
    uniqueVisitors,
    period: `Last ${days} days`,
  }
}

export async function getDailyViews(
  payload: Payload,
  days: number = 30,
): Promise<DailyViewData[]> {
  const since = new Date()
  since.setDate(since.getDate() - days)

  const allViews = await payload.find({
    collection: 'page-views',
    where: { createdAt: { greater_than: since.toISOString() } },
    limit: 10000,
    select: { createdAt: true, visitorId: true },
    sort: 'createdAt',
  })

  const byDate = new Map<string, { views: number; visitors: Set<string> }>()

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    byDate.set(key, { views: 0, visitors: new Set() })
  }

  for (const doc of allViews.docs) {
    const key = new Date(doc.createdAt).toISOString().slice(0, 10)
    const entry = byDate.get(key)
    if (entry) {
      entry.views++
      entry.visitors.add(doc.visitorId as string)
    }
  }

  return Array.from(byDate.entries()).map(([date, data]) => ({
    date,
    views: data.views,
    uniqueVisitors: data.visitors.size,
  }))
}

export async function getTopPages(
  payload: Payload,
  days: number = 30,
  limit: number = 10,
): Promise<TopPage[]> {
  const since = new Date()
  since.setDate(since.getDate() - days)

  const allViews = await payload.find({
    collection: 'page-views',
    where: { createdAt: { greater_than: since.toISOString() } },
    limit: 10000,
    select: { path: true },
  })

  const counts = new Map<string, number>()
  for (const doc of allViews.docs) {
    counts.set(doc.path as string, (counts.get(doc.path as string) || 0) + 1)
  }

  return Array.from(counts.entries())
    .map(([path, views]) => ({ path, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, limit)
}

export async function getTopCountries(
  payload: Payload,
  days: number = 30,
  limit: number = 10,
): Promise<TopCountry[]> {
  const since = new Date()
  since.setDate(since.getDate() - days)

  const allViews = await payload.find({
    collection: 'page-views',
    where: { createdAt: { greater_than: since.toISOString() } },
    limit: 10000,
    select: { country: true },
  })

  const counts = new Map<string, number>()
  for (const doc of allViews.docs) {
    const country = (doc.country as string) || 'Unknown'
    counts.set(country, (counts.get(country) || 0) + 1)
  }

  return Array.from(counts.entries())
    .map(([country, visitors]) => ({ country, visitors }))
    .sort((a, b) => b.visitors - a.visitors)
    .slice(0, limit)
}
