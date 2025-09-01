export type RegistrationStatus =
  | 'registered'
  | 'waitlist'
  | 'waiting_for_approval'
  | 'rejected'
  | 'approved'

export interface ExternalRegistrationData {
  _id: string
  registration_status: RegistrationStatus
  mywaitlist_count: number
  waitlist: boolean
  name: string
  email_id: string
  phone_number: string
  gender: string
  designation: string
  organization_name: string
  ticket: string
}

export interface ExternalAPIResponse {
  statusCode: number
  message: string
  data: ExternalRegistrationData[]
}
