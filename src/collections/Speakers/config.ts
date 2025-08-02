import type { CollectionConfig } from 'payload'
import { eventManager, eventManagerFieldAccess } from '../Users/access/eventManager'
import { anyone, anyoneFieldAcess } from '../Users/access/anyone'
import { userFieldAccess } from '../Users/access/user'

const publicFieldAccess = {
  read: anyoneFieldAcess,
  update: eventManagerFieldAccess,
}

const adminFieldAccess = {
  read: userFieldAccess,
  update: eventManagerFieldAccess,
}

const travelFieldAcess = {
  read: userFieldAccess,
  update: eventManagerFieldAccess,
}

export const Speakers: CollectionConfig = {
  slug: 'speakers',
  labels: {
    singular: 'Speaker',
    plural: 'Speakers',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Speaker Management',
  },
  access: {
    create: eventManager,
    read: anyone,
    update: eventManager,
    delete: eventManager,
  },
  fields: [
    // Public Frontend Fields
    {
      type: 'collapsible',
      label: '🌍 Public Frontend Data',
      admin: {
        initCollapsed: false,
        description: 'Fields exposed to frontend applications',
      },
      fields: [
        {
          name: 'profile_image',
          label: 'Profile Image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          access: publicFieldAccess,
          admin: {
            description: 'Upload image of the speaker',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              access: publicFieldAccess,
              admin: {
                width: '50%',
              },
            },
            {
              name: 'designation',
              type: 'text',
              required: true,
              access: publicFieldAccess,
              admin: {
                width: '50%',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'linkedin_url',
              label: 'LinkedIn Profile URL',
              type: 'text',
              access: publicFieldAccess,
              // @ts-expect-error payload didnt do its magic yet
              validate: (val: string) => {
                if (val && !val.match(/^https?:\/\/.+/)) {
                  return 'Please enter a valid URL'
                }
                return true
              },
            },
          ],
        },
        {
          name: 'location',
          label: 'Location',
          type: 'group',
          fields: [
            {
              name: 'city',
              label: 'City',
              type: 'text',
              required: true,
            },
            {
              name: 'country',
              label: 'Country',
              type: 'text',
              required: true,
            },
          ],
          access: publicFieldAccess,
        },
        {
          name: 'summary',
          label: 'About/Bio Summary',
          type: 'textarea',
          access: publicFieldAccess,
          admin: {
            rows: 4,
          },
        },
        {
          name: 'experience',
          label: 'Professional Experience',
          type: 'array',
          access: publicFieldAccess,
          fields: [
            {
              name: 'organization_name',
              label: 'Organization Name',
              type: 'text',
              required: true,
              admin: {
                width: '50%',
              },
            },
            {
              name: 'designation',
              label: 'Job Title',
              type: 'text',
              required: true,
              admin: {
                width: '50%',
              },
            },
            {
              name: 'currently_work_here',
              label: 'Currently Work Here',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'from_date',
                  label: 'Start Date',
                  type: 'date',
                  required: true,
                  admin: {
                    width: '50%',
                    date: {
                      pickerAppearance: 'dayOnly',
                    },
                  },
                },
                {
                  name: 'to_date',
                  label: 'End Date',
                  type: 'date',
                  admin: {
                    width: '50%',
                    condition: (siblingData) => !siblingData?.currently_work_here,
                    date: {
                      pickerAppearance: 'dayOnly',
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    },

    {
      type: 'collapsible',
      label: '✈️ Travel & Accommodation (Event Manager Only)',
      admin: {
        initCollapsed: true,
        description: 'Travel and accommodation management',
      },
      fields: [
        {
          name: 'flight_details',
          label: 'Flight Details (File URL)',
          type: 'text',
          required: true,
          access: travelFieldAcess,
          admin: {
            description: 'URL to uploaded flight details document',
            placeholder: 'https://cdn.example.com/documents/flight-details.pdf',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'hotel',
              label: 'Hotel Name',
              type: 'text',
              required: true,
              access: travelFieldAcess,
              admin: {
                width: '50%',
              },
            },
            {
              name: 'room_number',
              label: 'Room Number',
              type: 'text',
              required: true,
              access: travelFieldAcess,
              admin: {
                width: '50%',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'stay_duration',
              label: 'Stay Duration',
              type: 'text',
              required: true,
              access: travelFieldAcess,
              admin: {
                width: '50%',
                placeholder: 'e.g., Aug 15-17, 2025 (3 nights)',
              },
            },
            {
              name: 'accommodation_details',
              label: 'Accommodation Details',
              type: 'textarea',
              required: true,
              access: travelFieldAcess,
              admin: {
                width: '50%',
                rows: 3,
                description: 'Special requirements, preferences, etc.',
              },
            },
          ],
        },
      ],
    },

    //Admin purposes
    {
      type: 'collapsible',
      label: '🔐 Admin Management (Not in Frontend APIs)',
      admin: {
        initCollapsed: true,
        description: 'Administrative fields - automatically excluded from public APIs',
      },
      fields: [
        {
          name: 'status',
          label: 'Speaker Status',
          type: 'select',
          defaultValue: 'confirmed',
          options: [
            { label: 'Confirmed', value: 'confirmed' },
            { label: 'Pending', value: 'pending' },
            { label: 'Cancelled', value: 'cancelled' },
            { label: 'Completed', value: 'completed' },
          ],
          access: adminFieldAccess,
          admin: {
            width: '50%',
          },
        },
      ],
    },
  ],
}
