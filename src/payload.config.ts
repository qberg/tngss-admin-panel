// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { importExportPlugin } from '@payloadcms/plugin-import-export'
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
import { FaqWebPage } from './globals/FaqWebPage/config'
import { AppVersions } from './collections/AppVersions/config'
import { FeaturedContentApp } from './globals/FeaturedContentApp/config'
import { AboutTNGSSApp } from './globals/AboutTNGSSApp/config'
import { WhyAttendWebPage } from './globals/WhyAttendWebPage/config'
import { SponsAndPartnersWebPage } from './globals/SponsAndPartnersWebPage/config'
import { Tickets } from './collections/Tickets/config'
import { TicketsInfoWebPage } from './globals/TicketsInfoWebPage/config'
import { WhyTamilNaduWebPage } from './globals/WhyTamilNaduWebPage/config'
import { AttendeePasses } from './collections/AttendeePasses/config'
import { WhySponsorWebPage } from './globals/WhySponsorWebPage/config'
import { SponsorFormWebPage } from './globals/SponsorFormWebPage/config'
import { customBeforeEmail } from './emails/beforeEmailHandler'
import { NetworkingSessions } from './collections/NetworkingSessions/config'
import { OrganisationRoles } from './collections/OrganisationRoles/config'
import { getSectors } from './endpoints/sectors'
import { PressAndMediaFormWebPage } from './globals/PressAndMediaFormWebPage/config'
import { GlobalPavWebPage } from './globals/GlobalPavWebPage/config'

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
  endpoints: [
    {
      path: '/sectors',
      method: 'get',
      handler: getSectors,
    },
  ],
  // Email Config
  email: nodemailerAdapter({
    defaultFromAddress: process.env.FROM_MAIL || 'events@startuptn.in',
    defaultFromName: 'TNGSS 2025 - StartupTN',
    transportOptions: {
      host: process.env.MAIL_HOST,
      port: 587,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    },
  }),
  cors: [
    // Development
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',

    // Production domains
    'https://dev.tngss.startuptn.in',
    'https://tngss.startuptn.in',
    'https://www.tngss.startuptn.in',
    'https://tngss.in',
    'https://www.tngss.in',
    '*',
  ],

  globals: [
    HomeWebPage,
    AboutUsWebPage,
    WhyAttendWebPage,
    WhyTamilNaduWebPage,
    TicketsInfoWebPage,
    FaqWebPage,
    SponsAndPartnersWebPage,
    WhySponsorWebPage,
    SponsorFormWebPage,
    HomeAppPage,
    FeaturedContentApp,
    AboutTNGSSApp,
    PressAndMediaFormWebPage,
  ],
  collections: [
    Speakers,
    SpeakerTypes,
    Events,
    NetworkingSessions,
    EventFormats,
    EventTags,
    Halls,
    Zones,
    Veneues,
    Cities,
    Tickets,
    TicketTypes,
    Representatives,
    Users,
    Media,
    Documents,
    AppVersions,
    AttendeePasses,
    OrganisationRoles,
    GlobalPavWebPage,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
    connectOptions: {
      maxPoolSize: 100,
      minPoolSize: 20,
      maxIdleTimeMS: 60000,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      retryWrites: true,
      w: 'majority',
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    importExportPlugin({
      collections: ['speakers', 'events', 'form-submissions', 'attendee-passes'],
    }),
    // Form builder plugin
    formBuilderPlugin({
      fields: {
        text: true,
        textarea: true,
        select: true,
        email: true,
        state: true,
        country: true,
        checkbox: true,
        number: true,
        message: true,
        date: false,
        payment: false,
      },
      beforeEmail: customBeforeEmail,
    }),
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
