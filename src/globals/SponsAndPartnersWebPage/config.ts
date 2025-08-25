import { anyone } from '@/collections/Users/access/anyone'
import { contentManager } from '@/collections/Users/access/contentManager'
import { createSponsorField } from '@/fields/sponsorField'
import type { GlobalConfig } from 'payload'

const sponsorTiers = [
  { name: 'diamond', label: 'Diamond Sponsor', format: '450x300' },
  { name: 'platinum', label: 'Platinum Sponsor', format: '400x250' },
  { name: 'gold', label: 'Gold Sponsor', format: '350x200' },
  { name: 'silver', label: 'Silver Sponsor', format: '300x150' },
  { name: 'bronze', label: 'Bronze Sponsor', format: '250x125' },
  { name: 'zone', label: 'Zone Sponsor', format: '200x100' },
]

export const SponsAndPartnersWebPage: GlobalConfig = {
  slug: 'spons-and-partners-wp',
  label: 'Sponsors And Partners - Website',
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
          fields: sponsorTiers.map((tier) => createSponsorField(tier.name, tier.label)),
          name: 'sponsors',
          label: 'Sponsors',
        },

        {
          name: 'partners',
          label: 'Partners',
          fields: [createSponsorField('partners', 'Partners', '200x100')],
        },
      ],
    },
  ],
}
