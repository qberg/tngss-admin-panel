import type { PayloadHandler } from 'payload'
import { headersWithCors } from 'payload'

export const getAllOrganisation: PayloadHandler = async (req) => {
  try {
    const organisationTypeOptions = [
      { label: 'Startup', value: 'startup' },
      { label: 'Aspirant (Student/Professional)', value: 'aspirants_individuals' },
      { label: 'Incubation & Acceleration', value: 'incubation_acceleration' },
      { label: 'Investor', value: 'investors' },
      { label: 'Government (State/Union/International)', value: 'government' },
      { label: 'Industry & Corporate', value: 'industry_corporate' },
      { label: 'Mentor', value: 'mentor_sme' },
      { label: 'Ecosystem Partners', value: 'ecosystem_service_provider' },
      { label: 'Others', value: 'others' },
    ]

    const organisationRoles = await req.payload.find({
      collection: 'organisation_roles',
      limit: 0,
      depth: 1,
      select: {
        organisation_type: true,
      },
    })

    const organisationTypeValues = new Set()

    organisationRoles.docs.forEach((doc) => {
      if (doc.organisation_type) {
        organisationTypeValues.add(doc.organisation_type)
      }
    })

    const usedTypes = Array.from(organisationTypeValues).map((value) => {
      const option = organisationTypeOptions.find((opt) => opt.value === value)
      return option
        ? {
            label: option.label,
            value: option.value,
          }
        : {
            label: value,
            value: value,
          }
    })

    return Response.json(
      {
        success: true,
        status: 200,
        message: 'Sucessfully retrieved organisations',
        data: usedTypes,
        total_records: organisationRoles.totalDocs,
      },
      {
        headers: headersWithCors({
          headers: new Headers(),
          req,
        }),
      },
    )
  } catch (error) {
    console.error('Error fetching organisation types:', error)
    return Response.json(
      { error: 'Failed to fetch organisation types' },
      {
        status: 500,
        headers: headersWithCors({
          headers: new Headers(),
          req,
        }),
      },
    )
  }
}
