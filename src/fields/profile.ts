import type { Field } from 'payload'

export const profileField: Field = {
  name: 'profile_type',
  type: 'select',
  label: 'Profile Type',
  required: true,
  options: [
    // Startup profiles
    { label: 'DPIIT', value: 'dpii' },
    { label: 'Non DPIIT', value: 'non_dpiit' },

    // Aspirant profiles
    { label: 'College Students', value: 'college_student' },
    { label: 'Working Professionals', value: 'working_professional' },

    // Government profiles
    { label: 'State Government', value: 'state_government' },
    { label: 'Union Government', value: 'union_government' },
    { label: 'International', value: 'international' },

    // Investor profiles
    { label: 'Banks', value: 'banks' },
    { label: 'HNIs', value: 'hnis' },
    { label: 'Angel Investor', value: 'angel_investor' },
    { label: 'Venture Capitalists (VCs)', value: 'venture_capitalists' },
    { label: 'Angel Networks', value: 'angel_networks' },
    { label: 'Family Office', value: 'family_office' },
    { label: 'Private Equity', value: 'private_equity' },
    { label: 'Revenue Based Financing', value: 'revenue_based_financing' },
    { label: 'Venture Debt', value: 'venture_debt' },
    { label: 'Limited Partners', value: 'limited_partners' },

    // Mentor profiles
    { label: 'Mentor', value: 'mentor' },
    { label: 'Subject Matter Expert', value: 'subject_matter_expert' },

    // Ecosystem Partner profiles
    { label: 'Education Institution', value: 'education_institution' },
    { label: 'Business & Social Forums', value: 'business_social_forums' },
    { label: 'Startup Community', value: 'startup_community' },
    { label: 'NGO', value: 'ngo' },
    { label: 'Media Agency', value: 'media_agency' },
    { label: 'R&D Agency', value: 'r&d_agency' },
    { label: 'Legal & Compliance Services', value: 'legal_compliance_services' },
    { label: 'Consulting and Advisory Services', value: 'consulting_advisory_services' },
    { label: 'Coworking Space', value: 'coworking_space' },
    { label: 'Makerspace', value: 'makerspace' },
    { label: 'Financial Services', value: 'financial_services' },
    { label: 'Technology Services', value: 'technology_services' },
    { label: 'Marketing and Branding Services', value: 'marketing_branding_services' },
    { label: 'Design Agency', value: 'design_agency' },
    { label: 'Industry Association', value: 'industry_association' },

    // Incubation/Acceleration
    { label: 'Incubators', value: 'incubators' },
    { label: 'Accelerators', value: 'accelerators' },

    // Legacy/Fallback (for migration)
    { label: 'Corporates', value: 'corporates' },

    // not Applicable
    { label: 'Not Applicable', value: 'none' },
  ],
  index: true,
  admin: {
    description: 'From visitor_data.profileType - detailed user categorization',
  },
}
