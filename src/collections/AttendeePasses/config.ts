import { createAttendeePass, createAttendeePassesBulk } from '@/endpoints/attendee-passses/create'
import { organisationField } from '@/fields/organisation'
import { profileField } from '@/fields/profile'
import { sectorsField } from '@/fields/sectors'
import { whyAttendingField } from '@/fields/whyAttending'
import type { CollectionConfig } from 'payload'

export const AttendeePasses: CollectionConfig = {
  slug: 'attendee-passes',
  labels: {
    singular: 'Attendee Pass',
    plural: 'Attendee Passes',
  },
  access: {
    create: () => false,
    read: () => true,
    update: () => false,
    delete: () => false,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'pass_type', 'email', 'organisation', 'legacy_created_at'],
    listSearchableFields: ['name', 'email', 'organisation', 'pass_id'],
  },
  endpoints: [
    {
      path: '/create',
      method: 'post',
      handler: createAttendeePass,
    },
    {
      path: '/bulk',
      method: 'post',
      handler: createAttendeePassesBulk,
    },
  ],
  fields: [
    // data needs to come from visitor_pass_data
    {
      name: 'pass_id',
      type: 'text',
      label: 'Pass ID',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Unique pass identifier (e.g., TNGSSV_10914)',
        readOnly: true,
      },
    },

    {
      name: 'pass_type',
      type: 'text',
      label: 'Pass Type',
      required: true,
      admin: {
        readOnly: true,
      },
    },

    {
      name: 'pass_type_id',
      type: 'text',
      label: 'Pass Type ID',
      required: true,
      index: true,
      admin: {
        description: 'UUID identifier for the pass type',
        readOnly: true,
      },
    },
    //pass_data
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        readOnly: true,
      },
    },

    {
      name: 'email',
      type: 'email',
      index: true,
      admin: {
        description: 'Primary lookup field for app user onboarding',
        readOnly: true,
      },
    },

    {
      name: 'gender',
      type: 'text',
      admin: {
        description: 'From pass_data.gender',
        readOnly: true,
      },
    },

    {
      name: 'mobile',
      type: 'text',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'designation',
      type: 'text',
      admin: {
        description: 'Job title/role from pass_data.designation',
        readOnly: true,
      },
    },

    {
      name: 'organisation',
      type: 'text',
      index: true,
      admin: {
        description: 'Company/organisation from pass_data.organisation',
        readOnly: true,
      },
    },

    // registration context

    {
      name: 'registration_email',
      label: 'Registration Email',
      type: 'email',
      admin: {
        description: 'Email of person who made the booking (may differ from attendee)',
        readOnly: true,
      },
    },
    {
      name: 'registration_organisation',
      label: 'Registration organisation',
      type: 'text',
      admin: {
        description: 'Organization that made the booking',
        readOnly: true,
      },
    },
    {
      name: 'registration_city',
      label: 'City',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'registration_state',
      label: 'State',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'registration_country',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    organisationField,
    profileField,
    sectorsField,
    whyAttendingField,
    {
      name: 'website',
      type: 'text',
      admin: {
        description: 'Website URL from registration',
        readOnly: true,
      },
    },
    {
      name: 'legacy_created_at',
      type: 'date',
      label: 'Purchased On',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'When pass was originally created in PostgreSQL',
        readOnly: true,
      },
    },

    {
      name: 'legacy_visitor_id',
      type: 'text',
      required: true,
      label: 'Legacy Visitor ID',
      index: true,
      admin: {
        description: 'Original visitor_id from PostgreSQL (links to booking)',
        readOnly: true,
      },
    },

    // check in status
    {
      name: 'checked_in',
      type: 'checkbox',
      defaultValue: false,
      index: true,
      admin: {
        description: 'Has attendee checked in at event?',
      },
    },
    {
      name: 'checkin_data',
      type: 'json',
      admin: {
        description: 'Raw check-in data from PostgreSQL',
        readOnly: true,
      },
    },

    {
      name: 'migration_notes',
      type: 'textarea',
      admin: {
        description: 'Notes from data migration (e.g., value mappings applied)',
        readOnly: true,
      },
    },

    {
      name: 'upgrade',
      type: 'checkbox',
      label: 'Is Upgrade',
      defaultValue: false,
      admin: {
        description: 'Indicates if this is an upgrade from a previous pass type',
        readOnly: true,
      },
    },
  ],
}
