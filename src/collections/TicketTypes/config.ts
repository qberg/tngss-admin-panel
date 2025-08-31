import type { CollectionConfig } from 'payload'
import { admin } from '../Users/access/admin'
import { anyone } from '../Users/access/anyone'
import { slugField } from '@/fields/slug'
import { eventManager, eventManagerFieldAccess } from '../Users/access/eventManager'
import { userFieldAccess } from '../Users/access/user'

const adminFieldAccess = {
  read: userFieldAccess,
  update: eventManagerFieldAccess,
}

// for legacy reasons aka my fuckup i am jugaading it to Access Level Label
export const TicketTypes: CollectionConfig = {
  slug: 'ticket-types',
  labels: {
    singular: 'Access Type',
    plural: 'Access Types',
  },
  access: {
    create: admin,
    read: anyone,
    update: eventManager,
    delete: admin,
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Ticket type Name',
    },
    slugField,

    {
      name: 'external_integration',
      type: 'group',
      label: 'External System Integration',
      access: adminFieldAccess,
      fields: [
        {
          name: 'vendorTicketTypeId',
          label: 'Vendor Ticket Type ID',
          type: 'text',
          admin: {
            description: 'Reference ID in kamelon ticketing system',
            placeholder: 'premium_ticket_xyz123',
          },
        },
      ],
    },
  ],
}
