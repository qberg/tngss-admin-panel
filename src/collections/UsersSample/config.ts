import type { CollectionConfig } from 'payload'

export const UsersSample: CollectionConfig = {
  slug: 'users-sample',
  labels: {
    singular: 'User Sample',
    plural: 'User Samples',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'first_name',
      type: 'text',
      label: 'First Name',
      required: false,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'last_name',
      type: 'text',
      label: 'Last Name',
      required: false,
    },
    {
      name: 'profile_image',
      type: 'text',
      label: 'Profile Image URL',
      required: false,
    },
    {
      name: 'role',
      type: 'select',
      label: 'Role',
      required: false,
      options: [
        { label: 'User', value: 'user' },
        { label: 'Admin', value: 'admin' },
        { label: 'Organizer', value: 'organizer' },
      ],
      defaultValue: 'user',
    },
    {
      name: 'email_id',
      type: 'email',
      label: 'Email',
      required: false,
      admin: {
        description: 'May be empty for phone-only users',
      },
    },
    {
      name: 'is_email_verified',
      type: 'checkbox',
      label: 'Email Verified',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'country_code',
      type: 'text',
      label: 'Country Code',
      required: false,
      defaultValue: '+91',
    },
    {
      name: 'phone_number',
      type: 'text',
      label: 'Phone Number',
      required: false,
      admin: {
        description: 'Phone number (will handle both string and number formats)',
      },
    },
    {
      name: 'is_phone_number_verified',
      type: 'checkbox',
      label: 'Phone Verified',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'auth_provider',
      type: 'select',
      label: 'Auth Provider',
      required: false,
      options: [
        { label: 'Phone Number', value: 'phone_number' },
        { label: 'Email', value: 'email' },
        { label: 'Google', value: 'google' },
      ],
      defaultValue: 'phone_number',
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      required: false,
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Suspended', value: 'suspended' },
      ],
      defaultValue: 'active',
      admin: { position: 'sidebar' },
    },
    {
      name: 'is_deleted',
      type: 'checkbox',
      label: 'Is Deleted',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },

    {
      name: 'additional_data',
      type: 'json',
      label: 'Additional Data',
      admin: {
        description: 'Any additional fields from the original database',
        position: 'sidebar',
      },
    },
  ],

  timestamps: true,
  hooks: {
    afterRead: [
      ({ doc }) => {
        // Handle number to string conversion for phone
        if (typeof doc.phone_number === 'number') {
          doc.phone_number = doc.phone_number.toString()
        }
        return doc
      },
    ],
  },
}
