import React from 'react'
import { WrapperProps } from '@/types/common'

const StatsWrapper: React.FC<WrapperProps> = ({ className, children }) => {
  return <div className={`flex flex-col gap-4 ${className}`}>{children}</div>
}

const StatsHeader: React.FC<WrapperProps> = ({ className, children }) => {
  return (
    <h5
      className={`font-medium text-sm text-gray-600 dark:text-gray-300 uppercase tracking-wide ${className}`}
    >
      {children}
    </h5>
  )
}

const StatsGrid: React.FC<WrapperProps> = ({ className, children }) => {
  return <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>{children}</div>
}

export { StatsWrapper, StatsHeader, StatsGrid }
