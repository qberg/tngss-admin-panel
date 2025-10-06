import { addDataAndFileToRequest, headersWithCors, PayloadHandler } from 'payload'
import { z } from 'zod'

const AttendeeSchema = z.object({
  pass_id: z.string().min(1),
  name: z.string().min(1),
  email: z.email(),
  mobile: z.string().min(1),
  visitor_id: z.string().min(1),
  conference_name: z.string().min(1),
  conference_id: z.string().optional(),
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
  upgrade: z.boolean().default(false),
})

const BulkSchema = z.object({
  attendees: z.array(AttendeeSchema).min(1),
})

const PASS_TYPE_ID_MAP: Record<string, string> = {
  'TNGSS Visitor': 'f171cd44-8007-4ad2-beea-c487c1827246',
  'TNGSS Conference': 'f171cd44-8007-4ad2-beea-c487c1827247',
  Conference: 'f171cd44-8007-4ad2-beea-c487c1827247',
  Visitor: 'f171cd44-8007-4ad2-beea-c487c1827246',
}
const VALID_PASS_TYPE_IDS = Object.values(PASS_TYPE_ID_MAP)

// @ts-expect-error any
const getPassTypeId = (data): string => {
  const startTime = Date.now()

  try {
    let passTypeId: string

    if (data.conference_id && VALID_PASS_TYPE_IDS.includes(data.pass_type_id)) {
      passTypeId = data.conference_id
      console.log(
        `PASS_TYPE_RESOLVER: Used direct conference_id - passId: ${data.pass_id}, conferenceId: ${passTypeId}`,
      )
    } else if (
      data.visitor_data?.conference_id &&
      VALID_PASS_TYPE_IDS.includes(data.visitor_data.conference_id)
    ) {
      passTypeId = data.visitor_data.conference_id
      console.log(
        `PASS_TYPE_RESOLVER: Used visitor_data conference_id - passId: ${data.pass_id}, conferenceId: ${passTypeId}`,
      )
    } else {
      const conferenceName = data.conference_name || 'TNGSS Visitor'
      passTypeId = PASS_TYPE_ID_MAP[conferenceName] || PASS_TYPE_ID_MAP['TNGSS Visitor']
      console.log(
        `PASS_TYPE_RESOLVER: Used conference name mapping - passId: ${data.pass_id}, conferenceName: ${conferenceName}, passTypeId: ${passTypeId}`,
      )
    }

    console.log(
      `PASS_TYPE_RESOLVER: Resolved in ${Date.now() - startTime}ms - passId: ${data.pass_id}, result: ${passTypeId}`,
    )
    return passTypeId
  } catch (error) {
    console.error(
      `PASS_TYPE_RESOLVER: Error resolving pass type - passId: ${data.pass_id}, error:`,
      error,
    )
    const fallback = PASS_TYPE_ID_MAP['TNGSS Visitor']
    console.log(
      `PASS_TYPE_RESOLVER: Using fallback - passId: ${data.pass_id}, fallback: ${fallback}`,
    )
    return fallback
  }
}

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
  const originalValue = value
  const stringValue = String(value || '').trim()
  const mappedValue = mapping[stringValue] || mapping[value] || fallback

  if (originalValue !== mappedValue && originalValue) {
    console.log(`VALUE_MAPPING: Mapped "${originalValue}" to "${mappedValue}"`)
  }

  return mappedValue
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
  const fallback = fallbacks[orgType] || 'none'
  console.log(`SMART_FALLBACK: orgType "${orgType}" -> profileType fallback "${fallback}"`)
  return fallback
}

// @ts-expect-error not yet
const transformAttendee = (data) => {
  const startTime = Date.now()
  console.log(
    `TRANSFORM_START: Processing attendee - passId: ${data.pass_id}, email: ${data.email}`,
  )

  try {
    const pass = data.pass_data || {}
    const visitor = data.visitor_data || {}

    // Map organisation type with fallback
    const rawOrgType = visitor.organisationType || visitor.organization_type || ''
    const organisationType = mapValue(rawOrgType, ORGANISATION_TYPE_MAP, 'others')
    console.log(
      `TRANSFORM_ORG: passId: ${data.pass_id}, raw: "${rawOrgType}", mapped: "${organisationType}"`,
    )

    // Map profile type with smart fallback based on org type
    const rawProfileType = visitor.profileType || visitor.profile_type || ''
    const contextualFallback = getSmartProfileFallback(organisationType)
    const profileType = mapValue(rawProfileType, PROFILE_TYPE_MAP, contextualFallback)
    console.log(
      `TRANSFORM_PROFILE: passId: ${data.pass_id}, raw: "${rawProfileType}", mapped: "${profileType}", fallback: "${contextualFallback}"`,
    )

    // Map why attending
    const rawWhyAttending = visitor.whyAttend || visitor.whyAttending || ''
    const whyAttending = mapValue(rawWhyAttending, WHY_ATTENDING_MAP, 'exploreStartupEcosystem')
    console.log(
      `TRANSFORM_WHY: passId: ${data.pass_id}, raw: "${rawWhyAttending}", mapped: "${whyAttending}"`,
    )

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

    const transformedData = {
      // Pass Information
      pass_id: data.pass_id,
      pass_type: data.conference_name || 'TNGSS Visitor',
      pass_type_id: getPassTypeId(data),
      upgrade: data.upgrade || false,

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

    const duration = Date.now() - startTime
    console.log(
      `TRANSFORM_SUCCESS: passId: ${data.pass_id}, duration: ${duration}ms, migrations: ${migrationNotes.length}`,
    )

    if (migrationNotes.length > 0) {
      console.log(
        `TRANSFORM_MIGRATIONS: passId: ${data.pass_id}, notes: ${transformedData.migration_notes}`,
      )
    }

    return transformedData
  } catch (error) {
    const duration = Date.now() - startTime
    console.error(
      `TRANSFORM_ERROR: passId: ${data.pass_id}, duration: ${duration}ms, error:`,
      error,
    )
    throw error
  }
}

// @ts-expect-error any
const validateApiToken = async (req) => {
  const startTime = Date.now()
  console.log('AUTH_START: Validating API token')

  try {
    const authHeader = req.headers.get('authorization')
    const apiKeyHeader = req.headers.get('x-api-key')
    const token = authHeader?.replace('Bearer ', '') || apiKeyHeader
    const tokenPrefix = token ? token.substring(0, 8) + '...' : 'none'

    console.log(`AUTH_CHECK: Token present: ${!!token}, prefix: ${tokenPrefix}`)

    if (!token) {
      console.log('AUTH_FAIL: No token provided')
      return {
        valid: false,
        error:
          'Missing API token. Provide either Authorization: Bearer <token> or X-API-Key: <token> header',
      }
    }

    const validTokens = process.env.ATTENDEE_API_TOKENS?.split(',') || []
    console.log(`AUTH_VALIDATE: Checking against ${validTokens.length} valid tokens`)

    if (validTokens.includes(token)) {
      const duration = Date.now() - startTime
      console.log(`AUTH_SUCCESS: Token validated in ${duration}ms, prefix: ${tokenPrefix}`)
      return { valid: true }
    }

    const duration = Date.now() - startTime
    console.log(`AUTH_FAIL: Invalid token in ${duration}ms, prefix: ${tokenPrefix}`)
    return { valid: false, error: 'Invalid API token' }
  } catch (error) {
    const duration = Date.now() - startTime
    console.error(`AUTH_ERROR: Validation failed in ${duration}ms, error:`, error)
    return { valid: false, error: 'Token validation error' }
  }
}

// Rate limiting helper
const rateLimitMap = new Map()
const checkRateLimit = (identifier: string, limit = 500, windowMs = 60000) => {
  const startTime = Date.now()

  try {
    const now = Date.now()
    const windowStart = now - windowMs

    if (!rateLimitMap.has(identifier)) {
      rateLimitMap.set(identifier, [])
    }

    const requests = rateLimitMap.get(identifier).filter((time: number) => time > windowStart)
    const currentCount = requests.length

    console.log(
      `RATE_LIMIT: identifier: ${identifier}, current: ${currentCount}/${limit}, window: ${windowMs}ms`,
    )

    if (requests.length >= limit) {
      const resetTime = windowStart + windowMs
      console.log(
        `RATE_LIMIT_EXCEEDED: identifier: ${identifier}, count: ${currentCount}, resetIn: ${resetTime - now}ms`,
      )
      return { allowed: false, resetTime }
    }

    requests.push(now)
    rateLimitMap.set(identifier, requests)

    const duration = Date.now() - startTime
    console.log(
      `RATE_LIMIT_OK: identifier: ${identifier}, newCount: ${requests.length}/${limit}, checkDuration: ${duration}ms`,
    )
    return { allowed: true }
  } catch (error) {
    const duration = Date.now() - startTime
    console.error(
      `RATE_LIMIT_ERROR: identifier: ${identifier}, duration: ${duration}ms, error:`,
      error,
    )
    return { allowed: true } // Fail open for rate limiting errors
  }
}

export const createAttendeePass: PayloadHandler = async (req) => {
  const requestId = `req_${Date.now()}_${Math.random()}`
  const startTime = Date.now()
  console.log(`API_REQUEST_START: ${requestId} - Single pass creation`)

  try {
    // 1. Validate API token first
    console.log(`${requestId}: Starting token validation`)
    const tokenValidation = await validateApiToken(req)
    if (!tokenValidation.valid) {
      const duration = Date.now() - startTime
      console.log(`API_REQUEST_FAIL: ${requestId} - Unauthorized in ${duration}ms`)
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
    const tokenPrefix = token ? token.substring(0, 8) + '...' : 'unknown'
    console.log(`${requestId}: Checking rate limits for token ${tokenPrefix}`)

    const rateCheck = checkRateLimit(`token:${token}`, 500, 60000)
    if (!rateCheck.allowed) {
      const duration = Date.now() - startTime
      console.log(
        `API_REQUEST_FAIL: ${requestId} - Rate limited in ${duration}ms, token: ${tokenPrefix}`,
      )
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

    console.log(`${requestId}: Parsing request data`)
    await addDataAndFileToRequest(req)

    const result = AttendeeSchema.safeParse(req.data)
    if (!result.success) {
      const duration = Date.now() - startTime
      const validationErrors = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`)
      console.log(
        `API_REQUEST_FAIL: ${requestId} - Validation failed in ${duration}ms, errors:`,
        validationErrors,
      )
      return Response.json(
        {
          success: false,
          error: 'Validation failed',
          details: validationErrors,
        },
        {
          status: 400,
          headers: headersWithCors({ headers: new Headers(), req }),
        },
      )
    }

    const passId = result.data.pass_id
    const email = result.data.email
    const isUpgrade = result.data.upgrade === true

    console.log(
      `${requestId}: Processing attendee - passId: ${passId}, email: ${email}, upgrade: ${isUpgrade}`,
    )

    if (isUpgrade) {
      console.log(`${requestId}: Starting upgrade process for email: ${email}`)

      const existingPasses = await req.payload.find({
        collection: 'attendee-passes',
        where: {
          email: { equals: email.toLowerCase() },
        },
        limit: 10,
      })

      console.log(
        `${requestId}: Found ${existingPasses.totalDocs} existing passes for email: ${email}`,
      )

      if (existingPasses.totalDocs === 0) {
        const duration = Date.now() - startTime
        console.log(
          `API_REQUEST_FAIL: ${requestId} - No existing pass for upgrade in ${duration}ms, email: ${email}`,
        )
        return Response.json(
          {
            success: false,
            error: 'No existing pass found for upgrade',
            message: `No pass found for email ${email}`,
          },
          {
            status: 404,
            headers: headersWithCors({ headers: new Headers(), req }),
          },
        )
      }

      const transformedData = transformAttendee(result.data)
      const passToUpgrade = existingPasses.docs[0]
      const oldPassId = passToUpgrade.pass_id
      const oldPassType = passToUpgrade.pass_type

      console.log(
        `${requestId}: Upgrading pass - oldPassId: ${oldPassId}, newPassId: ${passId}, oldType: ${oldPassType}, newType: ${transformedData.pass_type}`,
      )

      const upgradedPass = await req.payload.update({
        collection: 'attendee-passes',
        id: passToUpgrade.id,
        data: {
          pass_type: transformedData.pass_type,
          pass_type_id: transformedData.pass_type_id,
          upgrade: true,
          pass_id: transformedData.pass_id,
          name: transformedData.name || passToUpgrade.name,
          mobile: transformedData.mobile || passToUpgrade.mobile,
          designation: transformedData.designation || passToUpgrade.designation,
          organisation: transformedData.organisation || passToUpgrade.organisation,
          legacy_visitor_id: transformedData.legacy_visitor_id || passToUpgrade.legacy_visitor_id,
          legacy_created_at: transformedData.legacy_created_at || passToUpgrade.legacy_created_at,
          migration_notes: passToUpgrade.migration_notes
            ? `${passToUpgrade.migration_notes}; UPGRADED: ${oldPassType} → ${transformedData.pass_type} (${new Date().toISOString()})`
            : `UPGRADED: ${oldPassType} → ${transformedData.pass_type} (${new Date().toISOString()})`,
        },
        overrideAccess: true,
      })

      const duration = Date.now() - startTime
      console.log(
        `API_REQUEST_SUCCESS: ${requestId} - Pass upgraded in ${duration}ms - ${oldPassId} → ${passId} for ${email}, token: ${tokenPrefix}`,
      )

      return Response.json(
        {
          success: true,
          upgraded: true,
          data: {
            id: upgradedPass.id,
            pass_id: upgradedPass.pass_id,
            name: upgradedPass.name,
            old_pass_type: oldPassType,
            new_pass_type: upgradedPass.pass_type,
          },
        },
        {
          status: 200,
          headers: headersWithCors({ headers: new Headers(), req }),
        },
      )
    }

    // Normal pass creation
    console.log(`${requestId}: Checking for existing pass with ID: ${passId}`)
    const existing = await req.payload.find({
      collection: 'attendee-passes',
      where: { pass_id: { equals: passId } },
      limit: 1,
    })

    if (existing.totalDocs > 0) {
      const duration = Date.now() - startTime
      console.log(
        `API_REQUEST_FAIL: ${requestId} - Pass already exists in ${duration}ms, passId: ${passId}`,
      )
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

    console.log(`${requestId}: Creating new pass - passId: ${passId}`)
    const transformedData = transformAttendee(result.data)

    const attendee = await req.payload.create({
      collection: 'attendee-passes',
      // @ts-expect-error any
      data: transformedData,
      overrideAccess: true,
    })

    const duration = Date.now() - startTime
    console.log(
      `API_REQUEST_SUCCESS: ${requestId} - Pass created in ${duration}ms - passId: ${attendee.pass_id}, name: ${attendee.name}, token: ${tokenPrefix}`,
    )

    if (transformedData.migration_notes) {
      console.log(`${requestId}: Migration notes - ${transformedData.migration_notes}`)
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
    const duration = Date.now() - startTime
    console.error(`API_REQUEST_ERROR: ${requestId} - Failed in ${duration}ms, error:`, error)
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
  const requestId = `bulk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const startTime = Date.now()
  console.log(`API_BULK_START: ${requestId} - Bulk pass creation`)

  try {
    // 1. Validate API token
    console.log(`${requestId}: Starting token validation`)
    const tokenValidation = await validateApiToken(req)
    if (!tokenValidation.valid) {
      const duration = Date.now() - startTime
      console.log(`API_BULK_FAIL: ${requestId} - Unauthorized in ${duration}ms`)
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
    const tokenPrefix = token ? token.substring(0, 8) + '...' : 'unknown'
    console.log(`${requestId}: Checking bulk rate limits for token ${tokenPrefix}`)

    const rateCheck = checkRateLimit(`bulk:${token}`, 100, 60000)
    if (!rateCheck.allowed) {
      const duration = Date.now() - startTime
      console.log(
        `API_BULK_FAIL: ${requestId} - Rate limited in ${duration}ms, token: ${tokenPrefix}`,
      )
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

    console.log(`${requestId}: Parsing bulk request data`)
    await addDataAndFileToRequest(req)

    const result = BulkSchema.safeParse(req.data)
    if (!result.success) {
      const duration = Date.now() - startTime
      const validationErrors = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`)
      console.log(
        `API_BULK_FAIL: ${requestId} - Validation failed in ${duration}ms, errors:`,
        validationErrors,
      )
      return Response.json(
        {
          success: false,
          error: 'Validation failed',
          details: validationErrors,
        },
        {
          status: 400,
          headers: headersWithCors({ headers: new Headers(), req }),
        },
      )
    }

    const attendeeCount = result.data.attendees.length
    console.log(`${requestId}: Processing ${attendeeCount} attendees`)

    // Limit bulk size for security
    if (attendeeCount > 50) {
      const duration = Date.now() - startTime
      console.log(
        `API_BULK_FAIL: ${requestId} - Size exceeded in ${duration}ms, count: ${attendeeCount}`,
      )
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
    const upgraded = []
    const errors = []
    let processedCount = 0

    // Process each attendee with proper transformation and upgrade logic
    for (const attendee of result.data.attendees) {
      processedCount++
      const itemId = `${requestId}_item_${processedCount}`

      try {
        const isUpgrade = attendee.upgrade === true
        console.log(
          `${itemId}: Processing attendee ${processedCount}/${attendeeCount} - passId: ${attendee.pass_id}, email: ${attendee.email}, upgrade: ${isUpgrade}`,
        )

        if (isUpgrade) {
          // UPGRADE LOGIC
          const existingPasses = await req.payload.find({
            collection: 'attendee-passes',
            where: {
              email: { equals: attendee.email.toLowerCase() },
            },
            limit: 1,
          })

          console.log(`${itemId}: Found ${existingPasses.totalDocs} existing passes for upgrade`)

          if (existingPasses.totalDocs === 0) {
            console.log(`${itemId}: No existing pass found for upgrade`)
            errors.push({
              pass_id: attendee.pass_id,
              email: attendee.email,
              error: 'No existing pass found for upgrade',
            })
            continue
          }

          const transformedData = transformAttendee(attendee)
          const passToUpgrade = existingPasses.docs[0]
          const oldPassType = passToUpgrade.pass_type

          console.log(
            `${itemId}: Upgrading pass from ${oldPassType} to ${transformedData.pass_type}`,
          )

          const upgradedPass = await req.payload.update({
            collection: 'attendee-passes',
            id: passToUpgrade.id,
            data: {
              pass_type: transformedData.pass_type,
              pass_type_id: transformedData.pass_type_id,
              pass_id: transformedData.pass_id,
              name: transformedData.name || passToUpgrade.name,
              mobile: transformedData.mobile || passToUpgrade.mobile,
              designation: transformedData.designation || passToUpgrade.designation,
              organisation: transformedData.organisation || passToUpgrade.organisation,
              migration_notes: passToUpgrade.migration_notes
                ? `${passToUpgrade.migration_notes}; BULK UPGRADED: ${oldPassType} → ${transformedData.pass_type} (${new Date().toISOString()})`
                : `BULK UPGRADED: ${oldPassType} → ${transformedData.pass_type} (${new Date().toISOString()})`,
            },
            overrideAccess: true,
          })

          console.log(`${itemId}: Successfully upgraded pass`)
          upgraded.push({
            pass_id: upgradedPass.pass_id,
            email: upgradedPass.email,
            name: upgradedPass.name,
            old_pass_type: oldPassType,
            new_pass_type: upgradedPass.pass_type,
          })
        } else {
          // NORMAL CREATION LOGIC
          console.log(`${itemId}: Checking for duplicate pass`)
          const existing = await req.payload.find({
            collection: 'attendee-passes',
            where: { pass_id: { equals: attendee.pass_id } },
            limit: 1,
          })

          if (existing.totalDocs > 0) {
            console.log(`${itemId}: Pass already exists`)
            errors.push({ pass_id: attendee.pass_id, error: 'Already exists' })
            continue
          }

          console.log(`${itemId}: Creating new pass`)
          const transformedData = transformAttendee(attendee)

          const newAttendee = await req.payload.create({
            collection: 'attendee-passes',
            // @ts-expect-error any
            data: transformedData,
            overrideAccess: true,
          })

          console.log(`${itemId}: Successfully created pass`)
          created.push({
            pass_id: newAttendee.pass_id,
            name: newAttendee.name,
            migration_notes: transformedData.migration_notes || undefined,
          })
        }
      } catch (error) {
        console.error(`${itemId}: Processing failed, error:`, error)
        errors.push({
          pass_id: attendee.pass_id,
          email: attendee.email,
          // @ts-expect-error not yet
          error: error.message || 'Processing failed',
        })
      }
    }

    const duration = Date.now() - startTime
    const successCount = created.length + upgraded.length
    const totalProcessed = created.length + upgraded.length + errors.length

    console.log(
      `API_BULK_COMPLETE: ${requestId} - Processed ${totalProcessed}/${attendeeCount} in ${duration}ms`,
    )
    console.log(
      `API_BULK_STATS: ${requestId} - Created: ${created.length}, Upgraded: ${upgraded.length}, Errors: ${errors.length}, Token: ${tokenPrefix}`,
    )

    // Log detailed error summary if there are errors
    if (errors.length > 0) {
      const errorSummary = errors.reduce(
        (acc, error) => {
          acc[error.error] = (acc[error.error] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )
      console.log(`API_BULK_ERROR_SUMMARY: ${requestId}`, errorSummary)
    }

    // Log migration notes summary
    const migrationsCount = created.filter((c) => c.migration_notes).length
    if (migrationsCount > 0) {
      console.log(
        `API_BULK_MIGRATIONS: ${requestId} - ${migrationsCount}/${created.length} created passes had data migrations`,
      )
    }

    return Response.json(
      {
        success: successCount > 0,
        message: `Created: ${created.length}, Upgraded: ${upgraded.length}, Failed: ${errors.length}`,
        data: {
          created,
          upgraded,
          errors,
          total: attendeeCount,
          processed: totalProcessed,
          duration_ms: duration,
        },
      },
      {
        status: errors.length > 0 ? 207 : upgraded.length > 0 ? 200 : 201,
        headers: headersWithCors({ headers: new Headers(), req }),
      },
    )
  } catch (error) {
    const duration = Date.now() - startTime
    console.error(`API_BULK_ERROR: ${requestId} - Failed in ${duration}ms, error:`, error)
    return Response.json(
      {
        success: false,
        error: 'Internal server error',
        duration_ms: duration,
      },
      {
        status: 500,
        headers: headersWithCors({ headers: new Headers(), req }),
      },
    )
  }
}
