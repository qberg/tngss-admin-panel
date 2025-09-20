import type { Field } from 'payload'

export const organisationField: Field = {
  name: 'organisation_type',
  label: 'Organisation Type',
  type: 'select',
  required: true,
  options: [
    { label: 'Startup', value: 'startup' },
    { label: 'Aspirant (Student/Professional)', value: 'aspirants_individuals' },
    { label: 'Incubation & Acceleration', value: 'incubation_acceleration' },
    { label: 'Investor', value: 'investors' },
    { label: 'Government (State/Union/International)', value: 'government' },
    { label: 'Industry & Corporate', value: 'industry_corporate' },
    { label: 'Mentor', value: 'mentor_sme' },
    { label: 'Ecosystem Partners', value: 'ecosystem_service_provider' },
    { label: 'Others', value: 'others' },
  ],
  admin: {
    description: 'Main persona categorisation (From visitor_data.organisationType)',
  },
}
