import { Event } from '@/payload-types'
import type { PayloadHandler, Payload } from 'payload'
import { headersWithCors } from 'payload'
import { AllDateAndZones, MainEventFilterParams } from './types'
import { buildMainEventWhereClause } from './utils/whereClause'
import {
  getAccessLevelsBySlugs,
  getFormatsBySlugs,
  getHallsBySlugs,
  getTagsBySlugs,
} from './utils/collections'
import { parseMainEventParams } from './utils/parsers'
import { formatDateName } from './utils/formatters'
import { calculateTimeRangeFromEvents, extractRelationshipSlugs } from './utils/extractors'
import { getAllDatesAndZones } from './utils/dataFetchers'
import { hasAnyFilters } from './utils/validators'

export const getMainEventsFilters: PayloadHandler = async (req) => {
  try {
    const params = parseMainEventParams(req.query)

    const allDatesAndZones = await getAllDatesAndZones(req.payload, params.publicOnly)

    const whereClause = buildMainEventWhereClause(params)

    const filteredEvents = await req.payload.find({
      collection: 'events',
      limit: 1000,
      where: whereClause,
    })

    const response = await buildCompleteResponse(
      filteredEvents.docs,
      params,
      req.payload,
      allDatesAndZones,
    )

    return Response.json(response, {
      headers: headersWithCors({ headers: new Headers(), req }),
    })
  } catch (error) {
    console.error('Error fetching main event filter:', error)
    return Response.json(
      { error: 'Failed to fetch main event filter options' },
      { status: 500, headers: headersWithCors({ headers: new Headers(), req }) },
    )
  }
}

const buildCompleteResponse = async (
  filteredEvents: Event[],
  params: MainEventFilterParams,
  payload: Payload,
  allDatesAndZones: AllDateAndZones,
) => {
  const relationshipSlugs = extractRelationshipSlugs(filteredEvents)

  const [formats, tags, halls, accessLevels] = await Promise.all([
    getFormatsBySlugs(relationshipSlugs.formatSlugs, payload),
    getTagsBySlugs(relationshipSlugs.tagSlugs, payload),
    getHallsBySlugs(relationshipSlugs.hallSlugs, payload),
    getAccessLevelsBySlugs(relationshipSlugs.accessLevelSlugs, payload),
  ])

  const filteredTimeRange = calculateTimeRangeFromEvents(filteredEvents)

  return {
    status: 200,
    message: 'Options for filters fetched',
    available: {
      dates: [
        { slug: 'all', name: 'All Dates' },
        ...allDatesAndZones.dates.map((date: string) => ({
          slug: date,
          name: formatDateName(date),
        })),
      ],
      zones: [{ slug: 'all', name: 'All Zones' }, ...allDatesAndZones.zones],
      formats,
      tags,
      halls,
      access_levels: accessLevels,
      time_range: {
        all_events: allDatesAndZones.timeRange,
        filtered_events: filteredTimeRange,
      },
    },
    applied: params,
    meta: {
      filtered_events: filteredEvents.length,
      all_events: allDatesAndZones.totalEvents,
      event_type: 'main_event',
      has_filters: hasAnyFilters(params),
    },
  }
}
