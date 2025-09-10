import { Field } from 'payload'

export const genderField: Field = {
  name: 'gender',
  type: 'select',
  options: [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ],
  admin: {
    description: 'From pass_data.gender',
    readOnly: true,
  },
}
