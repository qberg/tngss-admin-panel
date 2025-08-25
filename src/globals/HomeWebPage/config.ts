import { anyone } from '@/collections/Users/access/anyone'
import { contentManager } from '@/collections/Users/access/contentManager'
import type { GlobalConfig } from 'payload'

export const HomeWebPage: GlobalConfig = {
  slug: 'home-wp',
  label: 'Home - Website',
  admin: {
    group: 'Website Pages',
  },
  access: {
    read: anyone,
    update: contentManager,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Title',
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Description',
            },
            {
              name: 'flags',
              type: 'array',
              label: 'Flags',
              fields: [
                {
                  name: 'country',
                  type: 'text',
                  label: 'Country',
                },
                {
                  name: 'flag',
                  type: 'upload',
                  relationTo: 'media',
                },
              ],
            },
          ],
          name: 'global_pavilion',
          label: 'Global Pavilion',
        },

        {
          name: 'featured_speakers',
          label: 'Featured Speakers',
          fields: [
            {
              type: 'array',
              name: 'speakers',
              fields: [
                {
                  name: 'speaker',
                  type: 'relationship',
                  relationTo: 'speakers',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
