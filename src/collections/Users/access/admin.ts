import type { Access, FieldAccess } from 'payload'
import { checkRole } from './checkRole'

export const admin: Access = ({ req: { user } }) => {
  if (user) {
    if (checkRole(['admin'], user)) {
      return true
    }
  }
  return false
}

export const adminFieldAccess: FieldAccess = ({ req: { user } }) => {
  if (user) {
    if (checkRole(['admin'], user)) {
      return true
    }
  }

  return false
}
