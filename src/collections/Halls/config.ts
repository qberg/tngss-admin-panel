import type { CollectionConfig } from 'payload'
import { eventManager } from '../Users/access/eventManager'
import { anyone } from '../Users/access/anyone'
import { slugField } from '@/fields/slug'

export const Halls: CollectionConfig = {
  slug: 'halls',
  labels: {
    singular: 'Hall',
    plural: 'Halls',
  },
  admin: {
    group: 'Venue Management',
    useAsTitle: 'name',
  },
  access: {
    create: eventManager,
    read: anyone,
    update: eventManager,
    delete: eventManager,
  },
  fields: [
    {
      name: 'venue',
      type: 'relationship',
      relationTo: 'venues',
      required: true,
      hasMany: false,
      label: 'Venue which the Hall belongs to',
    },
    {
      name: 'name',
      type: 'text',
      label: 'Name of the Hall',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Hall Photo',
    },
    slugField,
    {
      name: 'zones_count',
      type: 'number',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Number of zones in this hall',
      },
      label: 'Zones Count',
      hooks: {
        beforeChange: [
          async ({ req, data }) => {
            if (data?.id) {
              const count = await req.payload.count({
                collection: 'zones',
                where: {
                  hall: { equals: data.id },
                },
              })

              return count.totalDocs
            }
            return 0
          },
        ],
      },
    },

    {
      name: 'zones',
      type: 'join',
      collection: 'zones',
      on: 'hall',
    },
  ],
}
