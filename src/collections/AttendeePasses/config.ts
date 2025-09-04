import { organisationField } from '@/fields/organisation'
import { profileField } from '@/fields/profile'
import { sectorsField } from '@/fields/sectors'
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
      type: 'select',
      label: 'Pass Type',
      required: true,
      options: [
        { label: 'TNGSS Visitor', value: 'TNGSS Visitor' },
        { label: 'TNGSS Conference', value: 'TNGSS Conference' },
      ],
      admin: {
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
      type: 'select',
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Other', value: 'other' },
      ],
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
      name: 'legacy_visitor_id',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'Original visitor_id from PostgreSQL (links to booking)',
        readOnly: true,
      },
    },

    {
      name: 'registration_email',
      type: 'email',
      admin: {
        description: 'Email of person who made the booking (may differ from attendee)',
        readOnly: true,
      },
    },
    {
      name: 'registration_organisation',
      type: 'text',
      admin: {
        description: 'Organization that made the booking',
        readOnly: true,
      },
    },
    {
      name: 'registration_city',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'registration_state',
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
    profileField,
    sectorsField,
    organisationField,

    {
      name: 'why_attending',
      type: 'text',
      admin: {
        description: 'Reason for attending from registration',
        readOnly: true,
      },
    },
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
  ],
}

{
  /*

pass_id       | TNGSSV_10914
visitor_id    | 325cf3e3-7233-40af-922a-4d111904fd89
conference_id | f171cd44-8007-4ad2-beea-c487c1827246
pass_data     | {"name": "John Doe", "email": "info+2@showbay.io", "gender": "male", "mobile": "+91900323498", "designation": "Tester", "organisation": "Kameleon Technologies"}
created_at    | 2025-08-24 18:58:44.504989+00
updated_at    | 2025-08-24 18:58:44.504989+00
checkin_data  |



visitor_id   | 325cf3e3-7233-40af-922a-4d111904fd89
visitor_data | {"city": "Tiruchirappalli", "name": "Kameleon Technologies", "email": "info+1@showbay.io", "state": "TN", "mobile": "+91900323498", "country": "IN", "pincode": "620005", "personName": "John Doe", "profileType": "corporates", "visitorData": [{"name": "John Doe", "email": "info+2@showbay.io", "gender": "male", "mobile": "+91900323498", "designation": "Tester", "organisation": "Kameleon Technologies"}], "organisation": "Kameleon Technologies", "conference_id": "f171cd44-8007-4ad2-beea-c487c1827246", "sectorIntrested": "art_culture_architecture", "organisationType": "ecosystem_enablers", "personDesignation": "Tester"}
created_at   | 2025-08-24 18:58:44.503315+00
updated_at   | 2025-08-24 18:58:44.503315+00
expo_id      | 0632d025-28d8-4650-92ed-f240a695d023
order_id     |

*/
}
