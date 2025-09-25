import type { CollectionConfig } from 'payload'
import { admin } from '../Users/access/admin'
import { anyone } from '../Users/access/anyone'

export const AppVersions: CollectionConfig = {
  slug: 'app-versions',
  labels: {
    singular: 'App Version',
    plural: 'App Versions',
  },
  admin: {
    useAsTitle: 'version',
    group: 'App Management',
    defaultColumns: ['version', 'platform', 'updateType', 'isCurrentVersion'],
  },
  access: {
    create: () => false,
    read: anyone,
    update: admin,
    delete: admin,
  },
  fields: [
    {
      name: 'isCurrentVersion',
      type: 'checkbox',
      label: 'Current Version',
      defaultValue: false,
      admin: {
        width: '30%',
        position: 'sidebar',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'version',
          type: 'text',
          required: true,
          unique: true,
          label: 'IOS Version',
          admin: {
            width: '50%',
            placeholder: '1.2',
          },
        },
        {
          name: 'android_version',
          type: 'text',
          required: true,
          unique: true,
          defaultValue: '1.0',
          label: 'Android Version',
          admin: {
            width: '50%',
            placeholder: '1.2',
          },
        },
        {
          name: 'platform',
          type: 'select',
          required: true,
          defaultValue: 'universal',
          options: [
            { label: 'iOS', value: 'ios' },
            { label: 'Android', value: 'android' },
            { label: 'Both', value: 'universal' },
          ],
          admin: {
            width: '50%',
          },
        },
      ],
    },

    {
      type: 'row',
      fields: [
        {
          name: 'updateType',
          type: 'select',
          required: true,
          defaultValue: 'optional',
          options: [
            { label: 'Optional', value: 'optional' },
            { label: 'Recommended', value: 'recommended' },
            { label: 'Force Update', value: 'force' },
          ],
          admin: {
            width: '50%',
          },
        },
        {
          name: 'minimumSupportedVersion',
          type: 'text',
          label: 'Min Supported Version',
          admin: {
            width: '50%',
            placeholder: '1.0',
            description: 'Users below this version must update',
          },
        },
      ],
    },

    {
      name: 'releaseNotes',
      type: 'textarea',
      label: "What's New",
      admin: {
        rows: 3,
        placeholder: 'Bug fixes and performance improvements...',
      },
    },

    {
      type: 'row',
      fields: [
        {
          name: 'appStoreUrl',
          type: 'text',
          label: 'App Store URL',
          admin: {
            width: '50%',
            placeholder: 'https://apps.apple.com/app/...',
          },
        },
        {
          name: 'playStoreUrl',
          type: 'text',
          label: 'Play Store URL',
          admin: {
            width: '50%',
            placeholder: 'https://play.google.com/store/apps/details?id=...',
          },
        },
      ],
    },
  ],

  hooks: {
    beforeChange: [
      async ({ req, data, operation }) => {
        if (data.isCurrentVersion) {
          const existing = await req.payload.find({
            collection: 'app-versions',
            where: {
              and: [
                { platform: { equals: data.platform } },
                { isCurrentVersion: { equals: true } },
                ...(operation === 'update' && data.id ? [{ id: { not_equals: data.id } }] : []),
              ],
            },
          })

          for (const doc of existing.docs) {
            await req.payload.update({
              collection: 'app-versions',
              id: doc.id,
              data: { isCurrentVersion: false },
            })
          }
        }
        return data
      },
    ],
  },

  timestamps: true,
}
