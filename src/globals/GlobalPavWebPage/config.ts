import { anyone } from '@/collections/Users/access/anyone'
import { contentManager } from '@/collections/Users/access/contentManager'
import { CollectionConfig } from 'payload'

export const GlobalPavWebPage: CollectionConfig = {
  slug: 'global-wp',
  labels: {
    singular: 'Global Pavilion - Website',
    plural: 'Global Pavilions - Website',
  },
  admin: {
    group: 'Website Pages',
  },
  access: {
    read: anyone,
    update: contentManager,
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Name',
    },

    {
      name: 'country',
      type: 'text',
      label: 'Country',
    },

    {
      name: 'image',
      type: 'upload',
      label: 'Image',
      relationTo: 'media',
    },
  ],
}
