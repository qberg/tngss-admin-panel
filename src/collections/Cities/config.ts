import type { CollectionConfig } from 'payload'
import { eventManager } from '../Users/access/eventManager'
import { anyone } from '../Users/access/anyone'
import { slugField } from '@/fields/slug'

export const Cities: CollectionConfig = {
  slug: 'cities',
  labels: {
    singular: 'City',
    plural: 'Cities',
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
      name: 'name',
      type: 'text',
      required: true,
      label: 'Name of the City',
    },
    slugField,
  ],
}
