import type { PayloadHandler } from 'payload'
import { headersWithCors } from 'payload'

export const getAvailableDates: PayloadHandler = async (req) => {
  try {
    const events = await req.payload.find({
      collection: 'events',
      select: {
        schedule: true,
        title: true,
        id: true,
      },
      limit: 1000,
      where: {
        ...(req.query?.publicOnly === 'true' && {
          isPublic: { equals: true },
        }),
      },
    })

    const allDates = events.docs
      .map((event) => event.schedule?.from_date)
      .filter((date) => date)
      .map((date) => {
        try {
          return new Date(date).toISOString().split('T')[0]
        } catch {
          return null
        }
      })
      .filter((date) => date)

    const uniqueDates = [...new Set(allDates)].sort()

    const datesWithCounts = uniqueDates.map((date) => {
      const eventsOnDate = events.docs.filter((event) => {
        if (!event.schedule?.from_date) return false
        const eventDate = new Date(event.schedule.from_date).toISOString().split('T')[0]
        return eventDate === date
      })

      return {
        date,
        eventCount: eventsOnDate.length,
        events: eventsOnDate.map((event) => ({
          id: event.id,
          title: event.title,
          startTime: event.schedule?.from_date,
          endTime: event.schedule?.to_date,
        })),
      }
    })

    return Response.json(
      {
        dates: uniqueDates,
        datesWithDetails: datesWithCounts,
        totalUniqueDates: uniqueDates.length,
        totalEvents: events.totalDocs,
      },
      {
        headers: headersWithCors({
          headers: new Headers(),
          req,
        }),
      },
    )
  } catch (error) {
    console.error('Error fetching available dates:', error)
    return Response.json(
      { error: 'Failed to fetch available dates' },
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
