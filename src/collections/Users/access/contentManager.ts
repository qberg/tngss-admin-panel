import { Access, FieldAccess } from 'payload'
import { checkRole } from './checkRole'

export const contentManager: Access = ({ req: { user } }) => {
  if (user) {
    if (checkRole(['admin', 'event-manager', 'content-manager'], user)) {
      return true
    }
  }
  return false
}

export const contentManagerFieldAccess: FieldAccess = ({ req: { user } }) => {
  if (user) {
    if (checkRole(['admin', 'event-manager', 'content-manager'], user)) {
      return true
    }
  }
  return false
}
