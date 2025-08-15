import type { Field } from 'payload'

export const minimalHeroField: Field = {
  name: 'hero',
  type: 'group',
  label: 'Hero',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
    },

    {
      name: 'sub_title',
      type: 'text',
      label: 'Sub Title',
    },

    {
      name: 'tagline',
      type: 'textarea',
      label: 'Tagline',
    },
  ],
}
