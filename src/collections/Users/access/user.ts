import type { Access, FieldAccess } from 'payload'
import { checkRole } from './checkRole'

export const user: Access = ({ req: { user } }) => {
  if (user) {
    if (checkRole(['admin', 'event-manager', 'content-manager'], user)) {
      return true
    }
    return {
      id: {
        equals: user.id,
      },
    }
  }
  return false
}

export const userFieldAccess: FieldAccess = ({ req: { user }, data }) => {
  if (user) {
    if (checkRole(['admin', 'event-manager', 'content-manager'], user)) {
      return true
    }
    return data?.id === user.id
  }
  return false
}
