import type { Field } from 'payload'

export const profileField: Field = {
  name: 'profile_type',
  type: 'select',
  required: true,
  options: [
    // Startup options
    { label: 'DPIIT', value: 'dpii' },
    { label: 'Non DPIIT', value: 'non_dpiit' },
    // Aspirants/Individuals options
    { label: 'College Students', value: 'college_student' },
    { label: 'Working Professionals', value: 'working_professional' },
    { label: 'Business Owners', value: 'business_owner' },
    { label: 'Research Scholars', value: 'research_scholar' },
    { label: 'Education Institution', value: 'education_institution' },
    // Ecosystem Enablers options
    { label: 'Educational Institutions', value: 'educational_institutions' },
    { label: 'Corporates', value: 'corporates' },
    { label: 'Business & Social Forums', value: 'business_social_forums' },
    { label: 'Startup Communities', value: 'startup_communities' },
    { label: 'NGOs', value: 'ngos' },
    { label: 'Banks', value: 'banks' },
    { label: 'Media Agencies', value: 'media_agencies' },
    { label: 'R&D Agencies', value: 'rd_agencies' },
    // Incubation & Acceleration options
    { label: 'Incubators', value: 'incubators' },
    { label: 'Accelerators', value: 'accelerators' },
    // Investors options
    { label: 'Angel Investors', value: 'angel_investors' },
    { label: 'Venture Capitalists (VCs)', value: 'venture_capitalists' },
    { label: 'Private Equity (PE) Firms', value: 'private_equity_firms' },
    { label: 'Corporate Investors', value: 'corporate_investors' },
    { label: 'Family Offices', value: 'family_offices' },
    { label: 'Revenue Based Financing/Venture Debt', value: 'revenue_based_financing' },
    // Mentor/SME options
    { label: 'Mentor', value: 'mentor' },
    { label: 'Subject Matter Expert', value: 'subject_matter_expert' },
    // Service Provider options
    { label: 'Legal & Compliance Services', value: 'legal_compliance_services' },
    { label: 'Coworking Space', value: 'coworking_space' },
    { label: 'Consulting and Advisory Services', value: 'consulting_advisory_services' },
    { label: 'Makerspace', value: 'makerspace' },
    { label: 'Financial Services', value: 'financial_services' },
    { label: 'Technology Services', value: 'technology_services' },
    { label: 'Marketing and Branding Services', value: 'marketing_branding_services' },
  ],
  index: true,
  admin: {
    description: 'From visitor_data.profileType - detailed user categorization',
    readOnly: true,
  },
}
