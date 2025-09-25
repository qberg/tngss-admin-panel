import type { CollectionConfig } from 'payload'
import { slugFromTitle } from '@/fields/slug'
import { scheduleField } from '@/fields/duration'
import { virtualDetailsField } from '@/fields/virtualDetails'
import { fcfsSettingsField } from '@/fields/events/fcfsSettings'
import { auditFields } from '@/fields/audit'
import { isPublic } from '@/fields/isPublic'
import { getEventsFilters } from '@/endpoints/events/filters'
import { getAvailableDates } from '@/endpoints/events/availableDates'
import { contentManager } from '../Users/access/contentManager'
import { approvalSettingsField } from '@/fields/events/approvalSettings'
import { softDeleteField } from '@/fields/softDelete'
import { readNonDeleted } from '../Users/access/softDelete'
import { getMainEventsFilters } from '@/endpoints/events/mainEventsFilters'
import { getMainEventsList } from '@/endpoints/events/mainEventList'
import { getAllEventsFilters } from '@/endpoints/events/allFilters'

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
      'event_date',
      'main_or_partner',
      'registeration_mode',
      'isPublic',
      'deleted',
    ],
  },
  access: {
    create: contentManager,
    read: readNonDeleted,
    update: contentManager,
    delete: () => false,
  },

  endpoints: [
    {
      path: '/filters',
      method: 'get',
      handler: getEventsFilters,
    },
    {
      path: '/main_events/dynamic_filters',
      method: 'get',
      handler: getMainEventsFilters,
    },
    {
      path: '/main_events/filters',
      method: 'get',
      handler: getAllEventsFilters,
    },
    {
      path: '/main_events/list',
      method: 'get',
      handler: getMainEventsList,
    },
    {
      path: '/available-dates',
      method: 'get',
      handler: getAvailableDates,
    },
  ],

  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: '🌍 Event Details',
          description: 'Basic event information and public details',
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
              label: 'Title of the Event',
              admin: {
                placeholder: 'Opening Keynote: Future of Technology',
              },
            },

            isPublic,

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
                condition: (_, siblingData) =>
                  Boolean(siblingData?.main_or_partner === 'main_event'),
                position: 'sidebar',
              },
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
            {
              name: 'current_registerations',
              label: 'Current Registrations',
              type: 'number',
              defaultValue: 0,
              admin: {
                condition: (data) => ['fcfs', 'approval'].includes(data?.registeration_mode),
                description: 'Updated automatically by registration service',
                readOnly: true,
                position: 'sidebar',
              },
            },
            slugFromTitle,
            {
              name: 'about',
              type: 'textarea',
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
                      label: 'City',
                      admin: {
                        width: '50%',
                      },
                    },
                    {
                      name: 'map_url',
                      type: 'text',
                      label: 'Map URL',
                      admin: {
                        width: '100%',
                      },
                    },
                  ],
                },
              ],
            },
            auditFields,
          ],
        },

        {
          label: '📋 Agenda & Speakers',
          description: 'Event agenda and speaker information',
          fields: [
            {
              name: 'agenda',
              type: 'array',
              label: 'Agenda of the Event',
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
                        width: '30%',
                      },
                    },
                    {
                      name: 'description',
                      type: 'textarea',
                      label: 'Description',
                      admin: {
                        placeholder: 'Welcome Address: The speaker...',
                        width: '70%',
                      },
                    },
                  ],
                },
              ],
            },

            {
              name: 'speakers',
              type: 'array',
              label: 'Event Speakers',
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
          label: '🎫 Registration Settings',
          description: 'Event registration and capacity management settings',
          fields: [
            {
              name: 'registeration_mode',
              label: 'Registration Mode',
              type: 'select',
              required: true,
              defaultValue: 'fcfs',
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
            approvalSettingsField,
          ],
        },

        {
          label: '👥 View Registrations',
          admin: {
            condition: (data) => {
              const hasId = Boolean(data?.id)
              const isFcfs = data?.registeration_mode === 'fcfs'
              const shouldShow = hasId && isFcfs

              return shouldShow
            },
          },
          fields: [
            {
              name: 'registerations_display',
              type: 'ui',
              admin: {
                components: {
                  Field: '@/components/admin/EventRegistrations',
                },
              },
            },
          ],
        },
        {
          label: '👥 Approve Registrations',
          admin: {
            condition: (data) => {
              const hasId = Boolean(data?.id)
              const isApproval = data?.registeration_mode === 'approval'
              const shouldShow = hasId && isApproval

              return shouldShow
            },
          },
          fields: [
            {
              name: 'approvals_display',
              type: 'ui',
              admin: {
                components: {
                  Field: '@/components/admin/events/Registrations',
                },
              },
            },
          ],
        },
        {
          label: 'Delete',
          fields: [softDeleteField],
        },
      ],
    },
  ],
}
