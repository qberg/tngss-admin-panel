import type { CollectionConfig } from 'payload'
import { eventManager } from '../Users/access/eventManager'
import { anyone } from '../Users/access/anyone'

export const MainEvents: CollectionConfig = {
  slug: 'main-events',
  labels: {
    singular: 'Main Event',
    plural: 'Main Events',
  },
  admin: {
    group: 'Events Management',
    useAsTitle: 'title',
  },
  access: {
    create: eventManager,
    read: anyone,
    update: eventManager,
    delete: eventManager,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Name of the Event',
      admin: {
        placeholder: 'Startup Networking Mixer',
      },
    },
  ],
}
