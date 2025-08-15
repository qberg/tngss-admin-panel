import { anyone } from '@/collections/Users/access/anyone'
import { contentManager } from '@/collections/Users/access/contentManager'
import type { GlobalConfig } from 'payload'

export const FeaturedContentApp: GlobalConfig = {
  slug: 'featured-content-app',
  label: 'Featured Content - Mobile App',
  admin: {
    group: 'Mobile App Pages',
  },
  access: {
    read: anyone,
    update: contentManager,
  },
  fields: [
    {
      name: 'featured_events',
      type: 'array',
      label: 'Featured Events',
      minRows: 1,
      maxRows: 5,
      validate: (value) => {
        if (!value || !Array.isArray(value)) return true

        // @ts-expect-error payload
        const eventIds = value.map((item) => item.event).filter(Boolean)
        const uniqueIds = new Set(eventIds)

        if (eventIds.length !== uniqueIds.size) {
          return 'Each event can only be featured once. Please remove duplicate events.'
        }
        return true
      },
      fields: [
        {
          name: 'event',
          type: 'relationship',
          relationTo: 'events',
        },
      ],
    },

    {
      name: 'featured_speakers',
      type: 'array',
      label: 'Featured Speakers',
      minRows: 1,
      maxRows: 5,
      validate: (value) => {
        if (!value || !Array.isArray(value)) return true

        // @ts-expect-error payload
        const speakerIds = value.map((item) => item.event).filter(Boolean)
        const uniqueIds = new Set(speakerIds)

        if (speakerIds.length !== uniqueIds.size) {
          return 'Each event can only be featured once. Please remove duplicate events.'
        }
        return true
      },
      fields: [
        {
          name: 'speaker',
          type: 'relationship',
          relationTo: 'speakers',
        },
      ],
    },
  ],
}
