import type { Field } from 'payload'

export const faqBlock: Field = {
  name: 'faq_block',
  type: 'group',
  label: 'FAQ Block',
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading for the Block',
    },
    {
      name: 'questions_and_answers',
      type: 'array',
      label: 'Questions and Answers',
      fields: [
        {
          name: 'question',
          type: 'text',
          label: 'Question',
        },
        {
          name: 'answer',
          type: 'array',
          fields: [
            {
              name: 'paragraph',
              type: 'textarea',
              label: 'Paragraph',
            },
          ],
        },
      ],
    },
  ],
}
