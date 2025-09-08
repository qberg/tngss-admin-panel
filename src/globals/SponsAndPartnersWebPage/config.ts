import { anyone } from '@/collections/Users/access/anyone'
import { eventManager } from '@/collections/Users/access/eventManager'
import { createSponsorField } from '@/fields/sponsorField'
import type { GlobalConfig } from 'payload'

const sponsorTiers = [
  { name: 'diamond', label: 'Diamond Sponsor', format: '420x250' },
  { name: 'platinum', label: 'Platinum Sponsor', format: '380x200' },
  { name: 'gold', label: 'Gold Sponsor', format: '340x180' },
  { name: 'silver', label: 'Silver Sponsor', format: '240x125' },
  { name: 'bronze', label: 'Bronze Sponsor', format: '220x105' },
]

export const SponsAndPartnersWebPage: GlobalConfig = {
  slug: 'spons-and-partners-wp',
  label: 'Sponsors And Partners - Website',
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
          fields: [
            ...sponsorTiers.map((tier) => createSponsorField(tier.name, tier.label, tier.format)),
            createSponsorField('other', 'Other Sponsor Tiers', '200x90', true),
          ],
          name: 'sponsors',
          label: 'Sponsors',
        },

        {
          name: 'partners',
          label: 'Partners',
          fields: [createSponsorField('partners', 'Partners', '200x90', true)],
        },
      ],
    },
  ],
}
