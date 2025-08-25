import { anyone } from '@/collections/Users/access/anyone'
import { contentManager } from '@/collections/Users/access/contentManager'
import type { GlobalConfig } from 'payload'

export const WhyAttendWebPage: GlobalConfig = {
  slug: 'why-attend-wp',
  label: 'Why Attend - Website',
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
          name: 'discover_tn',
          label: 'Discover TN',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Title',
            },
            {
              name: 'content',
              type: 'array',
              label: 'Content',
              fields: [
                {
                  name: 'para',
                  type: 'textarea',
                  label: 'Paragraph',
                },
              ],
            },
          ],
        },

        {
          label: 'Stakeholders',
          fields: [
            {
              name: 'stakeholders',
              type: 'array',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Title',
                },

                {
                  name: 'sub_title',
                  type: 'text',
                  label: 'Sub Title',
                },

                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Image',
                },

                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Description',
                },

                {
                  name: 'points',
                  type: 'array',
                  label: 'Points',
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
            },
          ],
        },
      ],
    },
  ],
}
