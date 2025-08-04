import type { Field } from 'payload'

export const ctaField: Field = {
  name: 'cta',
  type: 'group',
  label: 'CTA',
  fields: [
    {
      name: 'label',
      type: 'text',
      label: 'Label',
    },
    {
      name: 'type',
      type: 'radio',
      options: [
        { label: 'Page', value: 'internal' },
        { label: 'Custom URL', value: 'external' },
      ],
      defaultValue: 'internal',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'page',
      type: 'text',
      admin: {
        condition: (_, siblingData) => Boolean(siblingData?.type === 'internal'),
        placeholder: 'Enter the page in the website to navigate to e.g. /about, /home,...',
        width: '50%',
      },
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        condition: (_, siblingData) => Boolean(siblingData?.type === 'external'),
        placeholder: 'Enter the custom url to navigate to, e.g.https://example.com',
      },
    },
  ],
}
