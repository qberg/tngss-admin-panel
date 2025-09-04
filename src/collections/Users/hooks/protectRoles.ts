import type { FieldHook } from 'payload'
import type { User } from '@/payload-types'

export const protectRoles: FieldHook<{ id: string } & User> = ({ data, req, originalDoc }) => {
  const isAdmin = req?.user?.roles?.includes('admin')

  if (!data?.roles || data.roles.length === 0) {
    return originalDoc?.roles || ['user']
  }

  if (isAdmin) {
    const userRoles = new Set(data.roles)
    userRoles.add('user')
    return [...userRoles]
  }

  return originalDoc?.roles || ['user']
}
