import { ExternalAPIResponse } from '@/types/events'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(_: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
  let eventId: string | undefined

  try {
    const resolvedParams = await params
    eventId = resolvedParams.eventId

    if (!eventId || typeof eventId !== 'string') {
      return NextResponse.json({ error: 'Valid event ID is required' }, { status: 400 })
    }

    const bearerToken = process.env.TNGSS_API_BEARER_TOKEN

    if (!bearerToken) {
      console.error('Missing TNGSS_API_BEARER_TOKEN environment variable')
      return NextResponse.json({ error: 'API configuration error' }, { status: 500 })
    }

    const externalApiUrl = `https://tngss.startuptn.in/event-service/v2/event/user-registrations/list_new?event_id=${eventId}`

    console.log(`[API] Fetching registrations for event: ${eventId}`)

    const response = await fetch(externalApiUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'TNGSS-Admin-Panel/1.0',
      },
      signal: AbortSignal.timeout(10000),
    })

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

    const data: ExternalAPIResponse = await response.json()

    if (!data || typeof data.statusCode !== 'number') {
      console.error('[API] Invalid response format from external API')
      return NextResponse.json({ error: 'Invalid response from external service' }, { status: 502 })
    }

    console.log(
      `[API] Successfully fetched ${data.data?.length || 0} registrations for event ${eventId}`,
    )

    if (!data || typeof data.statusCode !== 'number') {
      console.error('[API] Invalid response format from external API')
      return NextResponse.json({ error: 'Invalid response from external service' }, { status: 502 })
    }

    console.log(
      `[API] Successfully fetched ${data.data?.length || 0} registrations for event ${eventId}`,
    )

    return NextResponse.json(data)
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error(`[API] Request timeout for event: ${eventId}`)
        return NextResponse.json(
          { error: 'Request timeout - external API took too long to respond' },
          { status: 504 },
        )
      }

      console.error('[API] Error:', error.message)
      return NextResponse.json(
        {
          error: 'Failed to fetch registrations',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        },
        { status: 500 },
      )
    }

    console.error('[API] Unknown error:', error)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}
