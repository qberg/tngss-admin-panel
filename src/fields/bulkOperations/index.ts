import type { Field } from 'payload'

export const bulkOperationsField: Field = {
  type: 'collapsible',
  label: '📊 Bulk Operations',
  admin: {
    initCollapsed: true,
    description: 'Bulk upload and download operations',
  },
  fields: [
    {
      name: 'downloadTemplate',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/admin/DownloadTemplateButton',
        },
      },
    },
  ],
}
