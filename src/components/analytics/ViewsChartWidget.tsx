import type { WidgetServerProps } from 'payload'
import { getDailyViews } from '@/lib/analytics-queries'
import { ViewsChart } from './ViewsChart.client'

export default async function ViewsChartWidget({ req }: WidgetServerProps) {
  const dailyViews = await getDailyViews(req.payload, 30)

  return (
    <div className="card" style={{ padding: '1rem' }}>
      <h4 style={{ margin: '0 0 1rem', fontSize: '1.1rem', fontWeight: 600 }}>
        Views Over Time (30 Days)
      </h4>
      <ViewsChart data={dailyViews} />
    </div>
  )
}
