import type { CollectionConfig } from 'payload'

export const Comments: CollectionConfig = {
  slug: 'comments',
  admin: {
    useAsTitle: 'authorName',
    defaultColumns: ['authorName', 'approved', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return { approved: { equals: true } }
    },
    create: () => true,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'authorName',
      type: 'text',
      required: true,
      maxLength: 100,
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
      maxLength: 2000,
    },
    {
      name: 'relatedDoc',
      type: 'relationship',
      relationTo: ['posts', 'videos'],
      required: true,
      admin: {
        description: 'The post or video this comment belongs to',
      },
    },
    {
      name: 'approved',
      type: 'checkbox',
      defaultValue: false,
      access: {
        create: () => false,
        update: ({ req: { user } }) => !!user,
      },
      admin: {
        description: 'Comments must be approved before appearing publicly',
        position: 'sidebar',
      },
    },
  ],
}
