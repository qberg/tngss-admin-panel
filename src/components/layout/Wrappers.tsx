import { WrapperProps } from '@/types/common'
import React from 'react'

const FullWidthCardWrapper: React.FC<WrapperProps> = ({ children, className }) => {
  return (
    <div
      className={`${className}  bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 shadow-lg overflow-hidden p-6 flex flex-col gap-4 md:gap-8`}
    >
      {children}
    </div>
  )
}

const CardTitle: React.FC<WrapperProps> = ({ children, className }) => {
  return (
    <h4
      className={`font-semibold text-lg tracking-tight text-gray-900 dark:text-white ${className}`}
    >
      {children}
    </h4>
  )
}

const CardRow: React.FC<WrapperProps> =({children, className}) => {
  return (
  <div className={`${className} flex justify-between`}>
      {children}
  </div>
  )
}

export { FullWidthCardWrapper, CardTitle, CardRow }
