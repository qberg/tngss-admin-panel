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

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Speakers, SpeakerTypes, Users, Media, Documents],
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
      bucket: process.env.DOCUMENTS_S3_BUCKET || 'tngss-documents',
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
