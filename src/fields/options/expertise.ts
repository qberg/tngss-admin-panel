import { anyoneFieldAcess } from '@/collections/Users/access/anyone'
import { eventManagerFieldAccess } from '@/collections/Users/access/eventManager'
import type { Field } from 'payload'

export const expertiseField: Field = {
  name: 'expertise',
  type: 'select',
  label: 'Expertise',
  hasMany: true,
  access: {
    read: anyoneFieldAcess,
    update: eventManagerFieldAccess,
  },
  options: [
    {
      label: '🤖 AI/ML',
      value: 'ai_ml',
    },
    {
      label: '📊 Data Science',
      value: 'data_science',
    },
    {
      label: '🌐 Web Development',
      value: 'web_development',
    },
    {
      label: '📱 Mobile Development',
      value: 'mobile_development',
    },
    {
      label: '☁️ Cloud Computing',
      value: 'cloud_computing',
    },
    {
      label: '🔒 Cybersecurity',
      value: 'cybersecurity',
    },
    {
      label: '🔧 DevOps',
      value: 'devops',
    },
    {
      label: '📋 Project Management',
      value: 'project_management',
    },
    {
      label: '🎨 UI/UX Design',
      value: 'ui_ux_design',
    },
    {
      label: '📣 Marketing',
      value: 'marketing',
    },
  ],
}
