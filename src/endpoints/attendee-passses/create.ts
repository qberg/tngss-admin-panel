import { addDataAndFileToRequest, headersWithCors, PayloadHandler } from 'payload'
import { z } from 'zod'

const AttendeeSchema = z.object({
  pass_id: z.string().min(1),
  name: z.string().min(1),
  email: z.email(),
  mobile: z.string().min(1),
  visitor_id: z.string().min(1),
  conference_name: z.string().min(1),
  pass_created_at: z.string().optional(),
  gender: z.string().optional(),
  designation: z.string().optional(),
  organisation: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().default('India'),
  pass_data: z.json().optional(),
  visitor_data: z.json().optional(),
  checkin_data: z.json().optional(),
})

const BulkSchema = z.object({
  attendees: z.array(AttendeeSchema).min(1),
})

// Value mapping dictionaries
const ORGANISATION_TYPE_MAP: Record<string, string> = {
  // Old → New mappings
  ecosystem_enablers: 'ecosystem_service_provider',
  aspirants_individuals: 'aspirants_individuals',

  // Keep valid new values
  startup: 'startup',
  incubation_acceleration: 'incubation_acceleration',
  investors: 'investors',
  government: 'government',
  industry_corporate: 'industry_corporate',
  mentor_sme: 'mentor_sme',
  ecosystem_service_provider: 'ecosystem_service_provider',
  others: 'others',

  // Fallbacks for invalid/empty values
  '': 'others',
  null: 'others',
  undefined: 'others',
}

const PROFILE_TYPE_MAP: Record<string, string> = {
  // Legacy → New mappings
  business_owner: 'working_professional',
  research_scholar: 'working_professional',
  educational_institutions: 'education_institution',
  startup_communities: 'startup_community',
  rd_agencies: 'r&d_agency',
  media_agencies: 'media_agency',
  ngos: 'ngo',
  angel_investors: 'angel_investor',
  private_equity_firms: 'private_equity',
  family_offices: 'family_office',

  // Keep valid values
  dpii: 'dpii',
  non_dpiit: 'non_dpiit',
  college_student: 'college_student',
  working_professional: 'working_professional',
  corporates: 'corporates',
  state_government: 'state_government',
  union_government: 'union_government',
  international: 'international',
  banks: 'banks',
  hnis: 'hnis',
  angel_investor: 'angel_investor',
  venture_capitalists: 'venture_capitalists',
  angel_networks: 'angel_networks',
  family_office: 'family_office',
  private_equity: 'private_equity',
  revenue_based_financing: 'revenue_based_financing',
  venture_debt: 'venture_debt',
  limited_partners: 'limited_partners',
  mentor: 'mentor',
  subject_matter_expert: 'subject_matter_expert',
  education_institution: 'education_institution',
  business_social_forums: 'business_social_forums',
  startup_community: 'startup_community',
  ngo: 'ngo',
  media_agency: 'media_agency',
  'r&d_agency': 'r&d_agency',
  legal_compliance_services: 'legal_compliance_services',
  consulting_advisory_services: 'consulting_advisory_services',
  coworking_space: 'coworking_space',
  makerspace: 'makerspace',
  financial_services: 'financial_services',
  technology_services: 'technology_services',
  marketing_branding_services: 'marketing_branding_services',
  design_agency: 'design_agency',
  industry_association: 'industry_association',
  incubators: 'incubators',
  accelerators: 'accelerators',
}

const WHY_ATTENDING_MAP: Record<string, string> = {
  // Legacy → New mappings
  funding: 'fundraising',
  network: 'network',
  learning: 'learnTechnologies',
  business: 'sourceSolutions',

  // Keep valid new values
  meetStakeholders: 'meetStakeholders',
  learnTechnologies: 'learnTechnologies',
  sourceSolutions: 'sourceSolutions',
  fundraising: 'fundraising',
  exploreStartupEcosystem: 'exploreStartupEcosystem',
  exploreIndiaTN: 'exploreIndiaTN',
  leadGeneration: 'leadGeneration',

  // Fallbacks
  '': 'exploreStartupEcosystem',
  null: 'exploreStartupEcosystem',
  undefined: 'exploreStartupEcosystem',
}

// Helper functions
// @ts-expect-error any
const mapValue = (value, mapping: Record<string, string>, fallback: string): string => {
  const stringValue = String(value || '').trim()
  return mapping[stringValue] || mapping[value] || fallback
}

const getSmartProfileFallback = (orgType: string): string => {
  const fallbacks: Record<string, string> = {
    startup: 'non_dpiit',
    aspirants_individuals: 'college_student',
    investors: 'angel_investor',
    government: 'state_government',
    mentor_sme: 'mentor',
    incubation_acceleration: 'incubators',
    ecosystem_service_provider: 'corporates',
    industry_corporate: 'none',
    others: 'none',
  }
  return fallbacks[orgType] || 'none'
}

// @ts-expect-error not yet
const transformAttendee = (data) => {
  const pass = data.pass_data || {}
  const visitor = data.visitor_data || {}

  // Map organisation type with fallback
  const rawOrgType = visitor.organisationType || visitor.organization_type || ''
  const organisationType = mapValue(rawOrgType, ORGANISATION_TYPE_MAP, 'others')

  // Map profile type with smart fallback based on org type
  const rawProfileType = visitor.profileType || visitor.profile_type || ''
  const contextualFallback = getSmartProfileFallback(organisationType)
  const profileType = mapValue(rawProfileType, PROFILE_TYPE_MAP, contextualFallback)

  // Map why attending
  const rawWhyAttending = visitor.whyAttend || visitor.whyAttending || ''
  const whyAttending = mapValue(rawWhyAttending, WHY_ATTENDING_MAP, 'exploreStartupEcosystem')

  // Create migration notes for transparency
  const migrationNotes = []
  if (rawOrgType && rawOrgType !== organisationType) {
    migrationNotes.push(`organisationType: "${rawOrgType}" → "${organisationType}"`)
  }
  if (rawProfileType && rawProfileType !== profileType) {
    migrationNotes.push(`profileType: "${rawProfileType}" → "${profileType}"`)
  }
  if (rawWhyAttending && rawWhyAttending !== whyAttending) {
    migrationNotes.push(`whyAttending: "${rawWhyAttending}" → "${whyAttending}"`)
  }
  if (!rawProfileType && profileType === contextualFallback) {
    migrationNotes.push(
      `profileType: empty → smart fallback "${profileType}" based on orgType "${organisationType}"`,
    )
  }

  return {
    // Pass Information
    pass_id: data.pass_id,
    pass_type: data.conference_name || 'TNGSS Visitor',

    // Personal Information
    name: pass.name || data.name,
    email: (pass.email || data.email || '').toLowerCase(),
    mobile: pass.mobile || data.mobile,
    gender: pass.gender || data.gender,
    designation: pass.designation || data.designation,
    organisation: pass.organisation || data.organisation,

    // Registration Context
    legacy_visitor_id: data.visitor_id,
    registration_email: (visitor.email || pass.email || '').toLowerCase(),
    registration_city: visitor.city || data.city,
    registration_state: visitor.state || data.state,
    registration_country: visitor.country || data.country || 'India',
    registration_organisation: visitor.organisation || pass.organisation,

    // Properly Mapped Organization Fields
    organisation_type: organisationType,
    profile_type: profileType,
    sector_interested: visitor.sectorIntrested || visitor.sector_interested || 'sector_agnostic',
    why_attending: whyAttending,
    website: visitor.website || '',

    // Status & Timestamps
    checked_in: !!data.checkin_data,
    legacy_created_at: data.pass_created_at || data.created_at,
    checkin_data: data.checkin_data || null,

    // Migration Metadata
    migration_notes: migrationNotes.length > 0 ? migrationNotes.join('; ') : '',
  }
}

// @ts-expect-error any
const validateApiToken = async (req) => {
  const authHeader = req.headers.get('authorization')
  const apiKeyHeader = req.headers.get('x-api-key')

  const token = authHeader?.replace('Bearer ', '') || apiKeyHeader

  if (!token) {
    return {
      valid: false,
      error:
        'Missing API token. Provide either Authorization: Bearer <token> or X-API-Key: <token> header',
    }
  }

  const validTokens = process.env.ATTENDEE_API_TOKENS?.split(',') || []
  if (validTokens.includes(token)) {
    return { valid: true }
  }

  return { valid: false, error: 'Invalid API token' }
}

// Rate limiting helper
const rateLimitMap = new Map()
const checkRateLimit = (identifier: string, limit = 500, windowMs = 60000) => {
  const now = Date.now()
  const windowStart = now - windowMs

  if (!rateLimitMap.has(identifier)) {
    rateLimitMap.set(identifier, [])
  }

  const requests = rateLimitMap.get(identifier).filter((time: number) => time > windowStart)

  if (requests.length >= limit) {
    return { allowed: false, resetTime: windowStart + windowMs }
  }

  requests.push(now)
  rateLimitMap.set(identifier, requests)
  return { allowed: true }
}

export const createAttendeePass: PayloadHandler = async (req) => {
  try {
    // 1. Validate API token first
    const tokenValidation = await validateApiToken(req)
    if (!tokenValidation.valid) {
      return Response.json(
        {
          success: false,
          error: 'Unauthorized',
          message: tokenValidation.error,
        },
        {
          status: 401,
          headers: headersWithCors({ headers: new Headers(), req }),
        },
      )
    }

    // 2. Rate limiting per token
    const token =
      req.headers.get('authorization')?.replace('Bearer ', '') || req.headers.get('x-api-key')
    const rateCheck = checkRateLimit(`token:${token}`, 500, 60000)
    if (!rateCheck.allowed) {
      return Response.json(
        {
          success: false,
          error: 'Rate limit exceeded',
          message: 'Too many requests. Try again later.',
        },
        {
          status: 429,
          headers: headersWithCors({ headers: new Headers(), req }),
        },
      )
    }

    await addDataAndFileToRequest(req)

    const result = AttendeeSchema.safeParse(req.data)
    if (!result.success) {
      return Response.json(
        {
          success: false,
          error: 'Validation failed',
          details: result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`),
        },
        {
          status: 400,
          headers: headersWithCors({ headers: new Headers(), req }),
        },
      )
    }

    // Check for existing pass
    const existing = await req.payload.find({
      collection: 'attendee-passes',
      where: { pass_id: { equals: result.data.pass_id } },
      limit: 1,
    })

    if (existing.totalDocs > 0) {
      return Response.json(
        {
          success: false,
          error: 'Pass already exists',
        },
        {
          status: 409,
          headers: headersWithCors({ headers: new Headers(), req }),
        },
      )
    }

    // Transform data with proper mapping
    const transformedData = transformAttendee(result.data)

    // Create attendee pass with transformed data
    const attendee = await req.payload.create({
      collection: 'attendee-passes',
      // @ts-expect-error any
      data: transformedData,
      overrideAccess: true,
    })

    // Log API usage for monitoring
    console.log(
      `API: Created attendee pass ${attendee.pass_id} via token ${token?.substring(0, 8)}...`,
    )
    if (transformedData.migration_notes) {
      console.log(`Migration notes: ${transformedData.migration_notes}`)
    }

    return Response.json(
      {
        success: true,
        data: { id: attendee.id, pass_id: attendee.pass_id, name: attendee.name },
      },
      {
        status: 201,
        headers: headersWithCors({ headers: new Headers(), req }),
      },
    )
  } catch (error) {
    console.error('Create attendee error:', error)
    return Response.json(
      {
        success: false,
        error: 'Internal server error',
      },
      {
        status: 500,
        headers: headersWithCors({ headers: new Headers(), req }),
      },
    )
  }
}

export const createAttendeePassesBulk: PayloadHandler = async (req) => {
  try {
    // 1. Validate API token
    const tokenValidation = await validateApiToken(req)
    if (!tokenValidation.valid) {
      return Response.json(
        {
          success: false,
          error: 'Unauthorized',
          message: tokenValidation.error,
        },
        {
          status: 401,
          headers: headersWithCors({ headers: new Headers(), req }),
        },
      )
    }

    // 2. Stricter rate limiting for bulk operations
    const token =
      req.headers.get('authorization')?.replace('Bearer ', '') || req.headers.get('x-api-key')
    const rateCheck = checkRateLimit(`bulk:${token}`, 5, 60000)
    if (!rateCheck.allowed) {
      return Response.json(
        {
          success: false,
          error: 'Rate limit exceeded',
          message: 'Bulk operation rate limit exceeded. Try again later.',
        },
        {
          status: 429,
          headers: headersWithCors({ headers: new Headers(), req }),
        },
      )
    }

    await addDataAndFileToRequest(req)

    const result = BulkSchema.safeParse(req.data)
    if (!result.success) {
      return Response.json(
        {
          success: false,
          error: 'Validation failed',
          details: result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`),
        },
        {
          status: 400,
          headers: headersWithCors({ headers: new Headers(), req }),
        },
      )
    }

    // Limit bulk size for security
    if (result.data.attendees.length > 1000) {
      return Response.json(
        {
          success: false,
          error: 'Bulk size exceeded',
          message: 'Maximum 1000 attendees per bulk request',
        },
        {
          status: 413,
          headers: headersWithCors({ headers: new Headers(), req }),
        },
      )
    }

    const created = []
    const errors = []

    // Process each attendee with proper transformation
    for (const attendee of result.data.attendees) {
      try {
        // Check duplicates
        const existing = await req.payload.find({
          collection: 'attendee-passes',
          where: { pass_id: { equals: attendee.pass_id } },
          limit: 1,
        })

        if (existing.totalDocs > 0) {
          errors.push({ pass_id: attendee.pass_id, error: 'Already exists' })
          continue
        }

        // Transform data with proper mapping
        const transformedData = transformAttendee(attendee)

        const newAttendee = await req.payload.create({
          collection: 'attendee-passes',
          // @ts-expect-error any
          data: transformedData,
          overrideAccess: true,
        })

        created.push({
          pass_id: newAttendee.pass_id,
          name: newAttendee.name,
          migration_notes: transformedData.migration_notes || undefined,
        })
      } catch (error) {
        errors.push({
          pass_id: attendee.pass_id,
          // @ts-expect-error not yet
          error: error.message || 'Creation failed',
        })
      }
    }

    // Log bulk operation
    console.log(`API: Bulk created ${created.length} passes via token ${token?.substring(0, 8)}...`)

    return Response.json(
      {
        success: created.length > 0,
        message: `Created: ${created.length}, Failed: ${errors.length}`,
        data: { created, errors, total: result.data.attendees.length },
      },
      {
        status: errors.length > 0 ? 207 : 201,
        headers: headersWithCors({ headers: new Headers(), req }),
      },
    )
  } catch (error) {
    console.error('Bulk create error:', error)
    return Response.json(
      {
        success: false,
        error: 'Internal server error',
      },
      {
        status: 500,
        headers: headersWithCors({ headers: new Headers(), req }),
      },
    )
  }
}
