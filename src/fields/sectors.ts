import { SECTORS } from '@/constants/sectors'
import type { Field } from 'payload'

export const sectorsField: Field = {
  name: 'sector_interested',
  type: 'select',
  label: 'Sector Interested In',
  required: true,
  options: SECTORS,
  admin: {
    description: 'From visitor_data.sectorInterested - sector user is interested in',
  },
}
