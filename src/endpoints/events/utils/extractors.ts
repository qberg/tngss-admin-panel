import { Event } from '@/payload-types'
import { TimeRange } from '../types'

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

export { calculateTimeRangeFromEvents, extractRelationshipSlugs }
