import type { Field } from 'payload'

export const isActive: Field = {
  name: 'isActive',
  type: 'checkbox',
  label: 'Active',
  defaultValue: true,
  admin: {
    position: 'sidebar',
    description: 'Enable to include this item in lists, filters, or dropdowns.',
  },
}
