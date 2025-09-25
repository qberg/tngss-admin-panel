import type { Field } from 'payload'

export const clickActionField: Field = {
  name: 'click_action',
  type: 'group',
  label: 'Click Action',
  admin: {
    description: 'Configure what happens when user clicks this banner',
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      label: 'Action Type',
      options: [
        {
          label: 'No Action',
          value: 'none',
        },
        {
          label: 'Internal Route',
          value: 'internal',
        },
        {
          label: 'External URL',
          value: 'external',
        },
      ],
      defaultValue: 'none',
      admin: {
        description: 'Choose whether to navigate to an internal app screen or external website',
      },
    },
    {
      name: 'internal_route',
      type: 'text',
      label: 'Internal Route',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'internal',
        description: 'Select which screen to navigate to within the app',
      },
    },
    {
      name: 'external_url',
      type: 'text',
      label: 'External URL',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'external',
        description: 'Enter the full URL (must start with http:// or https://)',
      },
      // @ts-expect-error payload
      validate: (val, { siblingData }) => {
        if (siblingData?.actionType === 'external') {
          if (!val) return 'External URL is required when action type is external'
          if (!val.startsWith('http://') && !val.startsWith('https://')) {
            return 'URL must start with http:// or https://'
          }
        }
        return true
      },
    },
    {
      name: 'open_in_browser',
      type: 'checkbox',
      label: 'Open in External Browser',
      defaultValue: false,
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'external',
        description:
          'Check this to open the URL in the device default browser instead of in-app browser',
      },
    },
  ],
}
