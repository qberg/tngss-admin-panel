import { anyone } from '@/collections/Users/access/anyone'
import { eventManager } from '@/collections/Users/access/eventManager'
import type { GlobalConfig } from 'payload'

export const WhySponsorWebPage: GlobalConfig = {
  slug: 'why-sponsor-wp',
  label: 'Why Sponsor - Website',
  admin: {
    group: 'Website Pages',
  },
  access: {
    read: anyone,
    update: eventManager,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'about_tngss',
          label: 'About TNGSS 2025',
          fields: [
            {
              name: 'title',
              type: 'text',
              defaultValue: 'About TNGSS 2025',
              label: 'Title',
            },

            {
              name: 'image_block',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'caption',
                      type: 'text',
                      label: 'Caption',
                      admin: {
                        width: '50%',
                      },
                    },
                    {
                      name: 'description',
                      type: 'text',
                      label: 'Description',
                      admin: {
                        width: '50%',
                      },
                    },
                  ],
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Image',
                },
              ],
            },

            {
              name: 'content',
              type: 'textarea',
              defaultValue:
                'Following the remarkable success of Startup Thiruvizha 2024 in Coimbatore and Madurai, which drew record participation and made a Strong National Impact, StartupTN is now stepping onto the Global Stage with the launch of the Tamil Nadu Global Startup Summit (TNGSS), bringing together innovators, investors, and thought leaders from around the world.',
              admin: {
                description: 'Seperate paragraphs with a empty line',
              },
              label: 'Content',
            },
          ],
        },

        {
          name: 'event_highlights',
          label: 'Event Highlights',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Title',
              defaultValue: 'Event Highlights',
            },
            {
              name: 'impact_numbers',
              type: 'array',
              label: 'Impact Numbers',
              fields: [
                {
                  name: 'number',
                  type: 'text',
                  label: 'Number',
                },
                {
                  name: 'description',
                  type: 'text',
                  label: 'Description',
                },
              ],
            },
          ],
        },

        {
          name: 'spons_benefits',
          label: 'Spons Benefits',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Title',
              defaultValue: 'Turn Your Marketing Spend into Market Influence',
            },

            {
              name: 'cards',
              type: 'array',
              label: 'Cards',
              fields: [
                {
                  name: 'icon',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Icon',
                },

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
        },
      ],
    },
  ],
}
