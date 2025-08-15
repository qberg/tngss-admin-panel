import { anyone } from '@/collections/Users/access/anyone'
import { contentManager } from '@/collections/Users/access/contentManager'
import { faqBlock } from '@/fields/faqBlock'
import { minimalHeroField } from '@/fields/minimalHero'
import type { GlobalConfig } from 'payload'

export const FaqAppPage: GlobalConfig = {
  slug: 'faq-app',
  label: 'FAQ - Mobile App',
  admin: {
    group: 'Mobile App Pages',
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
          label: 'Header Section',
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
