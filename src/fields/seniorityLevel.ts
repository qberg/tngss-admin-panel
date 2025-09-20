import type { Field } from 'payload'

export const seniorityLevelField: Field = {
  name: 'seniority_level',
  label: 'Seniority Level',
  type: 'select',
  options: [
    { label: 'Executive', value: 'executive' },
    { label: 'Senior', value: 'senior' },
    { label: 'Mid-Level', value: 'mid_level' },
    { label: 'Junior', value: 'junior' },
    { label: 'Entry Level', value: 'entry_level' },
    { label: 'Student', value: 'student' },
  ],
  admin: {
    description: 'Hierarchy level for matching and recommendations',
  },
}
