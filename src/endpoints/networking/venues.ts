import type { PayloadHandler } from 'payload'
import { headersWithCors } from 'payload'

export const getNetworkingVenues: PayloadHandler = async (req) => {
  try {
    const eventType = req.query?.type as string

    if (!eventType || !['main_event', 'partner_event'].includes(eventType)) {
      return Response.json(
        { error: 'Invalid or missing event type. Use ?type=main_event or ?type=partner_event' },
        {
          status: 400,
          headers: headersWithCors({
            headers: new Headers(),
            req,
          }),
        },
      )
    }

    const sessions = await req.payload.find({
      collection: 'networking-sessions',
      where: {
        and: [{ main_or_partner: { equals: eventType } }, { isPublic: { equals: true } }],
      },
      depth: 2,
      limit: 1000,
    })

    const venues = {}

    sessions.docs.forEach((session) => {
      const displayName = session.display_name

      if (eventType === 'main_event' && session.main_event_sessions_config) {
        const config = session.main_event_sessions_config
        // @ts-expect-error any
        venues[displayName] = {
          id: session.id,
          start_time: config.start_time,
          end_time: config.end_time,
          meeting_duration: config.meeting_duration,
          concurrent_meetings: config.concurrent_meetings,
          allowed_ticket_types: config.allowed_ticket_types,
        }
      } else if (eventType === 'partner_event' && session.partner_event_sessions_config) {
        const config = session.partner_event_sessions_config
        // @ts-expect-error any
        venues[displayName] = {
          id: session.id,
          event_date: config.event_date,
          default_meeting_duration: config.default_meeting_duration,
          earliest_start: config.allowed_time_range?.earliest_start,
          latest_start: config.allowed_time_range?.latest_start,
          venue_name: config.venue_name,
          city_id: config.city,
        }
      }
    })

    return Response.json(
      {
        event_type: eventType,
        venues,
        meta: {
          total_venues: Object.keys(venues).length,
          total_sessions: sessions.totalDocs,
        },
      },
      {
        headers: headersWithCors({
          headers: new Headers(),
          req,
        }),
      },
    )
  } catch (error) {
    console.error('Error fetching networking venues:', error)
    return Response.json(
      { error: 'Failed to fetch networking venues' },
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
