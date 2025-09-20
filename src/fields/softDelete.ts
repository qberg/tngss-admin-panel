import { contentManagerFieldAccess } from '@/collections/Users/access/contentManager'
import type { Field } from 'payload'

export const softDeleteField: Field = {
  name: 'deleted',
  type: 'checkbox',
  defaultValue: false,
  admin: {
    position: 'sidebar',
    description: 'Mark as deleted (soft delete)',
  },
  access: {
    create: contentManagerFieldAccess,
    read: contentManagerFieldAccess,
    update: contentManagerFieldAccess,
  },
}
