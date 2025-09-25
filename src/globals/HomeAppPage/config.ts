import { anyone } from '@/collections/Users/access/anyone'
import { contentManager } from '@/collections/Users/access/contentManager'
import { clickActionField } from '@/fields/clickActions'
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
              type: 'text',
              label: 'Internal Route',
              admin: {
                condition: (_, siblingData) => siblingData?.type === 'internal',
                description: 'Select which screen to navigate to within the app',
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
    {
      name: 'sponsors_and_partners',
      type: 'array',
      label: 'Sponsors and Partners',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Image',
        },
        {
          name: 'bg_image',
          type: 'upload',
          relationTo: 'media',
          label: 'Background Image',
        },
        clickActionField,

        {
          name: 'image_url',
          type: 'text',
          admin: {
            hidden: true,
          },
          access: {
            create: () => false,
            update: () => false,
          },
        },
        {
          name: 'image_filename',
          type: 'text',
          label: 'Image Filename',
          admin: {
            hidden: true,
          },
          access: {
            create: () => false,
            update: () => false,
          },
        },

        {
          name: 'bg_image_url',
          type: 'text',
          admin: {
            hidden: true,
          },
          access: {
            create: () => false,
            update: () => false,
          },
        },
        {
          name: 'bg_image_filename',
          type: 'text',
          label: 'Image Filename',
          admin: {
            hidden: true,
          },
          access: {
            create: () => false,
            update: () => false,
          },
        },
      ],
    },

    {
      name: 'showcases',
      type: 'array',
      label: 'Showcases',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Image',
        },
        {
          name: 'bg_image',
          type: 'upload',
          relationTo: 'media',
          label: 'Background Image',
        },
        clickActionField,

        {
          name: 'image_url',
          type: 'text',
          label: 'Image URL',
          admin: {
            hidden: true,
          },
          access: {
            create: () => false,
            update: () => false,
          },
        },
        {
          name: 'image_filename',
          type: 'text',
          label: 'Image Filename',
          admin: {
            hidden: true,
          },
          access: {
            create: () => false,
            update: () => false,
          },
        },

        {
          name: 'bg_image_url',
          type: 'text',
          admin: {
            hidden: true,
          },
          access: {
            create: () => false,
            update: () => false,
          },
        },
        {
          name: 'bg_image_filename',
          type: 'text',
          admin: {
            hidden: true,
          },
          access: {
            create: () => false,
            update: () => false,
          },
        },
      ],
    },

    {
      name: 'special_events',
      type: 'array',
      label: 'Special Events',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Image',
        },
        {
          name: 'bg_image',
          type: 'upload',
          relationTo: 'media',
          label: 'Background Image',
        },
        {
          name: 'format',
          type: 'relationship',
          relationTo: 'event-formats',
          hasMany: false,
          label: 'Event Format',
          admin: {
            isSortable: false,
          },
        },

        {
          name: 'format_id',
          type: 'text',
          label: 'Format ID',
          admin: {
            hidden: true,
          },
          access: {
            create: () => false,
            update: () => false,
          },
        },
        {
          name: 'format_name',
          type: 'text',
          label: 'Format Name',
          admin: {
            hidden: true,
          },
          access: {
            create: () => false,
            update: () => false,
          },
        },
        {
          name: 'format_slug',
          type: 'text',
          label: 'Format Slug',
          admin: {
            hidden: true,
          },
          access: {
            create: () => false,
            update: () => false,
          },
        },

        {
          name: 'image_url',
          type: 'text',
          label: 'Image URL',
          admin: {
            hidden: true,
          },
          access: {
            create: () => false,
            update: () => false,
          },
        },
        {
          name: 'image_filename',
          type: 'text',
          label: 'Image Filename',
          admin: {
            hidden: true,
          },
          access: {
            create: () => false,
            update: () => false,
          },
        },

        {
          name: 'bg_image_url',
          type: 'text',
          admin: {
            hidden: true,
          },
          access: {
            create: () => false,
            update: () => false,
          },
        },
        {
          name: 'bg_image_filename',
          type: 'text',
          admin: {
            hidden: true,
          },
          access: {
            create: () => false,
            update: () => false,
          },
        },
      ],
    },
    isActive,
  ],
  hooks: {
    afterRead: [
      async ({ doc }) => {
        if (doc.special_events && Array.isArray(doc.special_events)) {
          for (const event of doc.special_events) {
            if (event.format && typeof event.format === 'object') {
              event.format_id = event.format.id
              event.format_name = event.format.name
              event.format_slug = event.format.slug

              delete event.format
            }

            if (event.image && typeof event.image === 'object') {
              event.image_url = event.image.url
              event.image_filename = event.image.filename

              delete event.image
            }

            if (event.bg_image && typeof event.bg_image === 'object') {
              event.bg_image_url = event.bg_image.url
              event.bg_image_filename = event.bg_image.filename

              delete event.bg_image
            }
          }
        }

        if (doc.showcases && Array.isArray(doc.showcases)) {
          for (const showcase of doc.showcases) {
            if (showcase.image && typeof showcase.image === 'object') {
              showcase.image_url = showcase.image.url
              showcase.image_filename = showcase.image.filename

              delete showcase.image
            }

            if (showcase.bg_image && typeof showcase.bg_image === 'object') {
              showcase.bg_image_url = showcase.bg_image.url
              showcase.bg_image_filename = showcase.bg_image.filename

              delete showcase.bg_image
            }
          }
        }

        if (doc.sponsors_and_partners && Array.isArray(doc.sponsors_and_partners)) {
          for (const spons of doc.sponsors_and_partners) {
            if (spons.image && typeof spons.image === 'object') {
              spons.image_url = spons.image.url
              spons.image_filename = spons.image.filename

              delete spons.image
            }

            if (spons.bg_image && typeof spons.bg_image === 'object') {
              spons.bg_image_url = spons.bg_image.url
              spons.bg_image_filename = spons.bg_image.filename

              delete spons.bg_image
            }
          }
        }
        return doc
      },
    ],
  },
}
