'use client'
import React, { useState } from 'react'
import type { UIFieldClientComponent } from 'payload'
import { useDocumentInfo } from '@payloadcms/ui'

interface RegistrationData {
  _id: string
  Name: string
  email_id: string
  phone_number: string
  gender: string
  designation: string
  organization_name: string
  ticket: string
}

const EventRegistrations: UIFieldClientComponent = () => {
  const [registrations, setRegistrations] = useState<RegistrationData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showRegistrations, setShowRegistrations] = useState(false)

  const { id: eventId } = useDocumentInfo()

  const fetchRegistrations = async () => {
    if (!eventId) {
      setError('No event ID available')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/events/${eventId}/registrations`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      setRegistrations(result.data || [])
      setShowRegistrations(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch registrations')
      console.error('Error fetching registrations:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300/70 dark:hover:border-gray-600/70 hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-300 shadow-lg hover:shadow-xl">
      <div className="p-6">
        <div className="flex items-start space-x-4 mb-4">
          <div className="flex-1">
            <h4 className="font-semibold text-base tracking-tight text-gray-900 dark:text-white mb-1">
              Event Registrations
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              View and manage registrations for this event
            </p>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap mb-4">
          <button
            onClick={fetchRegistrations}
            disabled={loading || !eventId}
            className="group relative overflow-hidden rounded-xl px-4 py-2 font-medium text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md bg-[#18bfdb]/80 hover:bg-[#18bfdb] text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center space-x-2">
              <span className="text-sm group-hover:scale-110 transition-transform duration-300">
                {loading ? '⏳' : '👥'}
              </span>
              <span className="tracking-tight">
                {loading ? 'Loading...' : 'Load Registrations'}
              </span>
            </div>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl">
            <p className="text-red-700 dark:text-red-300 text-sm">Error: {error}</p>
          </div>
        )}

        {showRegistrations && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-semibold text-sm text-gray-900 dark:text-white">
                Registrations ({registrations.length})
              </h5>
              <button
                onClick={() => setShowRegistrations(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            {registrations.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No registrations found for this event.
              </p>
            ) : (
              <div className="max-h-64 overflow-y-auto space-y-2">
                {registrations.map((registration) => (
                  <div
                    key={registration._id}
                    className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm"
                  >
                    <div className="font-medium text-gray-900 dark:text-white">
                      {registration.Name || 'No Name'}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      {registration.email_id !== 'NA' && <div>📧 {registration.email_id}</div>}
                      {registration.phone_number !== 'NA' && (
                        <div>📱 {registration.phone_number}</div>
                      )}
                      {registration.organization_name !== 'NA' && (
                        <div>🏢 {registration.organization_name}</div>
                      )}
                      {registration.ticket !== 'NA' && <div>🎫 {registration.ticket}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default EventRegistrations
