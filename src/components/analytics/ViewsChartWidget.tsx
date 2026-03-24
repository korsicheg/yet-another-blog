import { getDailyViews } from '@/lib/analytics-queries'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ViewsChart } from './ViewsChart.client'

export default async function ViewsChartWidget() {
  const payload = await getPayload({ config })
  const dailyViews = await getDailyViews(payload, 30)

  return (
    <div style={{ padding: '1rem' }}>
      <h4 style={{ margin: '0 0 1rem', fontSize: '1.1rem', fontWeight: 600 }}>
        Views Over Time (30 Days)
      </h4>
      <ViewsChart data={dailyViews} />
    </div>
  )
}
