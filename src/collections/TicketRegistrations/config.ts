import type { CollectionConfig } from 'payload'

export const TicketRegistrations: CollectionConfig = {
  slug: 'ticket-registrations',
  labels: {
    singular: 'Ticket Registration',
    plural: 'Ticket Registrations',
  },
  access: {
    create: () => false,
    read: () => true,
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: 'legacy_visitor_id',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Original visitor_id UUID from PostgreSQL for reference',
        readOnly: true,
      },
    },
  ],
}
