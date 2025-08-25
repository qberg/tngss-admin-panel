import type { CollectionConfig } from 'payload'
import { eventManager, eventManagerFieldAccess } from '../Users/access/eventManager'
import { anyone, anyoneFieldAcess } from '../Users/access/anyone'
import { userFieldAccess } from '../Users/access/user'
import { durationField } from '@/fields/duration'
import { bulkOperationsField } from '@/fields/bulkOperations'
import { auditFields } from '@/fields/audit'
import { slugField } from '@/fields/slug'
import { isPublic } from '@/fields/isPublic'

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
    defaultColumns: ['name', 'designation', 'assigned_coordinator', 'isPublic'],
  },
  access: {
    create: eventManager,
    read: anyone,
    update: eventManager,
    delete: eventManager,
  },
  fields: [
    slugField,
    isPublic,
    {
      name: 'speaks_at',
      label: 'Speaks At',
      type: 'select',
      hasMany: true,
      options: [
        { value: 'main_event', label: 'Main Event' },
        { value: 'partner_event', label: 'Partner Event' },
      ],
      admin: {
        position: 'sidebar',
      },
    },

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
            {
              name: 'organization',
              type: 'text',
              required: true,
              access: publicFieldAccess,
              admin: {
                width: '50%',
              },
            },
            {
              name: 'speaker_type',
              type: 'relationship',
              relationTo: 'speaker-types',
              required: true,
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
              type: 'row',
              fields: [
                {
                  name: 'city',
                  label: 'City',
                  type: 'text',
                },
                {
                  name: 'country',
                  label: 'Country',
                  type: 'text',
                },
              ],
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
          type: 'array',
          label: 'Experience',
          access: publicFieldAccess,
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'company',
                  type: 'text',
                  label: 'Company',
                },

                {
                  name: 'area',
                  type: 'text',
                  label: 'Area',
                },
              ],
            },

            {
              name: 'designation',
              type: 'text',
              label: 'Designation',
            },
          ],
        },

        {
          name: 'alma_matter',
          type: 'array',
          label: 'Education',
          access: publicFieldAccess,
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'college',
                  type: 'text',
                  label: 'College',
                },
                {
                  name: 'city',
                  type: 'text',
                  label: 'City',
                },
              ],
            },
            {
              name: 'degree',
              type: 'text',
              label: 'Degree',
            },
          ],
        },

        {
          name: 'languages',
          type: 'array',
          access: publicFieldAccess,
          label: 'Languages Known',
          fields: [
            {
              name: 'lang',
              type: 'text',
            },
          ],
        },
        {
          name: 'tags',
          type: 'relationship',
          access: publicFieldAccess,
          hasMany: true,
          relationTo: 'tags',
          label: 'Tags',
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
          name: 'travel_details',
          label: 'Travel Files',
          access: travelFieldAcess,
          type: 'array',

          admin: {
            description: 'Upload flight details - add as many documents or images as needed',
            initCollapsed: false,
            isSortable: true,
          },
          fields: [
            {
              name: 'file_type',
              label: 'File Type',
              type: 'radio',
              defaultValue: 'document',
              options: [
                {
                  label: 'Document (PDF)',
                  value: 'document',
                },
                {
                  label: 'Image/Media',
                  value: 'media',
                },
              ],
            },

            {
              name: 'document',
              type: 'upload',
              label: 'Document File',
              relationTo: 'documents',
              admin: {
                condition: (_, siblingData) => {
                  return siblingData?.file_type === 'document'
                },
                description: 'Upload PDF document',
              },
            },

            {
              name: 'media',
              type: 'upload',
              label: 'Image/Media File',
              required: true,
              relationTo: 'media',
              admin: {
                condition: (_, siblingData) => {
                  return siblingData?.file_type === 'media'
                },
                description: 'Upload image file (JPG, PNG, etc.)',
              },
            },
            {
              name: 'description',
              label: 'Description',
              type: 'text',
              admin: {
                placeholder: 'e.g., Outbound flight, Return flight, Boarding pass, etc.',
                description: 'Optional description for this file',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'hotel',
              label: 'Hotel Name',
              type: 'text',
              access: travelFieldAcess,
              admin: {
                width: '50%',
              },
            },

            {
              name: 'hotel_map_url',
              label: 'Hotel Map Url',
              type: 'text',
              access: travelFieldAcess,
              admin: {
                width: '50%',
                placeholder: 'https://googlemaps.com/...',
              },
            },
            {
              name: 'room_number',
              label: 'Room Number',
              type: 'text',
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
              name: 'assigned_coordinator',
              type: 'relationship',
              relationTo: 'representatives',
              label: 'Assigned Coordinator',
              access: travelFieldAcess,
              admin: {
                width: '50%',
              },
            },
            {
              name: 'accommodation_details',
              label: 'Accommodation Details',
              type: 'textarea',
              access: travelFieldAcess,
              admin: {
                width: '50%',
                rows: 3,
                description: 'Special requirements, preferences, etc.',
              },
            },
          ],
        },
        durationField,
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

    bulkOperationsField,

    {
      name: 'sort_order',
      type: 'number',
      label: 'Display Priority Order',
      access: publicFieldAccess,
      defaultValue: 1,
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first (1 = highest)',
      },
    },

    {
      name: 'speaking_events',
      type: 'join',
      collection: 'events',
      on: 'speakers.speaker',
    },
    auditFields,
  ],
}
