import type { Field } from 'payload'

export const createDurationField = (
  name: string = 'duration',
  label: string = 'Stay Duration',
): Field => {
  return {
    name: name,
    label: label,
    type: 'group',
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'from_date',
            label: 'Start Date',
            type: 'date',
            admin: {
              width: '50%',
              date: {
                pickerAppearance: 'dayOnly',
              },
            },
          },

          {
            name: 'to_date',
            label: 'End Date',
            type: 'date',
            admin: {
              width: '50%',
              date: {
                pickerAppearance: 'dayOnly',
              },
            },
          },
        ],
      },
    ],
  }
}

export const durationField = createDurationField('duration', 'Stay Duration')
