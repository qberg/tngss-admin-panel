'use client'
import Link from 'next/link'
import CollectionCard from './CollectionCard'
import QuickActionButton from './QuickAction'
import { CollectionStats } from './types'
import { useCallback, useState } from 'react'
import { useAuth } from '@payloadcms/ui'
import { CORE_COLLECTIONS, QUICK_ACTIONS } from './config'
import { fetchStatsWithRestAPI } from './utils'

interface DashboardClientProps {
  initialStats: CollectionStats | null
  initialError?: string | null
  adminRoute: string
}

const DashboardClient: React.FC<DashboardClientProps> = ({ initialStats, adminRoute }) => {
  const [stats, setStats] = useState<CollectionStats | null>(initialStats)
  const [loading, setLoading] = useState(!initialStats)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const { user } = useAuth()

  const coreCollections = CORE_COLLECTIONS(adminRoute)
  const quickActions = QUICK_ACTIONS(adminRoute)

  // Refresh function for manual updates
  const handleRefresh = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const statsData = await fetchStatsWithRestAPI()
      setStats(statsData)
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Error refreshing stats:', err)
      setError('Failed to refresh statistics. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-black dark:via-gray-900 dark:to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-xl">
                <span className="text-white text-2xl font-bold">📊</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">
                  Dashboard
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Welcome back, {user?.name || user?.email?.split('@')[0]}
                </p>
              </div>
            </div>

            {/* iOS-style Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="w-11 h-11 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed group"
              title={loading ? 'Refreshing...' : 'Refresh data'}
            >
              <svg
                className={`w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform duration-500 ${
                  loading ? 'animate-spin' : 'group-hover:rotate-180'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>

          {/* Data source and timestamp */}
          {lastUpdated && (
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>
                Data source: {initialStats ? 'Local API (Server)' : 'REST API (Fallback)'} • Last
                updated: {lastUpdated.toLocaleTimeString()}
              </span>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-red-500 text-xl mr-3">⚠️</span>
                <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
              </div>
              <button
                onClick={handleRefresh}
                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 font-medium text-sm underline"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Collections Grid */}
        <div className="mb-8">
          {/*
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
            Collections
          </h2>
          */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreCollections.map((collection) => (
              <CollectionCard
                key={collection.key}
                title={collection.title}
                count={stats?.[collection.key] ?? null}
                href={collection.href}
                icon={collection.icon}
                iconBg={collection.iconBg}
                description={collection.description}
                loading={loading}
              />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <QuickActionButton
                key={index}
                href={action.href}
                icon={action.icon}
                title={action.title}
                iconBg={action.iconBg}
              />
            ))}
          </div>
        </div>

        {/* Additional Collections - Quick Access */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
            File Management
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href={`${adminRoute}/collections/media`}
              className="group relative overflow-hidden rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300/70 dark:hover:border-gray-600/70 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
            >
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center shadow-sm">
                      <span className="text-lg">🖼️</span>
                    </div>
                    <div>
                      <div className="font-semibold text-sm tracking-tight text-gray-900 dark:text-white">
                        Media Files
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {loading ? '...' : `${stats?.media || 0} files`}
                      </div>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>

            <Link
              href={`${adminRoute}/collections/documents`}
              className="group relative overflow-hidden rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300/70 dark:hover:border-gray-600/70 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
            >
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shadow-sm">
                      <span className="text-lg">📄</span>
                    </div>
                    <div>
                      <div className="font-semibold text-sm tracking-tight text-gray-900 dark:text-white">
                        Documents
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {loading ? '...' : `${stats?.documents || 0} files`}
                      </div>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Bottom Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 tracking-tight text-gray-900 dark:text-white flex items-center">
                <span className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mr-3">
                  ℹ️
                </span>
                System Information
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Current User</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{user?.email}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Role</span>
                  <span className="font-semibold text-gray-900 dark:text-white capitalize">
                    {user?.roles?.join(', ') || 'User'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Data Source</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {initialStats ? 'Local API' : 'REST API'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Last Login</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 tracking-tight text-gray-900 dark:text-white flex items-center">
                <span className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mr-3">
                  💡
                </span>
                Quick Tips
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                  <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
                  <span className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Use search to quickly find specific speakers or documents
                  </span>
                </div>
                <div className="flex items-start space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                  <span className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></span>
                  <span className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Bulk operations are available for managing multiple items
                  </span>
                </div>
                <div className="flex items-start space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                  <span className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></span>
                  <span className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Organize events effectively using speaker types
                  </span>
                </div>
                <div className="flex items-start space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                  <span className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></span>
                  <span className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Click refresh to update collection counts in real-time
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardClient
