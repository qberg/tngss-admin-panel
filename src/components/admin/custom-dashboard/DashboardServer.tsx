import React from 'react'
import type { AdminViewServerProps } from 'payload'
import { CollectionStats } from './types'
import { fetchStatsWithLocalAPI } from './utils'
import DashboardClient from './DashboardClient'

const DashboardServer: React.FC<AdminViewServerProps> = async ({ payload }) => {
  let stats: CollectionStats | null = null
  let error: string | null = null

  try {
    if (!payload) {
      throw new Error('Payload instance not available')
    }

    stats = await fetchStatsWithLocalAPI(payload)
  } catch (err) {
    console.error('Server-side error fetching stats:', err)
    error = 'Failed to load collection statistics'
  }

  const adminRoute = '/admin'

  return <DashboardClient initialStats={stats} initialError={error} adminRoute={adminRoute} />
}

export default DashboardServer
