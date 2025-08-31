import type { CollectionConfig } from 'payload'
import { admin } from '../Users/access/admin'
import { anyone, anyoneFieldAcess } from '../Users/access/anyone'
import { contentManager, contentManagerFieldAccess } from '../Users/access/contentManager'
import { slugField } from '@/fields/slug'
import { auditFields } from '@/fields/audit'
import { isPublic } from '@/fields/isPublic'

const publicFieldAccess = {
  read: anyoneFieldAcess,
  update: contentManagerFieldAccess,
}

const currencyOptions = [
  { label: 'Indian Rupee (₹)', value: 'INR' },
  { label: 'US Dollar ($)', value: 'USD' },
  { label: 'Euro (€)', value: 'EUR' },
  { label: 'British Pound (£)', value: 'GBP' },
  { label: 'Canadian Dollar (C$)', value: 'CAD' },
  { label: 'Australian Dollar (A$)', value: 'AUD' },
  { label: 'Singapore Dollar (S$)', value: 'SGD' },
  { label: 'Japanese Yen (¥)', value: 'JPY' },
]

export const Tickets: CollectionConfig = {
  slug: 'tickets',
  labels: {
    singular: 'Ticket',
    plural: 'Tickets',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'description', 'pricing.is_free', 'isPublic'],
  },
  access: {
    create: admin,
    read: anyone,
    update: contentManager,
    delete: admin,
  },
  fields: [
    slugField,
    isPublic,
    {
      name: 'name',
      access: publicFieldAccess,
      type: 'text',
      label: 'Name of the Ticket',
    },
    {
      name: 'description',
      access: publicFieldAccess,
      type: 'text',
      label: 'Description',
    },
    {
      name: 'badge_text',
      label: 'Badge Text',
      type: 'text',
      admin: {
        placeholder: 'Text to be displayed in the badge of the card',
      },
    },
    {
      name: 'pricing',
      type: 'group',
      fields: [
        {
          name: 'is_free',
          access: publicFieldAccess,
          type: 'checkbox',
          defaultValue: false,
          label: 'Free',
        },
        {
          name: 'has_discount',
          access: publicFieldAccess,
          type: 'checkbox',
          defaultValue: false,
          label: 'Offer Discount Pricing',
          admin: {
            condition: (_, siblingData) => Boolean(!siblingData.is_free),
            description: 'Enable this to offer discounted prices alongside regular pricing',
          },
        },
        {
          name: 'discount_info',
          type: 'group',
          label: 'Discount Information',
          access: publicFieldAccess,
          admin: {
            condition: (_, siblingData) =>
              Boolean(!siblingData.is_free && siblingData.has_discount),
          },
          fields: [
            {
              name: 'discount_text',
              type: 'text',
              label: 'Discount info',
              admin: {
                placeholder:
                  'e.g., "Prices go up after 25th Aug" or "Early bird pricing until Sep 15th"',
                description: 'Text to display about when discount pricing ends',
              },
            },
          ],
        },
        {
          name: 'base_currency',
          access: publicFieldAccess,
          type: 'select',
          label: 'Base Currency',
          defaultValue: 'INR',
          options: currencyOptions,
          admin: {
            condition: (_, siblingData) => Boolean(!siblingData.is_free),
            description: 'The primary currency for this ticket',
          },
        },
        {
          name: 'currency_prices',
          label: 'Prices by Currency',
          type: 'array',
          access: publicFieldAccess,
          admin: {
            condition: (_, siblingData) => Boolean(!siblingData.is_free),
            description: 'Add prices for different currencies',
          },
          fields: [
            {
              name: 'currency',
              type: 'select',
              label: 'Currency',
              options: currencyOptions,
              required: true,
              admin: {
                width: '30%',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'actual_price',
                  type: 'number',
                  label: 'Regular Price',
                  min: 0,
                  required: true,
                  admin: {
                    width: '50%',
                    step: 100,
                  },
                },
                {
                  name: 'discounted_price',
                  type: 'number',
                  label: 'Discounted Price',
                  min: 0,
                  admin: {
                    width: '50%',
                    step: 100,
                    condition: (data) => {
                      return Boolean(data?.pricing?.has_discount)
                    },
                    description: 'Optional discounted price (must be less than regular price)',
                  },
                },
                {
                  name: 'unit',
                  type: 'text',
                  label: 'Unit',
                },
              ],
            },
            {
              name: 'gst',
              type: 'group',
              label: 'Tax Information',
              fields: [
                {
                  name: 'tax_applicable',
                  type: 'checkbox',
                  label: 'Tax Applicable',
                  defaultValue: false,
                },
                {
                  type: 'row',
                  admin: {
                    condition: (_, siblingData) => Boolean(siblingData.tax_applicable),
                  },
                  fields: [
                    {
                      name: 'tax_rate',
                      type: 'number',
                      label: 'Tax Rate (%)',
                      min: 0,
                      max: 100,
                      admin: {
                        width: '50%',
                        step: 1,
                        placeholder: 'e.g., 18 for GST in India',
                      },
                    },
                    {
                      name: 'tax_inclusive',
                      type: 'checkbox',
                      label: 'Price is Tax Inclusive',
                      defaultValue: false,
                      admin: {
                        width: '50%',
                      },
                    },
                  ],
                },
                {
                  name: 'tax_code',
                  type: 'text',
                  label: 'Tax Code',
                  admin: {
                    condition: (_, siblingData) => Boolean(siblingData.tax_applicable),
                    placeholder: 'HSN/SAC code, VAT code, etc.',
                  },
                },
                {
                  name: 'tax_label',
                  type: 'text',
                  label: 'Tax Label',
                  admin: {
                    condition: (_, siblingData) => Boolean(siblingData.tax_applicable),
                    placeholder: 'GST, VAT, Sales Tax, etc.',
                  },
                },
              ],
            },
            {
              name: 'currency_notes',
              type: 'textarea',
              label: 'Currency-specific Notes',
              admin: {
                placeholder: 'Any specific terms or conditions for this currency',
                rows: 2,
              },
            },
          ],
          // @ts-expect-error payload magic not done yet
          validate: (value, { siblingData }) => {
            // @ts-expect-error payload magic not done yet
            if (!siblingData?.is_free && (!value || value.length === 0)) {
              return 'At least one currency price is required for paid tickets'
            }
          },
        },
        {
          name: 'pricing_notes',
          type: 'textarea',
          label: 'General Pricing Notes',
          access: publicFieldAccess,
          admin: {
            condition: (_, siblingData) => Boolean(!siblingData.is_free),
            placeholder: 'General pricing information, terms, or conditions',
            rows: 3,
          },
        },
      ],
    },

    {
      name: 'auto_currency_detection',
      type: 'checkbox',
      label: 'Auto-detect currency from user browser',
      access: publicFieldAccess,
      defaultValue: true,
      admin: {
        condition: (_, siblingData) => {
          return Boolean(
            !siblingData.pricing?.is_free && siblingData.pricing?.currency_prices?.length > 1,
          )
        },
        position: 'sidebar',
        description:
          "Automatically show pricing in user's local currency based on browser settings",
      },
    },

    {
      name: 'features',
      label: 'Included Features',
      type: 'array',
      access: publicFieldAccess,
      fields: [
        {
          name: 'feature',
          type: 'text',
          required: true,
          admin: {
            placeholder: 'Access to all sessions, Premium lunch, Networking dinner',
          },
        },
      ],
      admin: {
        description: 'List of benefits included with this ticket type',
      },
    },
    auditFields,
  ],
}
