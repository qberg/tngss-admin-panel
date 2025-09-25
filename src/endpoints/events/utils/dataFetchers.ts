import { Payload, Where } from 'payload'
import { AllDateAndZones, ZoneOption } from '../types'
import { calculateTimeRangeFromEvents } from './extractors'

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

  let zones: ZoneOption[] = []

  {
    /* 
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
        // @ts-expect-error any
        hall: zone.hall?.name || '',
        content: zone.description || '',
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }
  */
  }

  {
    /*get all zone slugs*/
  }

  const zonesData = await payload.find({
    collection: 'zones',
    where: {
      is_featured: { equals: true },
    },
    limit: 0,
  })

  zones = zonesData.docs
    .map((zone) => ({
      slug: zone.slug,
      name: zone.name,
      // @ts-expect-error any
      hall: zone.hall?.name || '',
      content: zone.description || '',
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  const timeRange = calculateTimeRangeFromEvents(allEvents.docs)

  return {
    dates,
    zones,
    totalEvents: allEvents.totalDocs,
    timeRange,
  }
}

export { getAllDatesAndZones }
