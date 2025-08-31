import type { CollectionConfig } from 'payload'

export const EventRegistrationsSample: CollectionConfig = {
  slug: 'event_registrations',
  labels: {
    singular: 'Event Registration',
    plural: 'Event Registrations',
  },
  access: {
    read: () => true,
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  admin: {
    description: '📖 Read-only view of event registrations with user relationships',
    group: 'Event Management',
    listSearchableFields: ['user_id', 'event_id', 'registration_status'],
  },
  fields: [
    {
      name: 'user_id',
      type: 'text',
      label: 'User',
      admin: {
        description: 'User who made this registration',
        readOnly: true,
      },
    },
    {
      name: 'registration_status',
      type: 'select',
      label: 'Registration Status',
      options: [
        { label: 'Registered', value: 'registered' },
        { label: 'Waitlist', value: 'waitlist' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Pending', value: 'pending' },
      ],
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'event_id',
      type: 'relationship',
      relationTo: 'events',
      admin: {
        description: 'Reference to event being registered for',
        readOnly: true,
      },
    },
    {
      name: 'waitlist_count',
      type: 'number',
      label: 'Waitlist Count',
      admin: {
        description: 'Position in waitlist (if applicable)',
        condition: (data) => data.registration_status === 'waitlist',
        readOnly: true,
      },
    },
    {
      name: 'is_deleted',
      type: 'checkbox',
      label: 'Is Deleted',
      admin: {
        position: 'sidebar',
        description: 'Soft delete flag',
        readOnly: true,
      },
    },
  ],
  timestamps: true,
}
