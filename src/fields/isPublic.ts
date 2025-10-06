import type { Field } from 'payload'

export const isPublic: Field = {
  name: 'isPublic',
  type: 'checkbox',
  label: 'Publicly Visible',
  defaultValue: true,
  index: true,
  admin: {
    position: 'sidebar',
    description:
      'Enable this to make the content visible to all users (e.g., public website visitors).',
  },
}
