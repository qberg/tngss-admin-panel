import { eventManagerFieldAccess } from '@/collections/Users/access/eventManager'
import type { Field } from 'payload'

export const auditFields: Field = {
  name: 'audit-log',
  type: 'group',
  label: 'Audit Logs',
  access: {
    read: eventManagerFieldAccess,
  },
  fields: [
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'User who created this content',
      },
      hooks: {
        beforeChange: [
          ({ req, operation, value }) => {
            // Only set on create, preserve existing value on update
            if (operation === 'create') {
              return req.user?.id || value
            }
            return value
          },
        ],
      },
    },

    {
      name: 'updatedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'User who last updated this content',
      },
      hooks: {
        beforeChange: [({ req }) => req.user?.id],
      },
    },

    {
      name: 'log',
      type: 'group',
      label: 'Audit Information',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'createdAt',
          type: 'date',
          admin: {
            readOnly: true,
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
          hooks: {
            beforeChange: [
              ({ operation, value }) => {
                if (operation === 'create') {
                  return new Date().toISOString()
                }
                return value
              },
            ],
          },
        },
        {
          name: 'updatedAt',
          type: 'date',
          admin: {
            readOnly: true,
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
          hooks: {
            beforeChange: [() => new Date().toISOString()],
          },
        },
        {
          name: 'version',
          type: 'number',
          admin: {
            readOnly: true,
            description: 'Document version number',
          },
          defaultValue: 1,
          hooks: {
            beforeChange: [
              ({ operation, value }) => {
                if (operation === 'create') {
                  return 1
                }
                return (value || 1) + 1
              },
            ],
          },
        },
      ],
    },
  ],
}
