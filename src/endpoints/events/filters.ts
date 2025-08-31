import type { PayloadHandler } from 'payload'
import { headersWithCors } from 'payload'

export const getEventsFilters: PayloadHandler = async (req) => {
  try {
    const events = await req.payload.find({
      collection: 'events',
      limit: 1000,
      where: {
        ...(req.query?.publicOnly === 'true' && {
          isPublic: { equals: true },
        }),
      },
    })

    const dateTimeMap: Record<string, { startTimes: string[]; endTimes: string[] }> = {}

    events.docs.forEach((event) => {
      if (event.schedule?.from_date) {
        try {
          const fromDate = new Date(event.schedule.from_date)
          const dateKey = fromDate.toISOString().split('T')[0] // YYYY-MM-DD
          const startTime = fromDate.toTimeString().slice(0, 5) // HH:MM

          if (!dateTimeMap[dateKey]) {
            dateTimeMap[dateKey] = { startTimes: [], endTimes: [] }
          }

          if (!dateTimeMap[dateKey].startTimes.includes(startTime)) {
            dateTimeMap[dateKey].startTimes.push(startTime)
          }
        } catch (error) {
          console.warn('Invalid from_date:', event.schedule.from_date, error)
        }
      }

      if (event.schedule?.to_date) {
        try {
          const toDate = new Date(event.schedule.to_date)
          const fromDate = new Date(event.schedule.from_date)
          const dateKey = fromDate.toISOString().split('T')[0] // Use from_date for key consistency
          const endTime = toDate.toTimeString().slice(0, 5) // HH:MM

          if (!dateTimeMap[dateKey]) {
            dateTimeMap[dateKey] = { startTimes: [], endTimes: [] }
          }

          if (!dateTimeMap[dateKey].endTimes.includes(endTime)) {
            dateTimeMap[dateKey].endTimes.push(endTime)
          }
        } catch (error) {
          console.warn('Invalid to_date:', event.schedule.to_date, error)
        }
      }
    })

    Object.keys(dateTimeMap).forEach((date) => {
      dateTimeMap[date].startTimes.sort()
      dateTimeMap[date].endTimes.sort()
    })

    const dates = [
      ...new Set(
        events.docs
          .map((event) => event.schedule?.from_date)
          .filter((date): date is string => Boolean(date))
          .map((date) => {
            try {
              return new Date(date).toISOString().split('T')[0] // YYYY-MM-DD
            } catch {
              return null
            }
          })
          .filter((date): date is string => Boolean(date)),
      ),
    ].sort()

    const start_times = [
      ...new Set(
        events.docs
          .map((event) => event.schedule?.from_date)
          .filter((date): date is string => Boolean(date))
          .map((date) => {
            try {
              return new Date(date).toTimeString().slice(0, 5) // HH:MM
            } catch {
              return null
            }
          })
          .filter((time): time is string => Boolean(time)),
      ),
    ].sort()

    const end_times = [
      ...new Set(
        events.docs
          .map((event) => event.schedule?.to_date)
          .filter((date): date is string => Boolean(date))
          .map((date) => {
            try {
              return new Date(date).toTimeString().slice(0, 5) // HH:MM
            } catch {
              return null
            }
          })
          .filter((time): time is string => Boolean(time)),
      ),
    ].sort()

    const all_times = [...new Set([...start_times, ...end_times])].sort()

    const formatIds: string[] = []
    events.docs.forEach((event) => {
      const format = event.format
      const formatId = typeof format === 'object' && format ? format.id : format
      if (formatId && typeof formatId === 'string' && !formatIds.includes(formatId)) {
        formatIds.push(formatId)
      }
    })

    const formats_data =
      formatIds.length > 0
        ? await req.payload.find({
            collection: 'event-formats',
            where: {
              id: { in: formatIds },
            },
            limit: formatIds.length,
          })
        : { docs: [] }

    const formats = formats_data.docs.map((format) => ({
      id: format.id,
      name: format.name,
      slug: format.slug,
    }))

    const tagIds: string[] = []
    events.docs.forEach((event) => {
      const tags = event.tags
      if (tags && Array.isArray(tags)) {
        tags.forEach((tag) => {
          const tagId = typeof tag === 'object' && tag ? tag.id : tag
          if (tagId && typeof tagId === 'string' && !tagIds.includes(tagId)) {
            tagIds.push(tagId)
          }
        })
      }
    })

    const tags_data =
      tagIds.length > 0
        ? await req.payload.find({
            collection: 'tags',
            where: {
              id: { in: tagIds },
            },
            limit: tagIds.length,
          })
        : { docs: [] }

    const tags = tags_data.docs.map((tag) => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
    }))

    const cityIds: string[] = []
    events.docs.forEach((event) => {
      const venue = event.partner_event_venue
      const city = venue?.city
      const cityId = typeof city === 'object' && city ? city.id : city
      if (cityId && typeof cityId === 'string' && !cityIds.includes(cityId)) {
        cityIds.push(cityId)
      }
    })

    const cities_data =
      cityIds.length > 0
        ? await req.payload.find({
            collection: 'cities',
            where: {
              id: { in: cityIds },
            },
            limit: cityIds.length,
          })
        : { docs: [] }

    const cities = cities_data.docs.map((city) => ({
      id: city.id,
      name: city.name,
      slug: city.slug,
    }))

    const event_modes = [
      ...new Set(events.docs.map((event) => event.partner_event_venue?.event_mode).filter(Boolean)),
    ].sort()

    const event_types = [
      ...new Set(events.docs.map((event) => event.main_or_partner).filter(Boolean)),
    ].sort()

    const registration_modes = [
      ...new Set(events.docs.map((event) => event.registeration_mode).filter(Boolean)),
    ].sort()

    const hallIds: string[] = []
    const zoneIds: string[] = []

    events.docs.forEach((event) => {
      const hall = event.hall
      const zone = event.zone
      const hallId = typeof hall === 'object' && hall ? hall.id : hall
      const zoneId = typeof zone === 'object' && zone ? zone.id : zone

      if (hallId && typeof hallId === 'string' && !hallIds.includes(hallId)) {
        hallIds.push(hallId)
      }
      if (zoneId && typeof zoneId === 'string' && !zoneIds.includes(zoneId)) {
        zoneIds.push(zoneId)
      }
    })

    const halls_data =
      hallIds.length > 0
        ? await req.payload.find({
            collection: 'halls',
            where: {
              id: { in: hallIds },
            },
            limit: hallIds.length,
          })
        : { docs: [] }

    const zones_data =
      zoneIds.length > 0
        ? await req.payload.find({
            collection: 'zones',
            where: {
              id: { in: zoneIds },
            },
            limit: zoneIds.length,
          })
        : { docs: [] }

    const halls = halls_data.docs.map((hall) => ({
      id: hall.id,
      name: hall.name,
    }))

    const zones = zones_data.docs.map((zone) => ({
      id: zone.id,
      name: zone.name,
    }))

    const hallZoneMap: Record<string, Array<{ id: string; name: string }>> = {}

    events.docs.forEach((event) => {
      const hall = event.hall
      const zone = event.zone
      const hallId = typeof hall === 'object' && hall ? hall.id : hall
      const zoneId = typeof zone === 'object' && zone ? zone.id : zone

      if (hallId && typeof hallId === 'string' && zoneId && typeof zoneId === 'string') {
        // Find hall and zone details
        const hallDetail = halls_data.docs.find((h) => h.id === hallId)
        const zoneDetail = zones_data.docs.find((z) => z.id === zoneId)

        if (hallDetail && zoneDetail) {
          const hallKey = hallId

          if (!hallZoneMap[hallKey]) {
            hallZoneMap[hallKey] = []
          }

          // Check if zone is already in the array for this hall
          const existingZone = hallZoneMap[hallKey].find((z) => z.id === zoneId)
          if (!existingZone) {
            hallZoneMap[hallKey].push({
              id: zoneDetail.id,
              name: zoneDetail.name,
            })
          }
        }
      }
    })

    Object.keys(hallZoneMap).forEach((hallId) => {
      hallZoneMap[hallId].sort((a, b) => a.name.localeCompare(b.name))
    })

    const accessLevelIds: string[] = []
    events.docs.forEach((event) => {
      if (event.main_or_partner === 'main_event') {
        const accessLevel = event.access_level
        const accessLevelId =
          typeof accessLevel === 'object' && accessLevel ? accessLevel.id : accessLevel
        if (
          accessLevelId &&
          typeof accessLevelId === 'string' &&
          !accessLevelIds.includes(accessLevelId)
        ) {
          accessLevelIds.push(accessLevelId)
        }
      }
    })

    const accessLevelsData =
      accessLevelIds.length > 0
        ? await req.payload.find({
            collection: 'ticket-types',
            where: {
              id: { in: accessLevelIds },
            },
            limit: accessLevelIds.length,
          })
        : { docs: [] }

    const access_levels = accessLevelsData.docs.map((accessLevel) => ({
      id: accessLevel.id,
      name: accessLevel.name,
      slug: accessLevel.slug,
    }))

    return Response.json(
      {
        dates,
        start_times,
        end_times,
        all_times,
        date_time_map: dateTimeMap,

        formats,
        tags,
        cities,
        halls,
        zones,
        hall_zone_map: hallZoneMap,
        access_levels,

        event_modes,
        event_types,
        registration_modes,

        meta: {
          totalEvents: events.totalDocs,
          totalDates: dates.length,
          totalStartTimes: start_times.length,
          totalEndTimes: end_times.length,
          totalAllTimes: all_times.length,
          totalFormats: formats.length,
          totalTags: tags.length,
          totalCities: cities.length,
          totalAccessLevels: access_levels.length,
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
    console.error('Error fetching filters:', error)
    return Response.json(
      { error: 'Failed to fetch filter options' },
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
