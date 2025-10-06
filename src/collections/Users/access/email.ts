// Users/access/email.ts
import { Access } from 'payload'

const ALLOWED_EMAILS = [
  'kishore@minsky.in',
  'reneeth@minsky.in',
  'jawahar@minsky.in',
  'naveen@startuptn.in',
]

export const checkEmailAccess: Access = ({ req: { user } }) => {
  if (!user?.email) return false
  return ALLOWED_EMAILS.includes(user.email)
}
