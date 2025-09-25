import { anyone } from '@/collections/Users/access/anyone'
import { eventManager } from '@/collections/Users/access/eventManager'
import type { GlobalConfig } from 'payload'

export const PressAndMediaFormWebPage: GlobalConfig = {
  slug: 'media-form-wp',
  label: 'Press/Media Form - Website',
  admin: {
    group: 'Website Pages',
  },
  access: {
    read: anyone,
    update: eventManager,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      defaultValue: 'Press/Media Registration',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      defaultValue: 'Submit the form to register as Press/Media for TNGSS 2025',
    },

    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      hasMany: false,
      label: 'Registeration Form',
    },
  ],
}
