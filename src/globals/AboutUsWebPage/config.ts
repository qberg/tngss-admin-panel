import { anyone } from '@/collections/Users/access/anyone'
import { contentManager } from '@/collections/Users/access/contentManager'
import type { GlobalConfig } from 'payload'

export const AboutUsWebPage: GlobalConfig = {
  slug: 'about-us-wp',
  label: 'About Us',
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
              name: 'hero',
              type: 'group',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Title',
                },
                {
                  name: 'desc',
                  type: 'text',
                  label: 'Description',
                },
              ],
            },
          ],
          label: 'Hero Section',
        },

        {
          fields: [
            {
              name: 'introduction',
              type: 'group',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Introduction Title',
                  defaultValue: 'Introduction',
                  admin: {
                    description: 'Main heading for the introduction section',
                  },
                },
                {
                  name: 'description',
                  type: 'array',
                  label: 'Introduction Description',
                  admin: {
                    isSortable: true,
                    description: 'Introduction content. Each point will be a paragraph.',
                  },
                  fields: [
                    {
                      name: 'point',
                      type: 'textarea',
                      label: 'Point',
                    },
                  ],
                },
              ],
            },

            {
              name: 'mission',
              type: 'group',
              label: 'Mission Section',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Mission Title',
                  defaultValue: 'Mission',
                  admin: {
                    description: 'Main heading for the mission section',
                  },
                },
                {
                  name: 'description',
                  type: 'array',
                  label: 'Mission Description',
                  admin: {
                    isSortable: true,
                    description: 'Mission content. Each point will be a paragraph.',
                  },
                  fields: [
                    {
                      name: 'point',
                      type: 'textarea',
                      label: 'Point',
                    },
                  ],
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Mission Image',
                  admin: {
                    description: 'Image to display alongside the mission content',
                  },
                },
                {
                  name: 'imageAlt',
                  type: 'text',
                  label: 'Image Alt Text',
                  admin: {
                    description: 'Alternative text for the image (for accessibility)',
                    condition: (_, siblingData) => Boolean(siblingData.image),
                  },
                },
              ],
            },
          ],
          label: 'Intro Mission Section',
        },
        {
          fields: [],
          label: 'Why Tamil Nadu Section',
        },
        {
          fields: [
            {
              name: 'committe',
              type: 'group',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Title',
                },

                {
                  name: 'members',
                  type: 'array',
                  admin: {
                    isSortable: true,
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'name',
                          type: 'text',
                          label: 'Name',
                        },
                        {
                          name: 'designation',
                          type: 'text',
                          label: 'Designation',
                        },
                        {
                          name: 'organization',
                          type: 'text',
                          label: 'organization',
                        },
                      ],
                    },

                    {
                      name: 'image',
                      type: 'upload',
                      relationTo: 'media',
                      label: 'Profile Picture',
                    },
                  ],
                },
              ],
            },
          ],
          label: 'Organizing Committe',
        },
        {
          fields: [],
          label: 'Focus Areas Section',
        },
        {
          fields: [],
          label: 'Key Focus Section',
        },
        {
          fields: [],
          label: 'Get Involved Section',
        },
      ],
    },
  ],
}
