import { anyoneFieldAcess } from './anyone'
import { eventManagerFieldAccess } from './eventManager'
import { userFieldAccess } from './user'

export const publicFieldAccess = {
  read: anyoneFieldAcess,
  update: eventManagerFieldAccess,
}

export const adminFieldAccess = {
  read: userFieldAccess,
  update: eventManagerFieldAccess,
}
