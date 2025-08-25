import type { Field } from 'payload'

export const createSponsorField = (name: string, label: string, format?: string): Field => ({
  name,
  type: 'group',
  label,
  fields: [
    {
      name: 'header',
      type: 'text',
      label: 'Section Header',
      defaultValue: label,
      admin: {
        description: 'Header text for this sponsor tier section',
      },
    },
    {
      name: 'logos',
      type: 'array',
      label: 'Sponsor Logos',
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          label: 'Logo',
          required: true,
          admin: {
            description: format
              ? `Upload the logo in ${format} format or similar aspect ratio`
              : 'Upload the sponsor logo',
          },
        },
      ],
    },
  ],
})
