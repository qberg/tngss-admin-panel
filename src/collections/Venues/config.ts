import type { CollectionConfig } from 'payload'
import { eventManager } from '../Users/access/eventManager'
import { anyone } from '../Users/access/anyone'

export const Veneues: CollectionConfig = {
  slug: 'venues',
  labels: {
    singular: 'Venue',
    plural: 'Venues',
  },
  admin: {
    group: 'Venue Management',
    useAsTitle: 'name',
    defaultColumns: ['name', 'city', 'type'],
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
      label: 'Name of the Venue',
      required: true,
      admin: {
        placeholder: 'Codissia',
      },
    },
    {
      name: 'city',
      type: 'text',
      required: true,
      label: 'Name of the city',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'type',
      type: 'select',
      label: 'Type of Venue',
      defaultValue: 'partner_event',
      required: true,
      options: [
        { label: 'Main Event', value: 'main_event' },
        { label: 'Partner Event', value: 'partner_event' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'mapUrl',
      type: 'text',
      label: 'Google Maps Url of the location',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
