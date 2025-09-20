import { Access } from 'payload'

const ALLOWED_EMAILS = ['kishore@minsky.in', 'reneeth@minsky.in']

export const checkEmailAccess: Access = ({ req: { user } }) => {
  if (!user) return false

  return ALLOWED_EMAILS.includes(user.email)
}
