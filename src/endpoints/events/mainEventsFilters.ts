import { Event } from '@/payload-types'
import type { PayloadHandler, Where, Payload } from 'payload'
import { headersWithCors } from 'payload'

interface MainEventQueryParams {
  public_only?: string
  dates?: string | string[]
  zones?: string | string[]
  halls?: string | string[]
  formats?: string | string[]
  tags?: string | string[]
  access_levels?: string[]
  registeration_modes?: string[]
  time_start?: string
  time_end?: string
}

interface MainEventFilterParams {
  publicOnly?: boolean
  dates?: string[]
  zones?: string[]
  halls?: string[]
  formats?: string[]
  tags?: string[]
  accessLevels?: string[]
  registerationModes?: string[]
  timeStart?: string
  timeEnd?: string
}

interface ZoneOption {
  slug?: string | null | undefined
  name?: string
}

interface TimeRange {
  earliest: string
  latest: string
  events_by_hour: { [hour: string]: number }
}

interface AllDateAndZones {
  dates: string[]
  zones: ZoneOption[]
  totalEvents: number
  timeRange: TimeRange
}

const hasAnyFilters = (params: MainEventFilterParams): boolean => {
  return !!(
    params.dates?.length ||
    params.zones?.length ||
    params.halls?.length ||
    params.formats?.length ||
    params.tags?.length ||
    params.accessLevels?.length ||
    params.registerationModes?.length ||
    params.timeStart ||
    params.timeEnd ||
    params.publicOnly
  )
}

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

const calculateTimeRangeFromEvents = (events: Event[]): TimeRange => {
  if (events.length === 0) {
    return {
      earliest: '',
      latest: '',
      events_by_hour: {},
    }
  }

  const times = events
    .map((event) => event?.schedule?.from_date)
    .filter(Boolean)
    .map((time) => new Date(time))
    .sort((a, b) => a.getTime() - b.getTime())

  if (times.length === 0) {
    return {
      earliest: '',
      latest: '',
      events_by_hour: {},
    }
  }

  const earliest = times[0].toISOString()
  const latest = times[times.length - 1].toISOString()

  const events_by_hour: { [hour: string]: number } = {}

  times.forEach((time) => {
    const hour = time.toISOString().substring(0, 13) + ':00:00.000Z'
    events_by_hour[hour] = (events_by_hour[hour] || 0) + 1
  })

  return {
    earliest,
    latest,
    events_by_hour,
  }
}

const formatDateName = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

const getFormatsBySlugs = async (slugs: string[], payload: Payload) => {
  if (slugs.length === 0) return []

  const result = await payload.find({
    collection: 'event-formats',
    where: { slug: { in: slugs } },
    limit: slugs.length,
  })

  return result.docs.map((r) => ({ slug: r.slug, name: r.name }))
}

const getTagsBySlugs = async (slugs: string[], payload: Payload) => {
  if (slugs.length === 0) return []

  const result = await payload.find({
    collection: 'tags',
    where: { slug: { in: slugs } },
    limit: slugs.length,
  })

  return result.docs.map((r) => ({ slug: r.slug, name: r.name }))
}

const getHallsBySlugs = async (slugs: string[], payload: Payload) => {
  if (slugs.length === 0) return []

  const result = await payload.find({
    collection: 'halls',
    where: { slug: { in: slugs } },
    limit: slugs.length,
  })

  return result.docs.map((r) => ({ slug: r.slug, name: r.name }))
}

const getAccessLevelsBySlugs = async (slugs: string[], payload: Payload) => {
  if (slugs.length === 0) return []

  const result = await payload.find({
    collection: 'ticket-types',
    where: { slug: { in: slugs } },
    limit: slugs.length,
  })

  return result.docs.map((r) => ({ slug: r.slug, name: r.name }))
}

const extractRelationshipSlugs = (events: Event[]) => {
  const slugs = {
    formatSlugs: new Set<string>(),
    tagSlugs: new Set<string>(),
    hallSlugs: new Set<string>(),
    accessLevelSlugs: new Set<string>(),
  }

  events.forEach((event) => {
    const format = event.format
    if (typeof format === 'object' && format?.slug) {
      slugs.formatSlugs.add(format.slug)
    }

    if (Array.isArray(event.tags)) {
      event.tags.forEach((tag) => {
        if (typeof tag === 'object' && tag?.slug) {
          slugs.tagSlugs.add(tag.slug)
        }
      })
    }

    const hall = event.hall
    if (typeof hall === 'object' && hall?.slug) {
      slugs.hallSlugs.add(hall.slug)
    }

    const accessLevel = event.access_level
    if (typeof accessLevel === 'object' && accessLevel?.slug) {
      slugs.accessLevelSlugs.add(accessLevel.slug)
    }
  })

  return {
    formatSlugs: Array.from(slugs.formatSlugs),
    tagSlugs: Array.from(slugs.tagSlugs),
    hallSlugs: Array.from(slugs.hallSlugs),
    accessLevelSlugs: Array.from(slugs.accessLevelSlugs),
  }
}

const buildMainEventWhereClause = (params: MainEventFilterParams) => {
  const whereClause: Where = {
    main_or_partner: { equals: 'main_event' },
    deleted: { not_equals: true },
  }

  if (params.publicOnly) {
    whereClause.isPublic = { equals: true }
  }

  if (params.dates?.length && !params.dates.includes('all')) {
    whereClause.or = params.dates.map((date) => ({
      'schedule.from_date': {
        greater_than_equal: `${date}T00:00:00.000Z`,
        less_than: `${date}T23:59:59.999Z`,
      },
    }))
  }

  if (params.zones?.length && !params.zones.includes('all')) {
    whereClause['zone.slug'] = { in: params.zones }
  }

  if (params.halls?.length) {
    whereClause['hall.slug'] = { in: params.halls }
  }

  if (params.formats?.length) {
    whereClause['format.slug'] = { in: params.formats }
  }

  if (params.tags?.length) {
    whereClause['tags.slug'] = { in: params.tags }
  }

  if (params.accessLevels?.length) {
    whereClause['access_level.slug'] = { in: params.accessLevels }
  }

  if (params.timeStart || params.timeEnd) {
    const timeConditions = []

    if (params.timeStart && params.timeEnd) {
      timeConditions.push({
        and: [
          { 'schedule.from_date': { greater_than_equal: params.timeStart } },
          { 'schedule.from_date': { less_than_equal: params.timeEnd } },
        ],
      })
    } else if (params.timeStart) {
      timeConditions.push({
        'schedule.from_date': { greater_than_equal: params.timeStart },
      })
    } else if (params.timeEnd) {
      timeConditions.push({
        'schedule.from_date': { less_than_equal: params.timeEnd },
      })
    }

    if (timeConditions.length > 0) {
      whereClause.and = [...(whereClause.and || []), ...timeConditions]
    }
  }

  return whereClause
}

const getAllDatesAndZones = async (
  payload: Payload,
  publicOnly: boolean | undefined,
): Promise<AllDateAndZones> => {
  const whereClause: Where = {
    main_or_partner: { equals: 'main_event' },
    deleted: { not_equals: true },
    ...(publicOnly && { isPublic: { equals: true } }),
  }

  const allEvents = await payload.find({
    collection: 'events',
    limit: 1000,
    where: whereClause,
  })

  const dates = [
    ...new Set(
      allEvents.docs
        .map((event) => event?.schedule?.from_date)
        .filter(Boolean)
        .map((date: string) => new Date(date).toISOString().split('T')[0]),
    ),
  ]

  const zoneSlugs = [
    ...new Set(
      allEvents.docs.map((event) => {
        const zone = event.zone
        return typeof zone === 'object' ? zone?.slug : zone
      }),
    ),
  ]

  let zones: ZoneOption[] = []

  if (zoneSlugs.length > 0) {
    const zonesData = await payload.find({
      collection: 'zones',
      where: {
        slug: { in: zoneSlugs },
        is_featured: { equals: true },
      },
      limit: zoneSlugs.length,
    })

    zones = zonesData.docs
      .map((zone) => ({
        slug: zone.slug,
        name: zone.name,
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }

  const timeRange = calculateTimeRangeFromEvents(allEvents.docs)

  return {
    dates,
    zones,
    totalEvents: allEvents.totalDocs,
    timeRange,
  }
}

const parseMainEventParams = (query: MainEventQueryParams): MainEventFilterParams => {
  return {
    publicOnly: query.public_only === 'true',
    dates: parseArrayParam(query.dates),
    zones: parseArrayParam(query.zones),
    halls: parseArrayParam(query.halls),
    formats: parseArrayParam(query.formats),
    tags: parseArrayParam(query.tags),
    accessLevels: parseArrayParam(query.access_levels),
    timeStart: query.time_start,
    timeEnd: query.time_end,
  }
}

const parseArrayParam = (param: string | string[] | undefined): string[] | undefined => {
  if (!param) return undefined
  return Array.isArray(param) ? param : param.split(',').map((p) => p.trim())
}
