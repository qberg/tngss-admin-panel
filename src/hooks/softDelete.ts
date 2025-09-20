import { checkRole } from '@/collections/Users/access/checkRole'
import { CollectionBeforeOperationHook } from 'payload'

export const softDeleteHook: CollectionBeforeOperationHook = ({ args, operation, req }) => {
  if (operation === 'read') {
    const { user } = req

    if (user && checkRole(['admin', 'event-manager', 'content-manager'], user)) {
      return args
    }

    return {
      ...args,
      where: {
        ...args.where,
        deleted: {
          not_equals: true,
        },
      },
    }
  }

  return args
}
