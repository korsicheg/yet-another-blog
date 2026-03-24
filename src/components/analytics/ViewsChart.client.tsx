'use client'

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

type DailyViewData = {
  date: string
  views: number
  uniqueVisitors: number
}

export function ViewsChart({ data }: { data: DailyViewData[] }) {
  const formatted = data.map((d) => ({
    ...d,
    label: new Date(d.date + 'T00:00:00').toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    }),
  }))

  return (
    <div style={{ width: '100%', height: 250 }}>
      <ResponsiveContainer>
        <AreaChart data={formatted}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="views"
            stroke="#3b82f6"
            fill="#3b82f680"
            name="Views"
          />
          <Area
            type="monotone"
            dataKey="uniqueVisitors"
            stroke="#10b981"
            fill="#10b98180"
            name="Unique Visitors"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
