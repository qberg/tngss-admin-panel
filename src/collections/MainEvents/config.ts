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
  },
  access: {
    create: eventManager,
    read: anyone,
    update: eventManager,
    delete: eventManager,
  },
  fields: [],
}
