import type { CollectionConfig } from 'payload'
import { eventManager } from '../Users/access/eventManager'
import { anyone } from '../Users/access/anyone'
import { slugField } from '@/fields/slug'

export const Zones: CollectionConfig = {
  slug: 'zones',
  labels: {
    singular: 'Zone',
    plural: 'Zones',
  },
  access: {
    create: eventManager,
    read: anyone,
    update: eventManager,
    delete: eventManager,
  },
  admin: {
    useAsTitle: 'name',
    group: 'Venue Management',
  },
  fields: [
    {
      name: 'hall',
      type: 'relationship',
      relationTo: 'halls',
      required: true,
      hasMany: false,
      label: 'Hall',
      admin: {
        position: 'sidebar',
      },
    },
    slugField,
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Name of the Zone',
    },
    {
      name: 'dimensions',
      type: 'text',
      label: 'Dimensions',
      admin: {
        placeholder: '10"x20"',
      },
    },
    {
      name: 'capacity',
      type: 'number',
      label: 'Capacity of the Zone',
      admin: {
        placeholder: '100',
      },
    },
  ],
}
