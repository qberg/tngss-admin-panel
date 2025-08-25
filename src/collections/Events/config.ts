import type { CollectionConfig } from 'payload'
import { eventManager } from '../Users/access/eventManager'
import { anyone } from '../Users/access/anyone'
import { slugFromTitle } from '@/fields/slug'
import { scheduleField } from '@/fields/duration'
import { virtualDetailsField } from '@/fields/virtualDetails'
import { publicFieldAccess } from '../Users/access/groups'
import { fcfsSettingsField } from '@/fields/events/fcfsSettings'
import { auditFields } from '@/fields/audit'
import { isPublic } from '@/fields/isPublic'
import { headersWithCors } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  labels: {
    singular: 'Event',
    plural: 'Events',
  },
  admin: {
    group: 'Events Management',
    useAsTitle: 'title',
    defaultColumns: [
      'title',
      'main_or_partner',
      'format',
      'registeration_mode',
      'isPublic',
      'event_date',
    ],
  },
  access: {
    create: eventManager,
    read: anyone,
    update: eventManager,
    delete: eventManager,
  },

  endpoints: [
    {
      path: '/filters',
      method: 'get',
      handler: async (req) => {
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

          // Sort times within each date
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
            ...new Set(
              events.docs.map((event) => event.partner_event_venue?.event_mode).filter(Boolean),
            ),
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

          // Sort zones within each hall
          Object.keys(hallZoneMap).forEach((hallId) => {
            hallZoneMap[hallId].sort((a, b) => a.name.localeCompare(b.name))
          })

          // Add access level filtering
          const accessLevelIds: string[] = []
          events.docs.forEach((event) => {
            // Only main events have access_level
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
      },
    },
    {
      path: '/available-dates',
      method: 'get',
      handler: async (req) => {
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
      },
    },
  ],

  fields: [
    isPublic,

    {
      name: 'main_or_partner',
      type: 'select',
      required: true,
      access: publicFieldAccess,
      label: 'Main or Partner Event',
      options: [
        { label: 'Main Event', value: 'main_event' },
        {
          label: 'Partner Event',
          value: 'partner_event',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'access_level',
      label: 'Access Level',
      type: 'relationship',
      relationTo: 'ticket-types',
      hasMany: false,
      admin: {
        condition: (_, siblingData) => Boolean(siblingData?.main_or_partner === 'main_event'),
        position: 'sidebar',
      },
    },
    {
      type: 'collapsible',
      label: '🌍 Public Event Information',
      admin: {
        initCollapsed: false,
        description: 'Information visible to all users in mobile/web applications',
      },
      fields: [
        {
          name: 'banner_image',
          type: 'upload',
          relationTo: 'media',
          label: 'Banner Image of the Event',
          hasMany: false,
          admin: {
            description: 'Ensure sponsor logos are embedded in the image, if applicable',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          access: publicFieldAccess,
          label: 'Title of the Event',
          admin: {
            placeholder: 'Opening Keynote: Future of Technology',
          },
        },
        {
          name: 'about',
          type: 'textarea',
          access: publicFieldAccess,
          label: 'About the Event',
          admin: {
            placeholder:
              'Join us for an exciting pitch competition where innovative startups showcase their...',
          },
        },

        scheduleField,

        {
          type: 'row',
          admin: {
            condition: (data, _) => Boolean(data?.main_or_partner === 'main_event'),
          },
          fields: [
            {
              name: 'hall',
              type: 'relationship',
              label: 'Hall/Room',
              relationTo: 'halls',
              hasMany: false,
              admin: {
                width: '50%',
              },
            },
            {
              name: 'zone',
              type: 'relationship',
              label: 'Zone/Area',
              relationTo: 'zones',
              hasMany: false,
              admin: {
                width: '50%',
                condition: (_, siblingData) => Boolean(siblingData?.hall),
              },
              filterOptions: ({ siblingData }) => {
                // @ts-expect-error payload yet to do its magic
                if (siblingData?.hall) {
                  // @ts-expect-error payload yet to do its magic
                  return { hall: { equals: siblingData.hall } }
                }

                return false
              },
            },
          ],
        },

        {
          type: 'group',
          name: 'partner_event_venue',
          label: 'Location Info',
          admin: {
            condition: (data, _) => Boolean(data?.main_or_partner === 'partner_event'),
          },
          fields: [
            {
              name: 'event_mode',
              type: 'select',
              required: true,
              access: publicFieldAccess,
              label: 'Event Mode',
              options: [
                { label: 'Online', value: 'online' },
                { label: 'Offline', value: 'offline' },
              ],
            },
            {
              type: 'row',
              admin: {
                condition: (_, siblingData) => Boolean(siblingData?.event_mode === 'online'),
              },
              access: publicFieldAccess,
              fields: virtualDetailsField,
            },
            {
              type: 'row',
              admin: {
                condition: (_, siblingData) => Boolean(siblingData?.event_mode === 'offline'),
              },
              fields: [
                {
                  name: 'venue',
                  type: 'text',
                  required: true,
                  access: publicFieldAccess,
                  label: 'Venue',
                  admin: {
                    placeholder: 'D Block, 7th Floor, Research Park, IIT Madras',
                  },
                },
                {
                  name: 'city',
                  type: 'relationship',
                  relationTo: 'cities',
                  hasMany: false,
                  required: true,
                  access: publicFieldAccess,
                  label: 'City',
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'map_url',
                  type: 'text',
                  label: 'Map URL',
                  access: publicFieldAccess,
                  admin: {
                    width: '100%',
                  },
                },
              ],
            },
          ],
        },

        {
          name: 'agenda',
          type: 'array',
          label: 'Agenda of the Event',
          access: publicFieldAccess,
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'time',
                  type: 'text',
                  label: 'Time Frame',
                  admin: {
                    placeholder: '10:00 AM - 10:30 AM',
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Description',
                  admin: {
                    placeholder: 'Welcome Address: The speaker...',
                  },
                },
              ],
            },
          ],
        },

        {
          name: 'speakers',
          type: 'array',
          access: publicFieldAccess,
          fields: [
            {
              name: 'speaker',
              type: 'relationship',
              relationTo: 'speakers',
              hasMany: false,
              label: 'Speaker',
            },
          ],
        },
      ],
    },

    {
      name: 'format',
      type: 'relationship',
      relationTo: 'event-formats',
      required: true,
      label: 'Event Format',
      hasMany: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      required: true,
      label: 'Tags',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    slugFromTitle,

    // registration and capacity management
    {
      type: 'collapsible',
      label: '🎫 Event Registration & Capacity Management',
      admin: {
        initCollapsed: true,
        description: 'Configure how users can register for this event',
      },
      fields: [
        {
          name: 'registeration_mode',
          label: 'Registeration Mode',
          type: 'select',
          required: true,
          defaultValue: 'fcfs',
          access: publicFieldAccess,
          options: [
            {
              label: '🚫 No Registration Required',
              value: 'none',
            },
            {
              label: '⚡ First Come First Serve',
              value: 'fcfs',
            },
            {
              label: '✅ Admin Approval Required',
              value: 'approval',
            },
          ],
          admin: {
            description: 'How should users register for this event?',
          },
        },

        fcfsSettingsField,
      ],
    },
    {
      name: 'current_registerations',
      label: 'Current Registerations',
      type: 'number',
      defaultValue: 0,
      admin: {
        condition: (data) => ['fcfs', 'approval'].includes(data?.registeration_mode),
        description: 'Updated automatically by registeration service',
        readOnly: true,
        position: 'sidebar',
      },
    },
    auditFields,
  ],
}
