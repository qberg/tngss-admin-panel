import type { CollectionConfig } from 'payload'
import { anyone } from '../Users/access/anyone'
import { contentManager } from '../Users/access/contentManager'
import { eventManager } from '../Users/access/eventManager'

export const Documents: CollectionConfig = {
  slug: 'documents',
  labels: {
    singular: 'Document',
    plural: 'Documents',
  },
  access: {
    create: contentManager,
    update: contentManager,
    delete: eventManager,
    read: anyone,
  },
  admin: {
    useAsTitle: 'title',
    group: 'File Management',
  },
  upload: {
    staticDir: 'documents',
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'text/csv',
      'application/zip',
      'application/x-rar-compressed',
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Give a short brief on what the document is about',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'other',
      options: [
        {
          label: 'Flight Details',
          value: 'flight_details',
        },
        {
          label: 'Hotel Booking',
          value: 'hotel_booking',
        },
        {
          label: 'Visa Documents',
          value: 'visa_documents',
        },
        {
          label: 'Speaker Contract',
          value: 'speaker_contract',
        },
        {
          label: 'Presentation Materials',
          value: 'presentation_materials',
        },
        {
          label: 'Invoice/Receipt',
          value: 'invoice_receipt',
        },
        {
          label: 'ID Documents',
          value: 'id_documents',
        },
        {
          label: 'Event Materials',
          value: 'event_materials',
        },
        {
          label: 'Other',
          value: 'other',
        },
      ],
      admin: {
        width: '50%',
        description: 'Categorize for better organization',
        position: 'sidebar',
      },
    },
  ],
}
