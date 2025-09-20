import { Where } from 'payload'
import { MainEventFilterParams } from '../types'

export const buildMainEventWhereClause = (params: MainEventFilterParams) => {
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
