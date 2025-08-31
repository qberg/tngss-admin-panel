import { anyone } from '@/collections/Users/access/anyone'
import { contentManager } from '@/collections/Users/access/contentManager'
import type { GlobalConfig } from 'payload'

export const TicketsInfoWebPage: GlobalConfig = {
  slug: 'tickets-info-wp',
  label: 'Tickets Info - Website',
  admin: {
    group: 'Website Pages',
  },
  access: {
    read: anyone,
    update: contentManager,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              type: 'group',
              name: 'pass_headers',
              label: 'Pass Headers',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Title',
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Description',
                },
              ],
            },
            {
              type: 'group',
              name: 'exhibitor_headers',
              label: 'Exhibitor Headers',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Title',
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Description',
                },
              ],
            },
          ],
          name: 'section_headers',
          label: 'Section Headers',
        },
        {
          fields: [
            {
              type: 'array',
              name: 'guidelines',
              label: 'Guidelines',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  label: 'Name',
                },
                {
                  name: 'points',
                  type: 'array',
                  label: 'Points',
                  fields: [
                    {
                      name: 'point',
                      type: 'text',
                      label: 'Point',
                    },
                  ],
                },
              ],
            },
          ],
          name: 'guidelines',
          label: 'Guidelines',
        },

        {
          name: 'tickets',
          label: 'Tickets Collection Reference',
          admin: {
            description: 'Tickets are a seperate collection, manage them over there',
          },
          fields: [
            {
              name: 'ticket_management',
              type: 'ui',
              admin: {
                components: {
                  Field: '@/components/admin/TicketManagementButton',
                },
              },
            },
          ],
        },
      ],
    },
  ],
}
