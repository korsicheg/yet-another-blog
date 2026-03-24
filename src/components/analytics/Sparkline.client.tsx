'use client'

import { ResponsiveContainer, AreaChart, Area } from 'recharts'

export function Sparkline({
  data,
  color,
}: {
  data: { value: number }[]
  color: string
}) {
  return (
    <div style={{ width: '100%', height: 61 }}>
      <ResponsiveContainer>
        <AreaChart data={data}>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            fill={color + '40'}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
