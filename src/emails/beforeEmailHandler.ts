import type { BeforeEmail } from '@payloadcms/plugin-form-builder/types'
import type { FormSubmission } from '../payload-types'
import { getSponsorConfirmationEmailConfig } from './sponsorConfirmationTemplate'

// @ts-expect-error - Email config structure may not perfectly match Payload's expected type
const convertSubmissionData = (submissionData) => {
  if (Array.isArray(submissionData)) {
    const converted: { [key: string]: any } = {}
    submissionData.forEach((item) => {
      if (item.field && item.value !== undefined) {
        converted[item.field] = item.value
      }
    })
    return converted
  }
  return submissionData || {}
}

// @ts-expect-error - Email config structure may not perfectly match Payload's expected type
export const customBeforeEmail: BeforeEmail<FormSubmission> = (emailsToSend, { data }) => {
  const submissionData = convertSubmissionData(data.submissionData)

  const formId = data.form
  const sponsorshipFormId = '68ba4422eebf01900abff1cb'
  const isSponsorshipForm = formId === sponsorshipFormId

  if (isSponsorshipForm) {
    const userEmail = submissionData.email || submissionData.emailAddress

    if (userEmail) {
      const confirmationEmailConfig = getSponsorConfirmationEmailConfig(submissionData)

      return [confirmationEmailConfig]
    } else {
      console.log('No user email found in submission data')
    }
  } else {
    console.log('Not a sponsorship form, using default email behavior')
  }

  console.log('Returning original emails:', emailsToSend.length)
  return emailsToSend
}
