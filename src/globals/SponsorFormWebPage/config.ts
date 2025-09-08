import { anyone } from '@/collections/Users/access/anyone'
import { eventManager } from '@/collections/Users/access/eventManager'
import type { GlobalConfig } from 'payload'

export const SponsorFormWebPage: GlobalConfig = {
  slug: 'sponsor-form-wp',
  label: 'Sponsor Form - Website',
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
      defaultValue: 'Sponsor at TNGSS',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      defaultValue:
        'Complete the form and our team will reach out to guide you through our sponsorship opportunities.',
    },

    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      hasMany: false,
      label: 'Sponsorship Form',
    },
  ],
}
