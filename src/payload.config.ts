// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Media } from './collections/Media'
import { Users } from './collections/Users/config'
import { s3Storage } from '@payloadcms/storage-s3'
import { Documents } from './collections/Documents/config'
import { Speakers } from './collections/Speakers/config'
import { SpeakerTypes } from './collections/SpeakerTypes/config'
import { Representatives } from './collections/Representatives/config'
import { AboutUsWebPage } from './globals/AboutUsWebPage/config'
import { HomeWebPage } from './globals/HomeWebPage/config'
import { Veneues } from './collections/Venues/config'
import { EventFormats } from './collections/EventFormats/config'
import { Events } from './collections/Events/config'
import { EventTags } from './collections/EventTags/config'
import { Halls } from './collections/Halls/config'
import { Zones } from './collections/Zones/config'
import { Cities } from './collections/Cities/config'
import { TicketTypes } from './collections/TicketTypes/config'
import { HomeAppPage } from './globals/HomeAppPage/config'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- TNGSS Admin Panel',
      description: 'TNGSS Event Management System Admin Panel',
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    // Component overrides
    components: {
      graphics: {
        Logo: '/components/admin/Logo',
        Icon: '/components/admin/Icon',
      },

      beforeDashboard: ['/components/admin/WelcomeMessage'],

      views: {
        dashboard: {
          Component: '/components/admin/custom-dashboard/DashboardServer',
        },
      },
    },
  },
  cors: [
    // Development
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',

    // Production domains
    'https://dev.tngss.startuptn.in',
    'https://tngss.startuptn.in',
    '*',
  ],

  globals: [HomeWebPage, AboutUsWebPage, HomeAppPage],
  collections: [
    Speakers,
    SpeakerTypes,
    Events,
    EventFormats,
    EventTags,
    Halls,
    Zones,
    Veneues,
    Cities,
    TicketTypes,
    Representatives,
    Users,
    Media,
    Documents,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
    s3Storage({
      collections: {
        media: {
          generateFileURL: ({ filename }) => {
            return `${process.env.CLOUDFRONT_URL}/${filename}`
          },
        },
      },
      bucket: process.env.MEDIA_S3_BUCKET || 'tngss-payload-media',
      config: {
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        },
        region: process.env.AWS_REGION || 'ap-south-1',
      },
    }),

    s3Storage({
      collections: {
        documents: {
          generateFileURL: ({ filename }) => {
            return `${process.env.CDN_BASE_URL}/${filename}`
          },
        },
      },
      bucket: process.env.DOCUMENTS_S3_BUCKET || 'tngss-payload-media',
      config: {
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        },
        region: process.env.AWS_REGION || 'ap-south-1',
      },
    }),
  ],
})
