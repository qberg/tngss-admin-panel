'use client'
import React, { useState } from 'react'
import type { UIFieldClientComponent } from 'payload'
import { useDocumentInfo } from '@payloadcms/ui'
import { ExternalAPIResponse, ExternalRegistrationData } from '@/types/events'

const downloadCSV = (
  data: ExternalRegistrationData[],
  filename: string = 'event-registrations',
) => {
  // Define CSV headers
  const headers = [
    'Name',
    'Email',
    'Phone',
    'Organization',
    'Designation',
    'Ticket Type',
    'Gender',
    'Registration Date',
  ]

  // Convert data to CSV rows
  const csvRows = data.map((registration) => [
    registration.name || '',
    registration.email_id || '',
    registration.phone_number || '',
    registration.organization_name || '',
    registration.designation || '',
    registration.ticket || '',
    registration.gender || '',
    new Date().toLocaleDateString(),
  ])

  const csvContent = [headers, ...csvRows]
    .map((row) =>
      row
        .map((field) => {
          const stringField = String(field)
          if (
            stringField.includes(',') ||
            stringField.includes('"') ||
            stringField.includes('\n')
          ) {
            return `"${stringField.replace(/"/g, '""')}"`
          }
          return stringField
        })
        .join(','),
    )
    .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}

const DownloadCSVButton: React.FC<{
  onClick: () => void
  disabled?: boolean
  count: number
}> = ({ onClick, disabled = false, count }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-[#007fcf] to-[#f56b0d]  disabled:from-gray-400 disabled:to-gray-500 text-white text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95 focus:outline-none"
  >
    <span className="mr-2">💾</span>
    Export CSV
    {count > 0 && (
      <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs font-semibold">
        {count}
      </span>
    )}
  </button>
)

const CompactRegistrationCard: React.FC<{ registration: ExternalRegistrationData }> = ({
  registration,
}) => {
  const hasData = (value: string) => value && value.trim() !== '' && value !== 'NA'

  const getInitials = (name: string) => {
    if (!hasData(name)) return '?'
    return name
      .split(' ')
      .filter((n) => n.length > 0)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
        {getInitials(registration.name)}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {hasData(registration.name) ? registration.name : 'No Name Provided'}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {hasData(registration.email_id) ? registration.email_id : 'No email'}
        </p>
      </div>

      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
        ✅
      </span>
    </div>
  )
}

// iOS-style Toggle Switch Component
const IOSToggle: React.FC<{
  enabled: boolean
  onChange: (enabled: boolean) => void
  label?: string
}> = ({ enabled, onChange, label }) => (
  <div className="flex items-center space-x-3">
    {label && <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>}
    <button
      type="button"
      className={`${
        enabled ? 'bg-[#18BFDB]' : 'bg-gray-200 dark:bg-gray-600'
      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
      onClick={() => onChange(!enabled)}
    >
      <span className="sr-only">Toggle table view</span>
      <span
        className={`${
          enabled ? 'translate-x-5' : 'translate-x-0'
        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
      />
    </button>
  </div>
)

// iOS-style Table Header Component
const IOSTableHeader: React.FC = () => (
  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-t-2xl border-t border-l border-r border-gray-200 dark:border-gray-700 px-4 py-3">
    <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
      <div className="col-span-4">Contact</div>
      <div className="col-span-3">Organization</div>
      <div className="col-span-2">Ticket</div>
      <div className="col-span-2">Phone</div>
      <div className="col-span-1 text-right">Actions</div>
    </div>
  </div>
)

// iOS-style Table Row Component
const IOSTableRow: React.FC<{
  registration: ExternalRegistrationData
  isLast: boolean
}> = ({ registration, isLast }) => {
  const hasData = (value: string) => value && value.trim() !== '' && value !== 'NA'

  const getInitials = (name: string) => {
    if (!hasData(name)) return '?'
    return name
      .split(' ')
      .filter((n) => n.length > 0)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleEmailClick = () => {
    if (hasData(registration.email_id)) {
      window.location.href = `mailto:${registration.email_id}`
    }
  }

  const handleCallClick = () => {
    if (hasData(registration.phone_number)) {
      window.location.href = `tel:${registration.phone_number}`
    }
  }

  return (
    <div
      className={`
      bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 
      ${isLast ? 'rounded-b-2xl border-b border-l border-r' : 'border-l border-r border-b border-gray-200/50 dark:border-gray-700/50'}
      hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all duration-200
    `}
    >
      <div className="px-4 py-4">
        <div className="grid grid-cols-12 gap-4 items-center">
          {/* Contact Info - Column 1 (4 cols) */}
          <div className="col-span-4 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#007fcf] to-[#f56b0d]  flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              {getInitials(registration.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {hasData(registration.name) ? registration.name : 'No Name Provided'}
              </p>
              {hasData(registration.email_id) && (
                <p className="text-xs text-blue-600 dark:text-blue-400 truncate">
                  {registration.email_id}
                </p>
              )}
            </div>
          </div>

          {/* Organization - Column 2 (3 cols) */}
          <div className="col-span-3">
            {hasData(registration.organization_name) ? (
              <div>
                <p className="text-sm text-gray-900 dark:text-white truncate">
                  {registration.organization_name}
                </p>
                {hasData(registration.designation) && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {registration.designation}
                  </p>
                )}
              </div>
            ) : hasData(registration.designation) ? (
              <p className="text-sm text-gray-900 dark:text-white truncate">
                {registration.designation}
              </p>
            ) : (
              <span className="text-sm text-gray-400 dark:text-gray-500">-</span>
            )}
          </div>

          {/* Ticket - Column 3 (2 cols) */}
          <div className="col-span-2">
            {hasData(registration.ticket) ? (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                🎫 {registration.ticket}
              </span>
            ) : (
              <span className="text-sm text-gray-400 dark:text-gray-500">-</span>
            )}
          </div>

          {/* Phone - Column 4 (2 cols) */}
          <div className="col-span-2">
            {hasData(registration.phone_number) ? (
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {registration.phone_number}
              </p>
            ) : (
              <span className="text-sm text-gray-400 dark:text-gray-500">-</span>
            )}
          </div>

          {/* Actions - Column 5 (1 col) */}
          <div className="col-span-1 flex items-center justify-end space-x-1">
            {hasData(registration.email_id) && (
              <button
                onClick={handleEmailClick}
                className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-200"
                title="Send Email"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </button>
            )}

            {hasData(registration.phone_number) && (
              <button
                onClick={handleCallClick}
                className="p-1.5 rounded-md bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors duration-200"
                title="Make Call"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </button>
            )}

            <div className="w-2 h-2 rounded-full bg-green-500 ml-2" title="Registered"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Full Registration Card Component (for card view)
const FullRegistrationCard: React.FC<{ registration: ExternalRegistrationData }> = ({
  registration,
}) => {
  const hasData = (value: string) => value && value.trim() !== '' && value !== 'NA'

  const getInitials = (name: string) => {
    if (!hasData(name)) return '?'
    return name
      .split(' ')
      .filter((n) => n.length > 0)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleEmailClick = () => {
    if (hasData(registration.email_id)) {
      window.location.href = `mailto:${registration.email_id}`
    }
  }

  const handleCallClick = () => {
    if (hasData(registration.phone_number)) {
      window.location.href = `tel:${registration.phone_number}`
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="p-6">
        {/* Header with Avatar and Main Info */}
        <div className="flex items-start space-x-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#007fcf] to-[#f56b0d] flex items-center justify-center text-white font-semibold shadow-sm">
            {getInitials(registration.name)}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {hasData(registration.name) ? registration.name : 'No Name Provided'}
            </h3>

            {hasData(registration.designation) && hasData(registration.organization_name) ? (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {registration.designation} at {registration.organization_name}
              </p>
            ) : hasData(registration.designation) ? (
              <p className="text-sm text-gray-600 dark:text-gray-400">{registration.designation}</p>
            ) : hasData(registration.organization_name) ? (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {registration.organization_name}
              </p>
            ) : null}

            {hasData(registration.ticket) && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 mt-2">
                🎫 {registration.ticket}
              </span>
            )}
          </div>

          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
            ✅ Registered
          </span>
        </div>

        {/* Contact Information */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <span className="mr-2">📧</span>
            <span className="flex-1 truncate">
              {hasData(registration.email_id) ? registration.email_id : 'No email provided'}
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <span className="mr-2">📱</span>
            <span className="flex-1">
              {hasData(registration.phone_number) ? registration.phone_number : 'No phone provided'}
            </span>
          </div>

          {hasData(registration.gender) && registration.gender !== 'NA' && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <span className="mr-2">👤</span>
              <span className="capitalize">{registration.gender}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={handleEmailClick}
            disabled={!hasData(registration.email_id)}
            className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
          >
            <span className="mr-2">📧</span>
            Email
          </button>

          <button
            onClick={handleCallClick}
            disabled={!hasData(registration.phone_number)}
            className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
          >
            <span className="mr-2">📱</span>
            Call
          </button>
        </div>
      </div>

      <div className="h-1 bg-gradient-to-r from-[#0055FF] to-[#07BCCE] opacity-20"></div>
    </div>
  )
}

// Metrics Card Component
const MetricCard: React.FC<{
  label: string
  value: number
  icon: string
  color: string
}> = ({ label, value, icon, color }) => (
  <div className={`${color} rounded-xl p-4 border border-gray-200 dark:border-gray-700`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
      <span className="text-2xl">{icon}</span>
    </div>
  </div>
)

// Loading skeletons
const CompactSkeleton: React.FC = () => (
  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl animate-pulse">
    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-24"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-32"></div>
    </div>
    <div className="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
  </div>
)

const FullSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
    <div className="flex items-start space-x-4 mb-4">
      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      <div className="flex-1 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
        </div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-36"></div>
      </div>
    </div>
    <div className="space-y-2 mb-4">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
    </div>
    <div className="flex space-x-2">
      <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
      <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
    </div>
  </div>
)

const IOSTableSkeleton: React.FC = () => (
  <div className="space-y-0">
    {/* Header skeleton */}
    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-t-2xl border-t border-l border-r border-gray-200 dark:border-gray-700 px-4 py-3 animate-pulse">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4 h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
        <div className="col-span-3 h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
        <div className="col-span-2 h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
        <div className="col-span-2 h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
        <div className="col-span-1 h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
      </div>
    </div>

    {/* Row skeletons */}
    {Array.from({ length: 5 }).map((_, i) => (
      <div
        key={i}
        className={`
          bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 animate-pulse
          ${i === 4 ? 'rounded-b-2xl border-b border-l border-r' : 'border-l border-r border-b border-gray-200/50 dark:border-gray-700/50'}
        `}
      >
        <div className="px-4 py-4">
          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-4 flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
              </div>
            </div>
            <div className="col-span-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 mt-1"></div>
            </div>
            <div className="col-span-2">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md w-16"></div>
            </div>
            <div className="col-span-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            </div>
            <div className="col-span-1 flex justify-end space-x-1">
              <div className="w-7 h-7 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
              <div className="w-7 h-7 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
              <div className="w-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full ml-2"></div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
)

const EventRegistrations: UIFieldClientComponent = () => {
  const [registrations, setRegistrations] = useState<ExternalRegistrationData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isTableView, setIsTableView] = useState(false)

  const { id: eventId } = useDocumentInfo()

  const fetchRegistrations = async () => {
    if (!eventId) {
      setError('No event ID available')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/events/${eventId}/registrations`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ExternalAPIResponse = await response.json()

      if (result.statusCode === 200) {
        setRegistrations(result.data || [])
      } else {
        throw new Error(result.message || 'Failed to fetch registrations')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch registrations')
      console.error('Error fetching registrations:', err)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    if (eventId) {
      fetchRegistrations()
    }
  }, [eventId])

  // Calculate metrics
  const metrics = React.useMemo(() => {
    const total = registrations.length
    const withEmail = registrations.filter(
      (r) => r.email_id && r.email_id.trim() !== '' && r.email_id !== 'NA',
    ).length
    const withPhone = registrations.filter(
      (r) => r.phone_number && r.phone_number.trim() !== '' && r.phone_number !== 'NA',
    ).length
    const organizations = new Set(
      registrations
        .filter((r) => r.organization_name && r.organization_name !== 'NA')
        .map((r) => r.organization_name),
    ).size

    const withVisitorPass = registrations.filter(
      (r) =>
        r.ticket && r.ticket.trim() !== '' && r.ticket !== 'NA' && r.ticket === 'TNGSS Visitor',
    ).length

    const withDelegatePass = registrations.filter(
      (r) =>
        r.ticket && r.ticket.trim() !== '' && r.ticket !== 'NA' && r.ticket === 'TNGSS Conference',
    ).length

    const onWaitlist = registrations.filter((r) => r.waitlist && r.waitlist === true).length

    return {
      total,
      withEmail,
      withPhone,
      withVisitorPass,
      withDelegatePass,
      onWaitlist,
      organizations,
    }
  }, [registrations])

  const toggleExpanded = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsExpanded(!isExpanded)
  }

  const handleRefresh = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    fetchRegistrations()
  }

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 shadow-lg overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="font-semibold text-lg tracking-tight text-gray-900 dark:text-white">
              Event Registrations
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isExpanded ? 'All event registrations' : 'Overview of event registrations'}
            </p>
          </div>

          {!loading && !error && registrations.length > 0 && (
            <div className="flex items-center space-x-3">
              <DownloadCSVButton
                onClick={() => {
                  try {
                    downloadCSV(registrations, `event-${eventId}-registrations`)
                    // we can add a toast notification here down the line
                  } catch (error) {
                    console.error('Error downloading CSV:', error)
                  }
                }}
                disabled={loading || registrations.length === 0}
                count={registrations.length}
              />
              {/* iOS Toggle for Table View */}
              {isExpanded && (
                <IOSToggle enabled={isTableView} onChange={setIsTableView} label="Table" />
              )}

              <button
                onClick={handleRefresh}
                disabled={loading}
                className="inline-flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                <span className="mr-2">🔄</span>
                Refresh
              </button>

              <button
                onClick={toggleExpanded}
                className="inline-flex items-center px-3 py-2 button-bg bg-[#18BFDB] text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none"
              >
                <span className="mr-2">{isExpanded ? '📊' : '👀'}</span>
                {isExpanded ? 'Show Overview' : 'View All'}
              </button>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl p-4 mb-4">
            <div className="flex items-center">
              <span className="text-red-500 text-xl mr-3">⚠️</span>
              <div className="flex-1">
                <p className="text-red-700 dark:text-red-300 font-medium text-sm">
                  Error loading registrations
                </p>
                <p className="text-red-600 dark:text-red-400 text-xs mt-1">{error}</p>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  fetchRegistrations()
                }}
                className="ml-4 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 font-medium text-xs underline"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            {/* Metrics loading */}
            <div className={`grid ${isExpanded ? 'grid-cols-4' : 'grid-cols-2'} gap-3`}>
              {Array.from({ length: isExpanded ? 4 : 4 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 animate-pulse"
                >
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-8"></div>
                </div>
              ))}
            </div>

            {/* Cards loading */}
            {isExpanded && isTableView ? (
              <IOSTableSkeleton />
            ) : (
              <div
                className={`${isExpanded ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-2'}`}
              >
                {Array.from({ length: isExpanded ? 6 : 3 }).map((_, i) =>
                  isExpanded ? <FullSkeleton key={i} /> : <CompactSkeleton key={i} />,
                )}
              </div>
            )}
          </div>
        )}

        {/* Success State */}
        {!loading && !error && (
          <>
            {registrations.length === 0 ? (
              /* Empty State */
              <div className="text-center py-8">
                <div className="text-4xl mb-3">📋</div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  No registrations yet
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Registrations will appear here once people sign up.
                </p>
              </div>
            ) : (
              <>
                {/* Metrics */}
                <div className={`grid ${isExpanded ? 'grid-cols-4' : 'grid-cols-2'} gap-3 mb-6`}>
                  <MetricCard
                    label="Total"
                    value={metrics.total}
                    icon="👥"
                    color="bg-blue-50 dark:bg-blue-900/20"
                  />
                  <MetricCard
                    label="With Visitor Pass"
                    value={metrics.withVisitorPass}
                    icon="🎫"
                    color="bg-green-50 dark:bg-green-900/20"
                  />
                  <MetricCard
                    label="With Delegate Pass"
                    value={metrics.withDelegatePass}
                    icon="🎟️"
                    color="bg-purple-50 dark:bg-purple-900/20"
                  />
                  <MetricCard
                    label="Waitlist"
                    value={metrics.onWaitlist}
                    icon="⏳"
                    color="bg-orange-50 dark:bg-orange-900/20"
                  />
                </div>

                {/* Registrations */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                      {isExpanded ? 'All Registrations' : 'Recent Registrations'}
                    </h5>
                    {!isExpanded && registrations.length > 5 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Showing 5 of {registrations.length}
                      </span>
                    )}
                  </div>

                  {isExpanded ? (
                    /* Full View - Toggle between iOS Table and Card Grid */
                    isTableView ? (
                      /* iOS-style Table View with Header */
                      <div className="space-y-0">
                        <IOSTableHeader />
                        {registrations.map((registration, index) => (
                          <IOSTableRow
                            key={registration._id}
                            registration={registration}
                            isLast={index === registrations.length - 1}
                          />
                        ))}
                      </div>
                    ) : (
                      /* Card Grid View */
                      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {registrations.map((registration) => (
                          <FullRegistrationCard
                            key={registration._id}
                            registration={registration}
                          />
                        ))}
                      </div>
                    )
                  ) : (
                    /* Compact List View */
                    <>
                      <div className="space-y-2">
                        {registrations.slice(0, 5).map((registration) => (
                          <CompactRegistrationCard
                            key={registration._id}
                            registration={registration}
                          />
                        ))}
                      </div>

                      {registrations.length > 5 && (
                        <div className="mt-4 text-center">
                          <button
                            onClick={toggleExpanded}
                            className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors duration-200"
                          >
                            <span className="mr-2">👀</span>
                            View All {registrations.length} Registrations
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default EventRegistrations
