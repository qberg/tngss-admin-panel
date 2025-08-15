import { anyone } from '@/collections/Users/access/anyone'
import { contentManager } from '@/collections/Users/access/contentManager'
import { faqBlock } from '@/fields/faqBlock'
import { socialMediaField } from '@/fields/socialMedia'
import {
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { GlobalConfig } from 'payload'

export const AboutTNGSSApp: GlobalConfig = {
  slug: 'about-tngss-app',
  label: 'About TNGSS - Mobile App',
  admin: {
    group: 'Mobile App Pages',
  },
  access: {
    read: anyone,
    update: contentManager,
  },
  fields: [
    {
      type: 'group',
      name: 'about_venue',
      label: 'About Venue',
      fields: [
        {
          name: 'content',
          type: 'array',
          label: 'Content Paragraphs',
          fields: [
            {
              name: 'paragraph',
              type: 'textarea',
              label: 'Paragraph',
            },
          ],
        },

        {
          type: 'row',
          fields: [
            {
              name: 'cta_label',
              type: 'text',
              label: 'Cta Label',
            },

            {
              name: 'cta_url',
              type: 'text',
              label: 'Cta URL',
            },
          ],
        },
      ],
    },

    {
      type: 'group',
      name: 'faq',
      label: 'FAQ',
      fields: [
        {
          name: 'faq_blocks',
          type: 'array',
          label: 'FAQ Blocks',
          fields: [faqBlock],
        },
      ],
    },

    {
      type: 'group',
      name: 'arriving_to_tngss',
      label: 'Arriving to TNGSS',
      fields: [
        {
          name: 'venue_details',
          type: 'group',
          label: 'Venue Details',
          fields: [
            {
              name: 'name',
              type: 'text',

              label: 'Venue Name',

              defaultValue: 'Codissia Trade Fair',
            },

            {
              name: 'full_address',
              type: 'textarea',
              label: 'Full Address',

              defaultValue:
                'Codissia Trade Fair Complex, Nehru Nagar West, Coimbatore, Tamil Nadu 641014',
            },
            {
              name: 'map_url',
              type: 'text',
              label: 'Map URL',
              defaultValue: 'https://maps.app.goo.gl/gRSyLsgtPCyxx2zq5',
            },
          ],
        },

        {
          name: 'transportation_options',
          type: 'richText',
          label: 'Transportation Options',
          editor: lexicalEditor({
            features: ({ rootFeatures }) => {
              return [
                ...rootFeatures,
                HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                FixedToolbarFeature(),
                InlineToolbarFeature(),
                HorizontalRuleFeature(),
              ]
            },
          }),
        },
      ],
    },

    {
      type: 'group',
      name: 'contact_us',
      label: 'Contact Us',
      fields: [
        {
          type: 'array',
          name: 'contact_info',
          label: 'Contact Info',
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Label',
            },

            {
              name: 'emails',
              type: 'array',
              label: 'Emails',
              fields: [
                {
                  name: 'email',
                  type: 'text',
                  label: 'Email',
                },
              ],
            },

            {
              name: 'phone_numbers',
              type: 'array',
              label: 'Phone Numbers',
              fields: [
                {
                  name: 'phone',
                  type: 'text',
                  label: 'Phone',
                },
              ],
            },
          ],
        },
        socialMediaField,
      ],
    },

    {
      name: 'staying-in-coimbatore',
      type: 'richText',
      label: 'Staying In Coimbatore',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            HorizontalRuleFeature(),
          ]
        },
      }),
    },
  ],
}
