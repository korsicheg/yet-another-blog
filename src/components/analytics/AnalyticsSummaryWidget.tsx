import type { WidgetServerProps } from 'payload'
import { getAnalyticsSummary, getDailyViews } from '@/lib/analytics-queries'
import { Sparkline } from './Sparkline.client'

export default async function AnalyticsSummaryWidget({ req }: WidgetServerProps) {
  const summary7 = await getAnalyticsSummary(req.payload, 7)
  const summary30 = await getAnalyticsSummary(req.payload, 30)
  const daily7 = await getDailyViews(req.payload, 7)

  const viewsData = daily7.map((d) => ({ value: d.views }))
  const visitorsData = daily7.map((d) => ({ value: d.uniqueVisitors }))

  return (
    <div className="card" style={{ padding: '1rem', minHeight: 180 }}>
      <h4 style={{ margin: '0 0 1rem', fontSize: '1.1rem', fontWeight: 600 }}>
        Analytics Overview
      </h4>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>
            Last 7 Days
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{summary7.totalViews}</div>
          <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.5rem' }}>
            {summary7.uniqueVisitors} unique visitors
          </div>
          <Sparkline data={viewsData} color="#3b82f6" />
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>
            Last 30 Days
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{summary30.totalViews}</div>
          <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.5rem' }}>
            {summary30.uniqueVisitors} unique visitors
          </div>
          <Sparkline data={visitorsData} color="#10b981" />
        </div>
      </div>
    </div>
  )
}
