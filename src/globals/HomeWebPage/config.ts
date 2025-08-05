import { anyone } from '@/collections/Users/access/anyone'
import { contentManager } from '@/collections/Users/access/contentManager'
import type { GlobalConfig } from 'payload'

export const HomeWebPage: GlobalConfig = {
  slug: 'home-wp',

  label: 'Home',
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
              name: 'hero',
              type: 'group',
              fields: [
                {
                  name: 'location',
                  type: 'text',
                  label: 'Location',
                },
                {
                  name: 'dates',
                  type: 'text',
                  label: 'Dates',
                },
                {
                  name: 'bgVideo',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Background Video',
                },
              ],
            },
          ],
          label: 'Hero Section',
        },
        {
          fields: [],
          label: 'CM Section',
        },
        {
          fields: [],
          label: 'Stats Section',
        },
        {
          fields: [],
          label: 'Why Attend Section',
        },
        {
          fields: [],
          label: 'Speakers Ssection',
        },
        {
          fields: [],
          label: 'Showcase Section',
        },
        {
          fields: [],
          label: 'Past Engagements Section',
        },
        {
          fields: [],
          label: 'Key Highlights Section',
        },
      ],
    },
  ],
}
