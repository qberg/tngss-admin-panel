import type { CollectionConfig } from 'payload'
import { eventManager } from '../Users/access/eventManager'
import { anyone } from '../Users/access/anyone'
import { slugFromTitle } from '@/fields/slug'
import { scheduleField } from '@/fields/duration'
import { virtualDetailsField } from '@/fields/virtualDetails'
import { publicFieldAccess } from '../Users/access/groups'
import { fcfsSettingsField } from '@/fields/events/fcfsSettings'

export const Events: CollectionConfig = {
  slug: 'events',
  labels: {
    singular: 'Event',
    plural: 'Events',
  },
  admin: {
    group: 'Events Management',
    useAsTitle: 'title',
  },
  access: {
    create: eventManager,
    read: anyone,
    update: eventManager,
    delete: eventManager,
  },
  fields: [
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

    // registeration and capacity management
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
            description:
              'How should users register for this event? (Approval mode will be available in future release)',
          },
        },

        // fcfs settings
        fcfsSettingsField,
      ],
    },
    // current registerations, will fetch from microservices api
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
  ],
}
