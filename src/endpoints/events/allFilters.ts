import type { PayloadHandler, Payload } from 'payload'
import { headersWithCors } from 'payload'
import { calculateTimeRangeFromEvents } from './utils/extractors'

export const getAllEventsFilters: PayloadHandler = async (req) => {
  try {
    const response = await fetchAllFilterOptions(req.payload)
    return Response.json(response, {
      headers: headersWithCors({ headers: new Headers(), req }),
    })
  } catch (error) {
    console.error('Error fetching filter options:', error)
    return Response.json(
      { error: 'Failed to fetch filter options' },
      { status: 500, headers: headersWithCors({ headers: new Headers(), req }) },
    )
  }
}

const fetchAllFilterOptions = async (payload: Payload) => {
  const [events, allFormats, allTags, allHalls, allZones, allAccessLevels] = await Promise.all([
    payload.find({
      collection: 'events',
      limit: 0,
      select: {
        schedule: true,
        zone: true,
      },
    }),
    payload.find({
      collection: 'event-formats',
      limit: 0,
      select: { slug: true, name: true },
    }),
    payload.find({
      collection: 'tags',
      limit: 0,
      select: { slug: true, name: true },
    }),
    payload.find({
      collection: 'halls',
      limit: 0,
      select: { slug: true, name: true },
    }),
    payload.find({
      collection: 'zones',
      limit: 0,
      where: {
        is_featured: { equals: true },
      },
      select: { slug: true, name: true, description: true, hall: true },
    }),
    payload.find({
      collection: 'ticket-types',
      limit: 0,
      select: { slug: true, name: true },
    }),
  ])

  const formats = allFormats.docs
    .map((format) => ({
      slug: format.slug,
      name: format.name,
    }))
    // @ts-expect-error any
    .sort((a, b) => a.name.localeCompare(b.name))

  const tags = allTags.docs
    .map((tag) => ({
      slug: tag.slug,
      name: tag.name,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  const halls = allHalls.docs
    .map((hall) => ({
      slug: hall.slug,
      name: hall.name,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  const zones = allZones.docs
    .map((zone) => ({
      slug: zone.slug,
      name: zone.name,
      // @ts-expect-error any
      hall: zone.hall?.name || '',
      content: zone.description || '',
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  const accessLevels = allAccessLevels.docs
    .map((level) => ({
      slug: level.slug,
      name: level.name,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  const timeRange = calculateTimeRangeFromEvents(events.docs)

  return {
    status: 200,
    message: 'Options for filters fetched',
    available: {
      dates: [
        { slug: 'all', name: 'All Dates' },
        { slug: '2025-10-09', name: '09 Oct, 2025' },
        { slug: '2025-10-10', name: '10 Oct, 2025' },
      ],
      zones: [{ slug: 'all', name: 'All Zones', hall: '', content: '' }, ...zones],
      formats: formats,
      tags: tags,
      halls: halls,
      access_levels: accessLevels,
      time_range: timeRange,
    },
  }
}
