import type { CollectionConfig } from 'payload'
import { eventManager } from '../Users/access/eventManager'
import { anyone } from '../Users/access/anyone'

export const Representatives: CollectionConfig = {
  slug: 'representatives',
  labels: {
    singular: 'Representative',
    plural: 'Representatives',
  },
  access: {
    create: eventManager,
    read: anyone,
    update: eventManager,
    delete: eventManager,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Name',
          required: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'designation',
          type: 'text',
          label: 'Designation',
          admin: {
            width: '50%',
          },
        },

        {
          name: 'org_name',
          type: 'text',
          label: 'Organization',
          admin: {
            width: '50%',
          },
        },

        {
          name: 'phone_number',
          type: 'text',
          label: 'Phone Number',
          admin: {
            width: '50%',
          },
        },

        {
          name: 'email_id',
          type: 'text',
          label: 'Email Id',
          admin: {
            width: '50%',
          },
        },
      ],
    },
  ],
}
