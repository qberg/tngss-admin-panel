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

  gender: z.enum(['male', 'female', 'other']).optional(),
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

// Rate limiting helper (optional)
const rateLimitMap = new Map()
const checkRateLimit = (identifier: string, limit = 100, windowMs = 60000) => {
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

// @ts-expect-error not yet
const transformAttendee = (data) => {
  const pass = data.pass_data || {}
  const visitor = data.visitor_data || {}

  return {
    pass_id: data.pass_id,
    pass_type: data.conference_name,
    name: pass.name || data.name,
    email: (pass.email || data.email).toLowerCase(),
    mobile: pass.mobile || data.mobile,
    legacy_visitor_id: data.visitor_id,
    gender: pass.gender || data.gender,
    designation: pass.designation || data.designation,
    organisation: pass.organisation || data.organisation,
    registration_city: visitor.city || data.city,
    registration_state: visitor.state || data.state,
    registration_country: visitor.country || data.country,
    registration_email: visitor.email || pass.email,
    organisation_type: visitor.organisationType || 'startup',
    profile_type: visitor.profileType || 'corporates',
    sector_interested: visitor.sectorIntrested || 'sector_agnostic',
    website: visitor.website || '',
    why_attending: visitor.whyAttend || visitor.whyAttending || 'funding',
    checked_in: !!data.checkin_data,
    legacy_created_at: data.pass_created_at,
  }
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

    // 2. Optional: Rate limiting per token
    const token =
      req.headers.get('authorization')?.replace('Bearer ', '') || req.headers.get('x-api-key')
    const rateCheck = checkRateLimit(`token:${token}`, 50, 60000) // 50 requests per minute
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

    const attendee = await req.payload.create({
      collection: 'attendee-passes',
      data: transformAttendee(result.data),
      overrideAccess: true,
    })

    // Optional: Log API usage for monitoring
    console.log(
      `API: Created attendee pass ${attendee.pass_id} via token ${token?.substring(0, 8)}...`,
    )

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
    const rateCheck = checkRateLimit(`bulk:${token}`, 5, 60000) // 5 bulk requests per minute
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

    // Process each attendee
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

        const newAttendee = await req.payload.create({
          collection: 'attendee-passes',
          data: transformAttendee(attendee),
          overrideAccess: true,
        })

        created.push({ pass_id: newAttendee.pass_id, name: newAttendee.name })
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
