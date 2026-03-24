import type { WidgetServerProps } from 'payload'
import { getAnalyticsSummary } from '@/lib/analytics-queries'

export default async function AnalyticsSummaryWidget({ req }: WidgetServerProps) {
  const summary7 = await getAnalyticsSummary(req.payload, 7)
  const summary30 = await getAnalyticsSummary(req.payload, 30)

  return (
    <div className="card" style={{ padding: '1rem' }}>
      <h4 style={{ margin: '0 0 1rem', fontSize: '1.1rem', fontWeight: 600 }}>
        Analytics Overview
      </h4>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>
            Last 7 Days
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{summary7.totalViews}</div>
          <div style={{ fontSize: '0.85rem', color: '#888' }}>
            {summary7.uniqueVisitors} unique visitors
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>
            Last 30 Days
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{summary30.totalViews}</div>
          <div style={{ fontSize: '0.85rem', color: '#888' }}>
            {summary30.uniqueVisitors} unique visitors
          </div>
        </div>
      </div>
    </div>
  )
}
