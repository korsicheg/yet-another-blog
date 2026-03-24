import { getTopPages } from '@/lib/analytics-queries'
import { getPayload } from 'payload'
import config from '@payload-config'

export default async function TopPagesWidget() {
  const payload = await getPayload({ config })
  const topPages = await getTopPages(payload, 30, 10)

  return (
    <div style={{ padding: '1rem' }}>
      <h4 style={{ margin: '0 0 1rem', fontSize: '1.1rem', fontWeight: 600 }}>
        Top Pages (30 Days)
      </h4>
      {topPages.length === 0 ? (
        <p style={{ color: '#888', fontSize: '0.85rem' }}>No data yet</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '0.5rem 0', borderBottom: '1px solid #e5e7eb' }}>
                Page
              </th>
              <th style={{ textAlign: 'right', padding: '0.5rem 0', borderBottom: '1px solid #e5e7eb' }}>
                Views
              </th>
            </tr>
          </thead>
          <tbody>
            {topPages.map((page) => (
              <tr key={page.path}>
                <td style={{ padding: '0.4rem 0', borderBottom: '1px solid #f3f4f6' }}>
                  {page.path}
                </td>
                <td style={{ textAlign: 'right', padding: '0.4rem 0', borderBottom: '1px solid #f3f4f6', fontWeight: 600 }}>
                  {page.views}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
