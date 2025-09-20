import { Event } from '@/payload-types'
import type { PayloadHandler } from 'payload'
import { headersWithCors } from 'payload'
import { buildMainEventWhereClause } from './utils/whereClause'
import { parseMainEventParams } from './utils/parsers'
import { hasAnyFilters } from './utils/validators'
import { EventListParams, EventListQueryParams } from './types'

export const getMainEventsList: PayloadHandler = async (req) => {
  try {
    const params = parseEventListParams(req.query)

    const whereClause = buildMainEventWhereClause(params)

    const events = await req.payload.find({
      collection: 'events',
      where: whereClause,
      limit: params.limit,
      page: params.page,
      sort: getSortField(params.sort),
      depth: 2,
    })

    let filteredDocs = events.docs
    if (params.timeStart || params.timeEnd) {
      filteredDocs = events.docs.filter((event) => {
        if (!event.schedule?.from_date) return false

        const eventTime = new Date(event.schedule.from_date).toTimeString().slice(0, 5)

        if (params.timeStart && eventTime < params.timeStart) return false
        if (params.timeEnd && eventTime > params.timeEnd) return false

        return true
      })
    }

    const formattedEvents = filteredDocs.map(formatEventForList)

    const response = {
      status: 200,
      message: 'Events retrieved successfully',
      events: formattedEvents,
      pagination: {
        page: events.page,
        limit: events.limit,
        totalPages: events.totalPages,
        totalDocs: events.totalDocs,
        hasNextPage: events.hasNextPage,
        hasPrevPage: events.hasPrevPage,
        nextPage: events.nextPage,
        prevPage: events.prevPage,
      },
      meta: {
        applied_filters: getAppliedFilters(params),
        result_count: formattedEvents.length,
        event_type: 'main_event',
        sort_by: params.sort,
        has_filters: hasAnyFilters(params),
      },
    }

    return Response.json(response, {
      headers: headersWithCors({ headers: new Headers(), req }),
    })
  } catch (error) {
    console.error('Error fetching events list:', error)
    return Response.json(
      { error: 'Failed to fetch events list' },
      { status: 500, headers: headersWithCors({ headers: new Headers(), req }) },
    )
  }
}

const parseEventListParams = (query: EventListQueryParams): EventListParams => {
  const baseParams = parseMainEventParams(query)

  return {
    ...baseParams,
    page: parseInt(query.page || '1'),
    limit: Math.min(parseInt(query.limit || '20'), 10),
    sort: query.sort || 'date_asc',
  }
}

const getSortField = (sort: string): string => {
  const sortMap: { [key: string]: string } = {
    date_asc: 'schedule.from_date',
    date_desc: '-schedule.from_date',
    title_asc: 'title',
    title_desc: '-title',
    created_asc: 'createdAt',
    created_desc: '-createdAt',
  }

  return sortMap[sort] || 'schedule.from_date'
}

const formatEventForList = (event: Event) => {
  return {
    id: event.id,
    slug: event.slug,
    title: event.title,
    about: event.about,
    banner_image: event.banner_image,
    schedule: {
      from_date: event.schedule?.from_date,
      to_date: event.schedule?.to_date,
      formatted_time: formatEventTime(event.schedule?.from_date, event.schedule?.to_date),
      formatted_date: formatEventDate(event.schedule?.from_date),
    },
    location: {
      zone:
        typeof event.zone === 'object'
          ? {
              slug: event.zone?.slug,
              name: event.zone?.name,
            }
          : null,
      hall:
        typeof event.hall === 'object'
          ? {
              slug: event.hall?.slug,
              name: event.hall?.name,
            }
          : null,
    },
    format:
      typeof event.format === 'object'
        ? {
            slug: event.format?.slug,
            name: event.format?.name,
          }
        : null,
    tags: Array.isArray(event.tags)
      ? event.tags
          .map((tag) =>
            typeof tag === 'object'
              ? {
                  slug: tag?.slug,
                  name: tag?.name,
                }
              : null,
          )
          .filter(Boolean)
      : [],
    access_level:
      typeof event.access_level === 'object'
        ? {
            slug: event.access_level?.slug,
            name: event.access_level?.name,
          }
        : null,
    registration: {
      mode: event.registeration_mode,
      current_count: event.current_registerations || 0,
    },
    speakers: Array.isArray(event.speakers)
      ? event.speakers
          .map((speaker) =>
            typeof speaker.speaker === 'object'
              ? {
                  id: speaker.speaker?.id,
                  name: speaker.speaker?.name,
                }
              : null,
          )
          .filter(Boolean)
      : [],
    is_public: event.isPublic || false,
  }
}

const formatEventTime = (fromDate?: string, toDate?: string): string => {
  if (!fromDate) return ''

  const start = new Date(fromDate)
  const startTime = start.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  if (!toDate) return startTime

  const end = new Date(toDate)
  const endTime = end.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  return `${startTime} - ${endTime}`
}

const formatEventDate = (fromDate?: string): string => {
  if (!fromDate) return ''

  const date = new Date(fromDate)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const getAppliedFilters = (params: EventListParams) => {
  const applied = {}

  const filterKeys = [
    'publicOnly',
    'dates',
    'zones',
    'halls',
    'formats',
    'tags',
    'accessLevels',
    'timeStart',
    'timeEnd',
  ]

  filterKeys.forEach((key) => {
    const value = params[key as keyof EventListParams]
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value) && value.length > 0) {
        // @ts-expect-error any
        applied[key] = value
      } else if (!Array.isArray(value)) {
        // @ts-expect-error any
        applied[key] = value
      }
    }
  })

  return applied
}
