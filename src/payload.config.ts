import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`${name} environment variable is required`)
  return value
}

import { Users } from './collections/Users'
import { Posts } from './collections/Posts'
import { Videos } from './collections/Videos'
import { Media } from './collections/Media'
import { Comments } from './collections/Comments'
import { PageViews } from './collections/PageViews'
import { About } from './globals/About'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    dashboard: {
      widgets: [
        {
          slug: 'analytics-summary',
          Component: './components/analytics/AnalyticsSummaryWidget#default',
          minWidth: 'small',
          maxWidth: 'medium',
        },
        {
          slug: 'views-chart',
          Component: './components/analytics/ViewsChartWidget#default',
          minWidth: 'medium',
          maxWidth: 'full',
        },
        {
          slug: 'top-pages',
          Component: './components/analytics/TopPagesWidget#default',
          minWidth: 'small',
          maxWidth: 'medium',
        },
        {
          slug: 'top-countries',
          Component: './components/analytics/TopCountriesWidget#default',
          minWidth: 'small',
          maxWidth: 'medium',
        },
      ],
    },
  },
  collections: [Users, Posts, Videos, Media, Comments, PageViews],
  globals: [About],
  editor: lexicalEditor(),
  secret: requireEnv('PAYLOAD_SECRET'),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: requireEnv('DATABASE_URI'),
    },
  }),
  sharp,
  plugins: [
    ...(process.env.BLOB_READ_WRITE_TOKEN
      ? [
          vercelBlobStorage({
            collections: {
              media: true,
            },
            token: process.env.BLOB_READ_WRITE_TOKEN,
          }),
        ]
      : []),
  ],
})
