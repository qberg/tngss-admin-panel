'use client'
import React from 'react'
import type { UIFieldClientComponent } from 'payload'

const ActionButton: React.FC<{
  onClick: () => void
  icon: string
  title: string
  variant: 'primary' | 'secondary'
}> = ({ onClick, icon, title, variant }) => {
  const baseClasses =
    'group relative overflow-hidden rounded-xl px-4 py-2 font-medium text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md'
  const variantClasses =
    variant === 'primary'
      ? 'bg-[#18bfdb]/80 hover:bg-[#18bfdb] text-white'
      : 'bg-gray-500 hover:bg-gray-600 text-white'

  return (
    <button onClick={onClick} className={`${baseClasses} ${variantClasses}`}>
      <div className="flex items-center space-x-2">
        <span className="text-sm group-hover:scale-110 transition-transform duration-300">
          {icon}
        </span>
        <span className="tracking-tight">{title}</span>
      </div>
    </button>
  )
}

const QuickActionItem: React.FC<{
  text: string
}> = ({ text }) => (
  <li className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
    <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
    <span>{text}</span>
  </li>
)

const TicketManagementButton: UIFieldClientComponent = () => {
  const handleRedirect = () => {
    window.location.href = '/admin/collections/tickets'
  }

  const handleRedirectNewTab = () => {
    window.open('/admin/collections/tickets', '_blank')
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300/70 dark:hover:border-gray-600/70 hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-300 shadow-lg hover:shadow-xl">
      <div className="p-6">
        <div className="flex items-start space-x-4 mb-4">
          <div className="flex-1">
            <h4 className="font-semibold text-base tracking-tight text-gray-900 dark:text-white mb-1">
              Tickets Collection Management
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage all ticket types including exhibitor packages, pricing, and features
            </p>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap mb-4">
          <ActionButton
            onClick={handleRedirect}
            icon="📋"
            title="Manage Tickets"
            variant="primary"
          />
          <ActionButton
            onClick={handleRedirectNewTab}
            icon="🔗"
            title="Open in New Tab"
            variant="secondary"
          />
        </div>

        <div className="relative overflow-hidden rounded-xl bg-blue-50/80 dark:bg-blue-900/20 backdrop-blur-sm border border-blue-200/30 dark:border-blue-800/30 p-4">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-200/30 to-transparent rounded-full -mr-10 -mt-10"></div>
          <p className="font-semibold text-xs tracking-wide text-blue-900 dark:text-blue-100 mb-3 uppercase">
            Quick Actions Available
          </p>
          <ul className="space-y-2">
            <QuickActionItem text="Add new ticket types" />
            <QuickActionItem text="Update pricing and currency settings" />
            <QuickActionItem text="Configure exhibitor package features" />
            <QuickActionItem text="Manage tax and discount options" />
          </ul>
        </div>
      </div>
    </div>
  )
}

export default TicketManagementButton
