import { getTopCountries } from '@/lib/analytics-queries'
import { getPayload } from 'payload'
import config from '@payload-config'

export default async function TopCountriesWidget() {
  const payload = await getPayload({ config })
  const topCountries = await getTopCountries(payload, 30, 10)

  return (
    <div style={{ padding: '1rem' }}>
      <h4 style={{ margin: '0 0 1rem', fontSize: '1.1rem', fontWeight: 600 }}>
        Top Countries (30 Days)
      </h4>
      {topCountries.length === 0 ? (
        <p style={{ color: '#888', fontSize: '0.85rem' }}>No data yet</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '0.5rem 0', borderBottom: '1px solid #e5e7eb' }}>
                Country
              </th>
              <th style={{ textAlign: 'right', padding: '0.5rem 0', borderBottom: '1px solid #e5e7eb' }}>
                Visitors
              </th>
            </tr>
          </thead>
          <tbody>
            {topCountries.map((row) => (
              <tr key={row.country}>
                <td style={{ padding: '0.4rem 0', borderBottom: '1px solid #f3f4f6' }}>
                  {row.country}
                </td>
                <td style={{ textAlign: 'right', padding: '0.4rem 0', borderBottom: '1px solid #f3f4f6', fontWeight: 600 }}>
                  {row.visitors}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
