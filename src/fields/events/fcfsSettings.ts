import type { Field } from 'payload'
import { capacitySettingsField } from './capacitySettings'
import { registerationField } from '../duration'
import { publicFieldAccess } from '@/collections/Users/access/groups'

export const fcfsSettingsField: Field = {
  type: 'group',
  name: 'fcfs_settings',
  label: 'First Come First Serve Settings',
  access: publicFieldAccess,
  admin: {
    condition: (data) => data?.registeration_mode === 'fcfs',
    description: 'Settings specific to FCFS registeration',
  },
  fields: [
    capacitySettingsField,

    {
      type: 'row',
      fields: [
        {
          name: 'enable_waitlist',
          type: 'checkbox',
          label: 'Enable Waitlist',
          defaultValue: false,
          admin: {
            description: 'Allow users to join waitlist when event reaches capacity',
            width: '50%',
            condition: (_, siblingData) => {
              return siblingData?.capacity_settings?.capacity_type === 'limited'
            },
          },
        },

        {
          name: 'waitlist_capacity',
          type: 'number',
          label: 'Waitlist Capacity',
          defaultValue: 10,
          admin: {
            description: 'Maximum capacity of the waitlist',
            width: '50%',
            condition: (_, siblingData) => {
              return siblingData?.enable_waitlist
            },
          },
        },

        {
          name: 'auto_promote_from_waitlist',
          type: 'checkbox',
          label: 'Auto Promote from Waitlist',
          defaultValue: true,
          admin: {
            width: '50%',
            description: 'Automatically paromote users when spots become available',
            condition: (_, siblingData) => siblingData?.enable_waitlist,
          },
        },
      ],
    },

    registerationField,

    /*
      type: 'row',
      fields: [
        {
          name: 'max_registerations_per_user',
          type: 'number',
          label: 'Max Registerations Per User',
          defaultValue: 5,
          min: 1,
          max: 10,
          admin: {
            description: 'How many times can one user register for thsi event?',
            width: '100%',
          },
        },

        {
          name: 'enable_rapid_registeration',
          label: 'Enable Rapid Registeration',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            width: '100%',
            description:
              'Skip confirmation screens for faster registration (good for unlimited capacity events)',
          },
        },
      ],
    */

    // capacity monitoring for unlimited events
    {
      type: 'group',
      name: 'unlimited_capacity_settings',
      label: 'Unlimited Capacity Monitoring',
      admin: {
        condition: (data) => data?.capacity_settings?.capacity_type === 'unlimited',
      },
      fields: [
        {
          name: 'notify_admins_at',
          label: 'Notify Admins at Registeration Count',
          type: 'number',
          admin: {
            description: 'Send notification to admins when registrations reach this number',
            placeholder: '500',
            width: '50%',
          },
        },

        {
          name: 'auto_close_registeration_at',
          label: 'Auto Close Registerations at Count',
          type: 'number',
          admin: {
            description: 'Automatically close registration at this number (optional safety limit)',
            placeholder: '10000',
            width: '50%',
          },
        },
      ],
    },
  ],
}
