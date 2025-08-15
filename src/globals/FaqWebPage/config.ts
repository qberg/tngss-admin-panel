import { anyone } from '@/collections/Users/access/anyone'
import { contentManager } from '@/collections/Users/access/contentManager'
import { faqBlock } from '@/fields/faqBlock'
import { minimalHeroField } from '@/fields/minimalHero'
import type { GlobalConfig } from 'payload'

export const FaqWebPage: GlobalConfig = {
  slug: 'faq-wp',
  label: 'FAQ - Website',
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
          fields: [minimalHeroField],
          label: 'Hero Section',
        },

        {
          fields: [
            {
              name: 'faq_blocks',
              type: 'array',
              label: 'FAQ Blocks',
              fields: [faqBlock],
            },
          ],
          label: 'FAQs',
        },
      ],
    },
  ],
}
