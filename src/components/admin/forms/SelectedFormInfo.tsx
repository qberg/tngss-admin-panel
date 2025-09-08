'use client'
import React from 'react'

interface FormOption {
  id: string
  title: string
  submissionCount: number
}

interface SelectedFormInfoProps {
  selectedForm: FormOption | null
}

export const SelectedFormInfo: React.FC<SelectedFormInfoProps> = ({ selectedForm }) => {
  if (!selectedForm) {
    return null
  }

  return (
    <div className="p-4 rounded-xl bg-blue-50/80 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
          <span className="text-sm">📋</span>
        </div>
        <div>
          <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
            {selectedForm.title}
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400">
            {selectedForm.submissionCount} submissions ready to export
          </p>
        </div>
      </div>
    </div>
  )
}
