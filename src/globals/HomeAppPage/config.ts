import { anyone } from '@/collections/Users/access/anyone'
import { contentManager } from '@/collections/Users/access/contentManager'
import { isActive } from '@/fields/isActive'
import type { GlobalConfig } from 'payload'

export const HomeAppPage: GlobalConfig = {
  slug: 'home-app',
  label: 'Home - Mobile App',
  admin: {
    group: 'Mobile App Pages',
  },
  access: {
    read: anyone,
    update: contentManager,
  },
  fields: [
    {
      name: 'home_banners',
      type: 'array',
      label: 'Home Page Banners',
      admin: {
        description:
          'Upload Banner Images that will be shown as carousel in the mobile app home page',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Image',
        },

        {
          name: 'click_action',
          type: 'group',
          label: 'Click Action',
          admin: {
            description: 'Configure what happens when user clicks this banner',
          },
          fields: [
            {
              name: 'type',
              type: 'select',
              label: 'Action Type',
              options: [
                {
                  label: 'No Action',
                  value: 'none',
                },
                {
                  label: 'Internal Route',
                  value: 'internal',
                },
                {
                  label: 'External URL',
                  value: 'external',
                },
              ],
              defaultValue: 'none',
              admin: {
                description:
                  'Choose whether to navigate to an internal app screen or external website',
              },
            },

            {
              name: 'internal_route',
              type: 'select',
              label: 'Internal Route',
              options: [
                {
                  label: 'Events',
                  value: 'events',
                },
                {
                  label: 'Speakers',
                  value: 'speakers',
                },
                {
                  label: 'Profile',
                  value: 'profile',
                },
                {
                  label: 'Exhibition Stalls',
                  value: 'exhibition_stalls',
                },
                {
                  label: 'Product Launch',
                  value: 'product_launch',
                },
                {
                  label: 'Schedule Meeting',
                  value: 'schedule_meeting',
                },
              ],
              admin: {
                condition: (_, siblingData) => siblingData?.type === 'internal',
                description: 'Select which screen to navigate to within the app',
              },
            },

            {
              name: 'route_params',
              type: 'json',
              label: 'Route Parameters',
              admin: {
                condition: (_, siblingData) => siblingData?.type === 'internal',
                description:
                  'Optional parameters to pass to the route (JSON format). Example: {"productId": "123", "category": "electronics"}',
              },
            },

            {
              name: 'external_url',
              type: 'text',
              label: 'External URL',
              admin: {
                condition: (_, siblingData) => siblingData?.type === 'external',
                description: 'Enter the full URL (must start with http:// or https://)',
              },
              // @ts-expect-error payload
              validate: (val, { siblingData }) => {
                if (siblingData?.actionType === 'external') {
                  if (!val) return 'External URL is required when action type is external'
                  if (!val.startsWith('http://') && !val.startsWith('https://')) {
                    return 'URL must start with http:// or https://'
                  }
                }
                return true
              },
            },
            {
              name: 'open_in_browser',
              type: 'checkbox',
              label: 'Open in External Browser',
              defaultValue: false,
              admin: {
                condition: (_, siblingData) => siblingData?.type === 'external',
                description:
                  'Check this to open the URL in the device default browser instead of in-app browser',
              },
            },
          ],
        },
      ],
    },
    isActive,
  ],
}
