import { anyone } from '@/collections/Users/access/anyone'
import { contentManager } from '@/collections/Users/access/contentManager'
import type { GlobalConfig } from 'payload'

export const WhyTamilNaduWebPage: GlobalConfig = {
  slug: 'why-tn-wp',

  label: 'Why Tamil Nadu - Website',
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
          label: 'Discover TN Section',
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

            {
              type: 'array',
              name: 'impact_numbers',
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

        // tab 2
        {
          name: 'sector_higlights',
          label: 'Sector Highlights of Tamil Nadu Section',
          fields: [
            {
              name: 'title',
              label: 'Title',
              type: 'text',
            },

            {
              name: 'powerhouse',
              label: 'Sector Salient Features',
              type: 'group',
              fields: [
                {
                  name: 'title',
                  label: 'Title',
                  type: 'text',
                },

                {
                  name: 'points',
                  label: 'Points',
                  type: 'array',
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

            {
              name: 'leadership',
              type: 'group',
              label: 'Sectoral Leadership',
              fields: [
                {
                  name: 'title',
                  label: 'Title',
                  type: 'text',
                },

                {
                  name: 'sector_cards',
                  label: 'Sector Cards',
                  type: 'array',
                  fields: [
                    {
                      name: 'title',
                      label: 'Title',
                      type: 'text',
                    },
                    {
                      name: 'description',
                      label: 'Description',
                      type: 'textarea',
                    },
                  ],
                },
              ],
            },
          ],
        },

        //tab 3
        {
          name: 'tn_highlights',
          label: 'Highlights of Tamil Nadu Section',
          fields: [
            {
              type: 'array',
              name: 'highlight',
              label: 'Highlight',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Title',
                },

                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Image',
                },

                {
                  name: 'points',
                  type: 'array',
                  label: 'Points',
                  fields: [
                    {
                      name: 'sub_title',
                      label: 'Subtitle',
                      type: 'text',
                    },

                    {
                      name: 'description',
                      label: 'Description',
                      type: 'text',
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
