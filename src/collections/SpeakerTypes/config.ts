import { CollectionConfig } from 'payload'
import { eventManager } from '../Users/access/eventManager'
import { user } from '../Users/access/user'
import { slugField } from '@/fields/slug'
import { isActive } from '@/fields/isActive'

export const SpeakerTypes: CollectionConfig = {
  slug: 'speaker-types',
  labels: {
    singular: 'Speaker Type',
    plural: 'Speaker Types',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Speaker Management',
    defaultColumns: ['name', 'description', 'isActive', 'createdAt'],
    description: 'Manage speaker type categories (Domestic, International, etc.)',
  },
  access: {
    read: user,
    create: eventManager,
    update: eventManager,
    delete: eventManager,
  },
  fields: [
    {
      name: 'name',
      label: 'Type Name',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Unique name for the speaker type (e.g., Domestic, International)',
        placeholder: 'e.g., Government Dignitaries, Domestic, International, Virtual, Keynote',
      },
    },
    slugField,
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      admin: {
        rows: 3,
        description: 'Optional description of this speaker type',
        placeholder: 'e.g., Speakers traveling from outside the country...',
      },
    },
    {
      type: 'row',
      fields: [
        isActive,
        {
          name: 'sortOrder',
          label: 'Sort Order',
          type: 'number',
          defaultValue: 100,
          admin: {
            width: '50%',
            description: 'Order in which this appears in dropdowns (lower = first)',
          },
        },
      ],
    },

    // Additional configuration fields
    {
      type: 'collapsible',
      label: 'Type Configuration',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'requiresVisa',
          label: 'Requires Visa Documentation',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Whether speakers of this type typically need visa documents',
          },
        },
        {
          name: 'defaultAccommodation',
          label: 'Default Accommodation Type',
          type: 'select',
          options: [
            { label: 'Standard Hotel', value: 'standard_hotel' },
            { label: 'Premium Hotel', value: 'premium_hotel' },
            { label: 'Corporate Housing', value: 'corporate_housing' },
            { label: 'No Accommodation', value: 'none' },
          ],
          admin: {
            description: 'Default accommodation level for this speaker type',
          },
        },
        {
          name: 'averageBudget',
          label: 'Average Budget Range',
          type: 'group',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'min',
                  label: 'Minimum Budget',
                  type: 'number',
                  admin: {
                    width: '50%',
                    placeholder: '50000',
                  },
                },
                {
                  name: 'max',
                  label: 'Maximum Budget',
                  type: 'number',
                  admin: {
                    width: '50%',
                    placeholder: '200000',
                  },
                },
              ],
            },
            {
              name: 'currency',
              label: 'Currency',
              type: 'select',
              defaultValue: 'INR',
              options: [
                { label: 'Indian Rupee (₹)', value: 'INR' },
                { label: 'US Dollar ($)', value: 'USD' },
                { label: 'Euro (€)', value: 'EUR' },
                { label: 'British Pound (£)', value: 'GBP' },
              ],
            },
          ],
          admin: {
            description: 'Typical budget range for speakers of this type',
          },
        },
        {
          name: 'requiredDocuments',
          label: 'Required Documents',
          type: 'array',
          fields: [
            {
              name: 'document',
              label: 'Document Type',
              type: 'select',
              required: true,
              options: [
                { label: 'Passport Copy', value: 'passport' },
                { label: 'Visa Documents', value: 'visa' },
                { label: 'Flight Itinerary', value: 'flight_itinerary' },
                { label: 'Hotel Booking', value: 'hotel_booking' },
                { label: 'Speaker Agreement', value: 'speaker_agreement' },
                { label: 'Tax Forms', value: 'tax_forms' },
                { label: 'Photo ID', value: 'photo_id' },
                { label: 'Resume/CV', value: 'resume' },
              ],
            },
          ],
          admin: {
            description: 'Documents typically required for this speaker type',
          },
        },
      ],
    },

    // Metadata
    {
      type: 'collapsible',
      label: 'Metadata',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'color',
          label: 'Display Color',
          type: 'text',
          admin: {
            description: 'Hex color code for UI display (e.g., #FF5722 for International)',
            placeholder: '#2196F3',
          },
          // @ts-expect-error payload didnt do its magic yet
          validate: (value) => {
            if (value && !value.match(/^#[0-9A-Fa-f]{6}$/)) {
              return 'Please enter a valid hex color code (e.g., #FF5722)'
            }
            return true
          },
        },
        {
          name: 'icon',
          label: 'Icon Name',
          type: 'text',
          admin: {
            description: 'Material UI icon name or emoji for display',
            placeholder: '🌍 or FlightIcon',
          },
        },
        {
          name: 'usageCount',
          label: 'Usage Count',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
            description: 'Number of speakers using this type (auto-calculated)',
          },
        },
        {
          name: 'notes',
          label: 'Internal Notes',
          type: 'textarea',
          admin: {
            rows: 2,
            description: 'Internal notes for administrators',
          },
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ req, operation, data }) => {
        if (operation === 'create') {
          data.createdBy = req.user?.id
        }
        data.lastModifiedBy = req.user?.id
        return data
      },
    ],
    afterChange: [
      ({ doc, operation }) => {
        if (operation === 'create') {
          console.log(`New speaker type created: ${doc.name}`)
        }
      },
    ],
  },
  timestamps: true,
}
