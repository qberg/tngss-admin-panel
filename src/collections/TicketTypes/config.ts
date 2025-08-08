import type { CollectionConfig } from 'payload'
import { admin } from '../Users/access/admin'
import { anyone, anyoneFieldAcess } from '../Users/access/anyone'
import { slugField } from '@/fields/slug'
import { eventManager, eventManagerFieldAccess } from '../Users/access/eventManager'
import { userFieldAccess } from '../Users/access/user'

const publicFieldAccess = {
  read: anyoneFieldAcess,
  update: eventManagerFieldAccess,
}

const adminFieldAccess = {
  read: userFieldAccess,
  update: eventManagerFieldAccess,
}

export const TicketTypes: CollectionConfig = {
  slug: 'ticket-types',
  labels: {
    singular: 'Ticket Type',
    plural: 'Ticket Types',
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
      name: 'features',
      label: 'Included Features',
      type: 'array',
      access: publicFieldAccess,
      fields: [
        {
          name: 'feature',
          type: 'text',
          required: true,
          admin: {
            placeholder: 'Access to all sessions, Premium lunch, Networking dinner',
          },
        },
      ],
      admin: {
        description: 'List of benefits included with this ticket type',
      },
    },

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
