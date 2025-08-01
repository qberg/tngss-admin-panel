import type { Access, FieldAccess } from 'payload'
import { checkRole } from './checkRole'

export const eventManager: Access = ({ req: { user } }) => {
  if (user) {
    if (checkRole(['admin', 'event-manager'], user)) {
      return true
    }
  }
  return false
}

export const eventManagerFieldAccess: FieldAccess = ({ req: { user } }) => {
  if (user) {
    if (checkRole(['admin', 'event-manager'], user)) {
      return true
    }
  }
  return false
}
