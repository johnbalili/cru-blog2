import path from 'path'

import { payloadCloud } from '@payloadcms/plugin-cloud'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { webpackBundler } from '@payloadcms/bundler-webpack'
import { slateEditor } from '@payloadcms/richtext-slate'
import { buildConfig } from 'payload/config'
import {
  lexicalEditor
} from '@payloadcms/richtext-lexical'

import Users from './collections/Users'

export default buildConfig({
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
  },
  editor: slateEditor({}),
  collections: [
    {
      slug: 'posts',
      access:{
        read: () => true,
        create: () => true,
        update: () => true,
        delete: () => true,
      },
      fields:[
        {
        name: 'title',
        type: 'text',
        required: true,
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
        },
        {
          name: 'author',
          type: 'text',
          required: true,
        },
        {
          name: 'position',
          type: 'text',
          required: true,
        },
        {
          name: 'author_image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'category',
          type: 'relationship',
          relationTo: 'categories',
        },
        {
          name: 'date',
          type: 'date',
        },
        {
          name: 'content',
          type: 'richText',
          editor: lexicalEditor(),
        },
        {
          name: 'excerpt',
          type: 'textarea',
        },
        {
          name: 'featured_image',
          type: 'upload',
          relationTo: 'media'
        }
      ]
    },
    { 
      slug: 'media',
      access:{
        read: () => true,
        create: () => true,
        update: () => true,
        delete: () => true,
      },
      fields: [
        {
          name: 'alt',
          type: 'text',
        }
      ],
      upload: true
    },
    {
      slug: 'categories',
      access:{
        read: () => true,
        create: () => true,
        update: () => true,
        delete: () => true,
      },
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'slug',
          type: 'text',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        }
      ],
    },
    Users
  ],
  upload: {
    limits: {
      fileSize: 2000000,
    }
  },
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  plugins: [payloadCloud()],
  csrf: ['http://localhost:5173',
    'http://localhost',
    'https://cru.io/'
  ],
  cors: ['http://localhost:5173', 'http://localhost', 'https://cru.io/'],
  rateLimit: {
    trustProxy: true,
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
})
