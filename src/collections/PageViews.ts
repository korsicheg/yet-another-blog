import type { CollectionConfig } from 'payload'

export const PageViews: CollectionConfig = {
  slug: 'page-views',
  admin: {
    group: 'Analytics',
    defaultColumns: ['path', 'collectionType', 'country', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => !!user,
    create: () => true,
    update: () => false,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'path',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'collectionType',
      type: 'select',
      options: [
        { label: 'Post', value: 'post' },
        { label: 'Video', value: 'video' },
        { label: 'Page', value: 'page' },
      ],
      required: true,
      index: true,
    },
    {
      name: 'documentId',
      type: 'number',
      admin: {
        description: 'ID of the related post or video, if applicable',
      },
    },
    {
      name: 'visitorId',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'country',
      type: 'text',
      index: true,
      admin: {
        description: 'ISO country code from Vercel geo headers',
      },
    },
    {
      name: 'userAgent',
      type: 'text',
    },
    {
      name: 'referrer',
      type: 'text',
    },
  ],
}
