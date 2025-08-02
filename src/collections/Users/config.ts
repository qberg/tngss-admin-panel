import type { CollectionConfig } from 'payload'
import { protectRoles } from './hooks/protectRoles'
import { admin, adminFieldAccess } from './access/admin'
import { eventManager } from './access/eventManager'
import { user } from './access/user'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Admin Panel User',
    plural: 'Admin Panel Users',
  },
  admin: {
    useAsTitle: 'email',
    group: 'User Management',
    defaultColumns: ['name', 'email', 'roles', 'status', 'lastLogin'],
    description: 'Manage admin panel users and their permissions',
  },
  auth: {
    verify: false,
    maxLoginAttempts: 5,
    lockTime: 600000,
  },
  access: {
    create: eventManager,
    read: user,
    update: user,
    delete: admin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        placeholder: 'Enter your name',
      },
    },
    {
      name: 'roles',
      type: 'select',
      required: true,
      saveToJWT: true,
      hasMany: true,
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Event Manager',
          value: 'event-manager',
        },
        {
          label: 'Content Manager',
          value: 'content-manager',
        },
        {
          label: 'User',
          value: 'user',
        },
      ],
      hooks: {
        beforeChange: [protectRoles],
      },
      admin: {
        position: 'sidebar',
        description:
          'Admin: Full system access, Event Manager: Manage events and attendees (can create content managers), Content Manager: Manage content of website (cannot create users)',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      access: {
        update: adminFieldAccess,
      },
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Suspended', value: 'suspended' },
      ],
      admin: {
        description: 'Suspended users cannot log in to the admin panel',
        position: 'sidebar',
      },
    },
    {
      name: 'lastLogin',
      type: 'date',
      admin: {
        readOnly: true,
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'Last successful login to admin panel',
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ req }) => {
            if (req.user) {
              return new Date()
            }
          },
        ],
      },
    },
  ],
}
