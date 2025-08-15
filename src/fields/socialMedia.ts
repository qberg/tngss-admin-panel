import type { Field } from 'payload'

export const socialMediaField: Field = {
  name: 'social_media_links',
  type: 'array',
  label: 'Social Media Links',
  fields: [
    {
      name: 'platform',
      type: 'select',
      label: 'Platform',
      required: true,
      options: [
        { label: 'Facebook', value: 'facebook' },
        { label: 'Twitter/X', value: 'twitter' },
        { label: 'Instagram', value: 'instagram' },
        { label: 'LinkedIn', value: 'linkedin' },
        { label: 'YouTube', value: 'youtube' },
        { label: 'Telegram', value: 'telegram' },
        { label: 'WhatsApp', value: 'whatsapp' },
        { label: 'Discord', value: 'discord' },
        { label: 'Website', value: 'website' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'platform_custom',
      type: 'text',
      label: 'Custom Platform Name',
      admin: {
        condition: (_, siblingData) => siblingData?.platform === 'other',
        description: 'Enter custom platform name when "Other" is selected',
      },
    },
    {
      name: 'url',
      type: 'text',
      label: 'Profile/Page URL',
      required: true,
      // @ts-expect-error Payload
      validate: (value) => {
        if (!value) return 'URL is required'
        if (!value.startsWith('http://') && !value.startsWith('https://')) {
          return 'URL must start with http:// or https://'
        }
        return true
      },
    },
    {
      name: 'handle',
      type: 'text',
      label: 'Handle/Username (optional)',
      admin: {
        description: 'e.g., @startuptn for display purposes',
      },
    },
  ],
}
