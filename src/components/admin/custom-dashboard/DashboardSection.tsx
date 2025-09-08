import React, { ReactNode } from 'react'

interface DashboardSectionProps {
  title: string
  children?: ReactNode
  className?: string
}

const DashboardSection: React.FC<DashboardSectionProps> = ({ title, children, className }) => {
  return (
    <div className={`mb-8 ${className}`}>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
        {title}
      </h2>
      {children}
    </div>
  )
}

export default DashboardSection
