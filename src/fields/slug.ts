import type { Field } from 'payload'

export const createSlugField = (sourceField: string = 'name'): Field => {
  return {
    name: 'slug',
    type: 'text',
    label: 'URL Slug',
    admin: {
      position: 'sidebar',
      description: `URL-friendly identifier (English only, auto-generated from ${sourceField})`,
    },
    hooks: {
      beforeValidate: [
        ({ value, data }) => {
          if (!value && data?.name) {
            return data.name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)+/g, '')
          }

          return value
        },
      ],
    },
    index: true,
    unique: true,
  }
}

// Default slug field that uses 'name'
export const slugField: Field = createSlugField('name')
// other options
export const slugFromTitle: Field = createSlugField('title')
