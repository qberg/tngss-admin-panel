import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ registrationId: string }> },
) {
  let registrationId: string | undefined

  try {
    const resolvedParams = await params
    registrationId = resolvedParams.registrationId

    if (!registrationId || typeof registrationId !== 'string') {
      return NextResponse.json({ error: 'Valid registration ID is required' }, { status: 400 })
    }

    const bearerToken = process.env.TNGSS_API_BEARER_TOKEN
    if (!bearerToken) {
      console.error('Missing TNGSS_API_BEARER_TOKEN environment variable')
      return NextResponse.json({ error: 'API configuration error' }, { status: 500 })
    }

    const body = await request.json()

    if (!body.status || !['approved', 'rejected'].includes(body.status)) {
      return NextResponse.json(
        { error: 'Status must be either "approved" or "rejected"' },
        { status: 400 },
      )
    }

    console.log(`[API] Updating registration ${registrationId} status to: ${body.status}`)

    const response = await fetch(
      'https://tngss.startuptn.in/event-service/v2/event/registration-status/update',
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'TNGSS-Admin-Panel/1.0',
        },
        body: JSON.stringify({
          _id: registrationId,
          status: body.status,
        }),
        signal: AbortSignal.timeout(10000),
      },
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error(
        `[API] External API error: ${response.status} ${response.statusText}`,
        errorText,
      )
      return NextResponse.json(
        {
          error: `External API returned ${response.status}`,
          details: response.statusText,
        },
        { status: response.status === 404 ? 404 : 502 },
      )
    }

    const data = await response.json()

    console.log(`[API] Successfully updated registration ${registrationId} to ${body.status}`)

    return NextResponse.json({
      success: true,
      message: `Registration ${body.status} successfully`,
      data,
    })
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error(`[API] Request timeout for registration: ${registrationId}`)
        return NextResponse.json(
          { error: 'Request timeout - external API took too long to respond' },
          { status: 504 },
        )
      }
      console.error('[API] Error updating registration status:', error.message)
      return NextResponse.json(
        {
          error: 'Failed to update registration status',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        },
        { status: 500 },
      )
    }

    console.error('[API] Unknown error:', error)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}
