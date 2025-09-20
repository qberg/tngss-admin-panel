import { Access } from 'payload'

export const readNonDeleted: Access = () => {
  return {
    deleted: {
      not_equals: true,
    },
  }
}

export const readIncludingDeleted: Access = ({ req: { user } }) => {
  if (user) {
    return true
  }

  return {
    deleted: {
      not_equals: true,
    },
  }
}
