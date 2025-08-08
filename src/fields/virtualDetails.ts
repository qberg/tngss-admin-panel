import type { Field } from 'payload'

export const virtualDetailsField: Field[] = [
  {
    name: 'platform',
    label: 'Platform',
    type: 'select',
    options: [
      { label: 'Zoom', value: 'zoom' },
      { label: 'Microsoft Teams', value: 'teams' },
      { label: 'Google Meet', value: 'meet' },
      { label: 'YouTube Live', value: 'youtube' },
      { label: 'Custom Platform', value: 'custom' },
    ],
    admin: {
      width: '30%',
    },
  },
  {
    name: 'joinUrl',
    label: 'Join URL',
    type: 'text',
    admin: {
      placeholder: 'https://zoom.us/j/123456789',
      description: 'Link for virtual attendees to join',
      width: '70%',
    },
  },
  {
    name: 'meetingId',
    label: 'Meeting ID',
    type: 'text',
    admin: {
      placeholder: '123 456 789',
    },
  },
  {
    name: 'passcode',
    label: 'Passcode',
    type: 'text',
    admin: {
      placeholder: 'Event passcode if required',
    },
  },
]
