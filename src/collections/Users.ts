import type { Access, CollectionConfig } from 'payload'

const isSelf: Access = ({ req }) => {
  if (req.user?.collection !== 'users') return false
  return { id: { equals: req.user.id } }
}

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    hidden: true,
    useAsTitle: 'name',
  },
  auth: { disableLocalStrategy: true },
  access: {
    create: () => false,
    delete: isSelf,
    read: isSelf,
    update: isSelf,
  },
  fields: [
    { name: 'identityKey', type: 'text', required: true, unique: true, index: true },
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email' },
    { name: 'mobile', type: 'text' },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'player',
      options: ['player', 'venue', 'trainer', 'organizer'],
    },
    {
      name: 'provider',
      type: 'select',
      required: true,
      options: ['google', 'facebook', 'otp'],
    },
    { name: 'providerId', type: 'text', index: true },
    { name: 'avatar', type: 'text' },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: ['active', 'suspended'],
    },
  ],
  versions: false,
}
