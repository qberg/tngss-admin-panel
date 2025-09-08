import type { CollectionConfig } from 'payload'
import { contentManager } from '../Users/access/contentManager'
import { anyone } from '../Users/access/anyone'
import { isPublic } from '@/fields/isPublic'
import { getNetworkingVenues } from '@/endpoints/networking/venues'

export const NetworkingSessions: CollectionConfig = {
  slug: 'networking-sessions',
  labels: {
    singular: 'Networking Session',
    plural: 'Networking Sessions',
  },
  admin: {
    group: 'Events Management',
    useAsTitle: 'display_name',
    defaultColumns: ['display_name', 'main_or_partner', 'isPublic'],
  },
  access: {
    create: contentManager,
    read: anyone,
    update: contentManager,
    delete: contentManager,
  },
  endpoints: [
    {
      path: '/available-venues',
      method: 'get',
      handler: getNetworkingVenues,
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        if (
          data.main_or_partner === 'main_event' &&
          data.main_event_sessions_config?.zone &&
          data.main_event_sessions_config?.start_time &&
          data.main_event_sessions_config?.end_time
        ) {
          try {
            const zone = await req.payload.findByID({
              collection: 'zones',
              id: data.main_event_sessions_config.zone,
              depth: 2,
            })

            const start = new Date(data.main_event_sessions_config.start_time)
            const end = new Date(data.main_event_sessions_config.end_time)

            const startStr = start.toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            })

            const endStr = end.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            })

            // @ts-expect-error any
            data.display_name = `${zone.name}, ${zone.hall?.name} - ${startStr} to ${endStr}`
            console.log('Generated display_name:', data.display_name)
          } catch (error) {
            console.error('Error generating display_name:', error)
          }
        }

        if (
          data.main_or_partner === 'partner_event' &&
          data.partner_event_sessions_config?.venue_name &&
          data.partner_event_sessions_config?.city
        ) {
          try {
            console.log('Generating display name for partner events')

            console.log(data.partner_event_sessions_config)

            const city = await req.payload.findByID({
              collection: 'cities',
              id: data.partner_event_sessions_config.city,
            })

            data.display_name = `${data.partner_event_sessions_config.venue_name}, ${city.name}`
            console.log('Generated display_name:', data.display_name)
          } catch (error) {
            console.error('Error generating display_name:', error)
          }
        }

        return data
      },
    ],
  },
  fields: [
    {
      name: 'main_or_partner',
      type: 'select',
      required: true,
      label: 'Main or Partner Event',
      options: [
        { label: 'Main Event', value: 'main_event' },
        {
          label: 'Partner Event',
          value: 'partner_event',
        },
      ],
    },
    {
      name: 'display_name',
      type: 'text',
      label: 'Display Name',
      admin: {
        readOnly: true,
        description: 'Auto-generated based on zone and time selection',
      },
    },
    isPublic,
    {
      name: 'main_event_sessions_config',
      type: 'group',
      label: 'Main Event Networking Sessions Config',
      admin: {
        condition: (_, siblingData) => Boolean(siblingData?.main_or_partner === 'main_event'),
      },
      fields: [
        {
          name: 'zone',
          type: 'relationship',
          relationTo: 'zones',
          label: 'Zone',
        },
        {
          name: 'start_time',
          type: 'date',
          label: 'Start Time',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'end_time',
          type: 'date',
          label: 'End Time',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'meeting_duration',
          type: 'number',
          defaultValue: 15,
          label: 'Duration of each meeting (in minutes)',
          admin: {
            description: 'How long each individual meetings lasts',
          },
        },
        {
          name: 'concurrent_meetings',
          type: 'number',
          label: 'Number of Concurrent Meetings',
          admin: {
            description: 'How many meetings can happen at the same time (based on tables/space)',
          },
        },
        {
          name: 'allowed_ticket_types',
          type: 'relationship',
          relationTo: 'ticket-types',
          hasMany: false,
          label: 'Who can book a slot here?',
        },
      ],
    },

    {
      name: 'partner_event_sessions_config',
      type: 'group',
      label: 'Partner Event Sessions Config',
      admin: {
        condition: (_, siblingData) => Boolean(siblingData?.main_or_partner === 'partner_event'),
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'venue_name',
              type: 'text',
              label: 'Venue Name',
              admin: {
                placeholder: '3rd Floor, D Block, IIT Madras',
              },
            },
            {
              name: 'city',
              type: 'relationship',
              relationTo: 'cities',
              label: 'City',
            },
          ],
        },

        {
          name: 'event_date',
          type: 'date',
          required: true,
          label: 'Event Date',
          admin: {
            date: {
              pickerAppearance: 'dayOnly',
            },
            description: 'Users will choose their own meeting times on this date',
          },
        },
        {
          name: 'default_meeting_duration',
          type: 'number',
          defaultValue: 30,
          required: true,
          label: 'Default Meeting Duration (minutes)',
          admin: {
            description: 'When user picks start time, end time = start + this duration',
          },
        },
        {
          name: 'allowed_time_range',
          type: 'group',
          label: 'Allowed Booking Hours',
          fields: [
            {
              name: 'earliest_start',
              type: 'text',
              defaultValue: '09:00',
              label: 'Earliest Start Time',
              admin: {
                placeholder: '09:00 (24hr format)',
                description: 'Earliest time users can book meetings',
              },
            },
            {
              name: 'latest_start',
              type: 'text',
              defaultValue: '18:00',
              label: 'Latest Start Time',
              admin: {
                placeholder: '18:00 (24hr format)',
                description: 'Latest time users can start meetings',
              },
            },
          ],
        },
      ],
    },
  ],
}
