import type { CollectionConfig } from 'payload'
import { anyone } from './Users/access/anyone'
import { contentManager } from './Users/access/contentManager'
import { eventManager } from './Users/access/eventManager'
import { auditFields } from '@/fields/audit'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: contentManager,
    read: anyone,
    update: contentManager,
    delete: eventManager,
  },
  admin: {
    group: 'File Management',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Alternative text for accessibility and SEO',
        placeholder: 'Describe what is shown in this image/video',
      },
    },
    {
      name: 'mediaType',
      type: 'select',
      label: 'Media Type',
      required: true,
      options: [
        {
          label: '📸 Speaker Photos',
          value: 'speaker_photos',
        },
        {
          label: '🎪 Event Images',
          value: 'event_images',
        },
        {
          label: '🎥 Event Videos',
          value: 'event_videos',
        },
        {
          label: '📈 Marketing Assets',
          value: 'marketing_assets',
        },

        {
          label: '🤝 Sponsorship',
          value: 'sponsorship',
        },
        {
          label: '🏢 Venue Photos',
          value: 'venue_photos',
        },
        {
          label: '🎤 Presentation Media',
          value: 'presentation_media',
        },
        {
          label: '🏷️ Logos & Branding',
          value: 'branding',
        },
        {
          label: '📱 Social Media',
          value: 'social_media',
        },
        {
          label: '📰 Press & Media',
          value: 'press_media',
        },
        {
          label: '🌐 Website Content',
          value: 'website_content',
        },
        {
          label: '📁 Other',
          value: 'other',
        },
      ],
      admin: {
        width: '50%',
        description: 'What type of media is this?',
        position: 'sidebar',
      },
    },

    auditFields,
  ],
  upload: {
    mimeTypes: [
      // Images
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      // Videos
      'video/mp4',
      'video/quicktime',
      'video/x-msvideo', // .avi
      'video/webm',
      'video/mpeg',
      'video/ogg',
    ],
  },
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        if (req.file && req.file.name) {
          const sanitizedName = req.file.name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9.\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '')

          if (sanitizedName) {
            data.filename = sanitizedName
          }
        }
        return data
      },
    ],
  },
}
