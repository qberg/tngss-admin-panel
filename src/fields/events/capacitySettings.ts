import type { Field } from 'payload'

export const capacitySettingsField: Field = {
  type: 'group',
  name: 'capacity_settings',
  label: 'Event Capacity',
  admin: {
    condition: (data) => ['fcfs', 'approval'].includes(data?.registeration_mode),
    description: 'Set the maximum number of attendees for this event',
  },
  fields: [
    {
      name: 'capacity_type',
      type: 'radio',
      label: 'Capacity Type',
      required: true,
      defaultValue: 'limited',
      options: [
        { label: 'Limited Capacity', value: 'limited' },
        { label: 'Unlimited Capacity', value: 'unlimited' },
      ],
      admin: {
        layout: 'horizontal',
        description: 'Choose whether this event has a capacity limit',
      },
    },

    {
      name: 'max_capacity',
      label: 'Maximum Attendees',
      type: 'number',
      min: 1,
      admin: {
        condition: (_, siblingData) => siblingData?.capacity_type === 'limited',
        description: 'Maximum number of people who can attend',
        placeholder: '100',
      },
      // @ts-expect-error payload yet to do its magic
      validate: (value, { siblingData }) => {
        if (siblingData?.capacity_type === 'limited' && !value) {
          return 'Maximum capacity is required when using limited capacity'
        }
        if (siblingData?.capacityType === 'limited' && value < 1) {
          return 'Capacity must be at least 1'
        }
        return true
      },
    },

    {
      name: 'soft_capacity_warning',
      label: 'Soft Capacity Warning',
      type: 'number',
      admin: {
        condition: (_, siblingData) => siblingData?.capacity_type === 'unlimited',
        description: 'Show warning when registrations exceed this number (optional)',
        placeholder: '1000',
      },
    },
  ],
}
