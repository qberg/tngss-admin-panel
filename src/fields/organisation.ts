import type { Field } from 'payload'

export const organisationField: Field = {
  name: 'organisation_type',
  type: 'select',
  required: true,
  options: [
    { label: 'Startup', value: 'startup' },
    { label: 'Aspirant / Individual', value: 'aspirants_individuals' },
    { label: 'Ecosystem Enabler', value: 'ecosystem_enablers' },
    { label: 'Incubation & Acceleration', value: 'incubation_acceleration' },
    { label: 'Investor', value: 'investors' },
    { label: 'Mentor', value: 'mentor_sme' },
    { label: 'Ecosystem Service Provider', value: 'ecosystem_service_provider' },
  ],
  admin: {
    description: 'From visitor_data.organisationType - key for user categorization',
    readOnly: true,
  },
}
