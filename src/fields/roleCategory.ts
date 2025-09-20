import type { Field } from 'payload'

export const roleCategoryField: Field = {
  name: 'role_category',
  label: 'Role Category',
  type: 'select',
  options: [
    { label: 'Leadership', value: 'leadership' },
    { label: 'Technical', value: 'technical' },
    { label: 'Operations', value: 'operations' },
    { label: 'Business Development', value: 'business_development' },
    { label: 'Finance', value: 'finance' },
    { label: 'Marketing', value: 'marketing' },
    { label: 'Legal', value: 'legal' },
    { label: 'Advisory', value: 'advisory' },
    { label: 'Research', value: 'research' },
    { label: 'Early Career', value: 'early_career' },
  ],
  admin: {
    description: 'Functional category for recommendation system',
  },
}
