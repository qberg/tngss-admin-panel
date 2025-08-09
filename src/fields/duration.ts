import type { Field } from 'payload'

type DatePickerAppearance = 'dayOnly' | 'timeOnly' | 'dayAndTime' | 'monthOnly' | 'default'

export const createDurationField = (
  name: string = 'duration',
  label: string = 'Stay Duration',
  pickerAppearance: DatePickerAppearance = 'dayOnly',
  startLabel: string = 'Start Date',
  endLabel: string = 'End Date',
  required: boolean = true,
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
            label: startLabel,
            type: 'date',
            required: required,
            admin: {
              width: '50%',
              date: {
                pickerAppearance: pickerAppearance,
                displayFormat:
                  pickerAppearance === 'dayAndTime' ? 'MMM d, yyy h:mm a' : 'MMM d, yyyy',
              },
            },
          },

          {
            name: 'to_date',
            label: endLabel,
            type: 'date',
            required: required,
            admin: {
              width: '50%',
              date: {
                pickerAppearance: pickerAppearance,
              },
            },
            validate: (value, { siblingData }) => {
              if (!value) {
                return true
              }

              // @ts-expect-error payload didnt do its magic yet
              const startDate = siblingData?.from_date

              if (!startDate) {
                return true
              }

              const start = new Date(startDate)
              const end = new Date(value)

              if (end <= start) {
                return 'End date must be after start date'
              }

              return true
            },
          },
        ],
      },
    ],
  }
}

export const durationField = createDurationField('duration', 'Stay Duration')
export const scheduleField = createDurationField(
  'schedule',
  'Event Schedule',
  'dayAndTime',
  'Start Time',
  'End Time',
)
export const registerationField = createDurationField(
  'registeration',
  'Registeration Period',
  'dayAndTime',
  'Start Time',
  'End Time',
)
