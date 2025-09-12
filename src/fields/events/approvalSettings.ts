import type { Field } from 'payload'
import { registerationField } from '../duration'

export const approvalSettingsField: Field = {
  type: 'group',
  name: 'approval_settings',
  label: 'Admin Approval Settings',
  admin: {
    condition: (data) => data?.registeration_mode === 'approval',
    description: 'Settings specific to approval based event registeration',
  },
  fields: [
    registerationField,
    {
      name: 'capacity_settings',
      type: 'group',

      label: 'Event Capacity',
      admin: {
        description: 'Set the maximum number of attendees for this event',
      },
      fields: [
        {
          name: 'max_capacity',
          label: 'Maximum Attendees',
          type: 'number',
          min: 1,
          admin: {
            description: 'Maximum number of people who can attend',
            placeholder: '10',
          },
        },
      ],
    },
  ],
}
