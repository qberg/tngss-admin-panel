'use client'
import React from 'react'

interface FormOption {
  id: string
  title: string
  submissionCount: number
}

interface FormSelectorProps {
  forms: FormOption[]
  selectedFormId: string
  onSelectionChange: (formId: string) => void
  loading?: boolean
  disabled?: boolean
}

export const FormSelector: React.FC<FormSelectorProps> = ({
  forms,
  selectedFormId,
  onSelectionChange,
  loading = false,
  disabled = false,
}) => {
  if (loading) {
    return (
      <div className="animate-pulse">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Form
        </label>
        <div className="h-12 bg-gray-200/80 dark:bg-gray-700/80 rounded-xl backdrop-blur-sm"></div>
      </div>
    )
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Select Form
      </label>
      <div className="relative">
        <select
          value={selectedFormId}
          onChange={(e) => onSelectionChange(e.target.value)}
          disabled={disabled}
          className="w-full px-4 py-3 border border-gray-200/50 dark:border-gray-600/50 rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">Choose a form...</option>
          {forms.map((form) => (
            <option key={form.id} value={form.id}>
              {form.title} ({form.submissionCount} submissions)
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  )
}
