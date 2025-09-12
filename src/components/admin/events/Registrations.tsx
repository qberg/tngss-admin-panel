'use client'
import { useEffect, useState } from 'react'
import { CardTitle, FullWidthCardWrapper } from '@/components/layout/Wrappers'
import { useDocumentInfo } from '@payloadcms/ui'
import { ExternalAPIResponseWithMeta, ExternalRegistrationData } from '@/types/events'
import { StatCard } from '@/components/ui/StatCard'
import { StatsGrid, StatsHeader, StatsWrapper } from '@/components/layout/Stats'
import SimpleRegistrationTable from './components/SimpleRegistrationTable'

const Registrations = () => {
  const [registrations, setRegistrations] = useState<ExternalRegistrationData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  console.log(error, loading)

  const { id: eventId } = useDocumentInfo()

  const fetchRegistrations = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/events/${eventId}/registrations`)

      if (!response.ok) {
        throw new Error(`Failed to fetch: ' ${response.status}`)
      }

      const data: ExternalAPIResponseWithMeta = await response.json()
      setRegistrations(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load registrations')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRegistrations()
  }, [eventId])

  const updateStatus = async (registrationId: string, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch(`/api/events/registrations/${registrationId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      await fetchRegistrations()
    } catch (err) {
      console.error('Error updating status:', err)
    }
  }

  if (registrations.length === 0) {
    return (
      <FullWidthCardWrapper>
        <div className="text-gray-500 dark:text-gray-400">
          <h3 className="text-lg font-medium mb-2">No Registrations Found</h3>
          <p className="text-sm">There are no registrations for this event yet.</p>
        </div>
      </FullWidthCardWrapper>
    )
  }

  const totalCount = registrations.length
  const pendingCount = registrations.filter(
    (r) => r.registration_status === 'waiting_for_approval',
  ).length
  const approvedCount = registrations.filter((r) => r.registration_status === 'approved').length
  const rejectedCount = registrations.filter((r) => r.registration_status === 'rejected').length

  return (
    <div className="flex flex-col gap-2">
      {/*header card*/}
      <FullWidthCardWrapper>
        <CardTitle>Event Approvals</CardTitle>

        <StatsWrapper>
          <StatsHeader>Registration Overview</StatsHeader>
          <StatsGrid>
            <StatCard count={totalCount} label="Total" variant="neutral" />
            <StatCard count={pendingCount} label="Pending" variant="warning" />
            <StatCard count={approvedCount} label="Approved" variant="success" />
            <StatCard count={rejectedCount} label="Rejected" variant="destructive" />
          </StatsGrid>
        </StatsWrapper>
      </FullWidthCardWrapper>

      {/*table*/}
      <FullWidthCardWrapper>
        <SimpleRegistrationTable registrations={registrations} onStatusUpdate={updateStatus} />
      </FullWidthCardWrapper>
    </div>
  )
}

export default Registrations
