import type { CollectionConfig } from 'payload'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isAdmin = (user: any) =>
  !!user && user.role === 'admin'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  access: {
    read: ({ req: { user } }) => !!user,
    create: ({ req: { user } }) => isAdmin(user),
    update: ({ req: { user }, id }) => {
      if (!user) return false
      if (isAdmin(user)) return true
      return String(user.id) === String(id)
    },
    delete: ({ req: { user } }) => isAdmin(user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
      ],
      defaultValue: 'user',
      required: true,
      access: {
        update: ({ req: { user } }) => isAdmin(user),
      },
      admin: {
        position: 'sidebar',
        description: 'Only admins can change roles',
      },
    },
  ],
}
