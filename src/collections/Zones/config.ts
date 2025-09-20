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
    defaultColumns: ['name', 'hall', 'dimensions', 'is_featured'],
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
    {
      name: 'hex_code',
      type: 'text',
      admin: {
        placeholder: '#17BFDB',
        position: 'sidebar',
      },
      label: 'Hex Code',
    },
    slugField,
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Name of the Zone',
    },
    {
      name: 'is_featured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Is Featured Zone',
      admin: {
        position: 'sidebar',
      },
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
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      admin: {
        condition: (_, siblingData) => Boolean(siblingData.is_featured === true),
      },
    },
  ],
}
