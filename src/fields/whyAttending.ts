import { Field } from 'payload'

export const whyAttendingField: Field = {
  name: 'why_attending',
  type: 'select',
  label: 'Why Attending',
  required: true,
  options: [
    { label: 'Meet global stakeholders', value: 'meetStakeholders' },
    { label: 'Learn about new technologies and trends', value: 'learnTechnologies' },
    { label: 'Network with industry leaders', value: 'network' },
    { label: 'Source for innovative solutions', value: 'sourceSolutions' },
    { label: 'Fundraising and investment opportunities', value: 'fundraising' },
    { label: 'Explore startup ecosystem', value: 'exploreStartupEcosystem' },
    { label: "Explore India & TN's various offerings", value: 'exploreIndiaTN' },
    { label: 'Lead Generation', value: 'leadGeneration' },
    // Legacy fallback
    { label: 'Funding', value: 'funding' },
  ],
  admin: {
    description: 'Reason for attending from registration',
    readOnly: true,
  },
}
