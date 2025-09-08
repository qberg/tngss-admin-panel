'use client'
import React, { useState } from 'react'
import { useFormsData } from './hooks/useFormsData'
import { FormSelector } from './FormSelector'
import { SelectedFormInfo } from './SelectedFormInfo'
import CSVDownloadButton from './CSVDownloadButton'

export const FormCSVExport: React.FC = () => {
  const [selectedFormId, setSelectedFormId] = useState<string>('')

  const { forms, loading, error, refetch } = useFormsData()

  const selectedForm = forms.find((form) => form.id === selectedFormId) || null

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300/70 dark:hover:border-gray-600/70 hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-300 shadow-lg hover:shadow-xl">
      <div className="p-6">
        {/* Header with Icon */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm">
              <span className="text-xl">📄</span>
            </div>
            <div>
              <h3 className="font-semibold text-lg tracking-tight text-gray-900 dark:text-white">
                Export Form Data
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Download submissions as CSV
              </p>
            </div>
          </div>

          {/* Refresh Button */}
          <button
            onClick={refetch}
            disabled={loading}
            className="inline-flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            <span className="mr-2">🔄</span>
            Refresh
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50/80 dark:bg-red-900/20 border border-red-200/50 dark:border-red-800/50 backdrop-blur-sm">
            <div className="flex items-center">
              <span className="text-red-500 text-xl mr-3">⚠️</span>
              <div className="flex-1">
                <p className="text-red-700 dark:text-red-300 font-medium text-sm">
                  Error loading forms
                </p>
                <p className="text-red-600 dark:text-red-400 text-xs mt-1">{error}</p>
              </div>
              <button
                onClick={refetch}
                className="ml-4 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 font-medium text-xs underline"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        {!error && (
          <div className="space-y-4">
            {/* Form Selection */}
            <FormSelector
              forms={forms}
              selectedFormId={selectedFormId}
              onSelectionChange={setSelectedFormId}
              loading={loading}
            />

            {/* Selected Form Info */}
            {selectedForm && <SelectedFormInfo selectedForm={selectedForm} />}

            {/* Download Button */}
            <CSVDownloadButton
              formId={selectedFormId}
              formTitle={selectedForm?.title || 'form'}
              submissionCount={selectedForm?.submissionCount}
              disabled={!selectedFormId}
            />
          </div>
        )}

        {/* Quick Stats */}
        {forms.length > 0 && !loading && !error && (
          <div className="mt-6 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-xl bg-gray-50/80 dark:bg-gray-700/50 backdrop-blur-sm">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{forms.length}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Total Forms</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-gray-50/80 dark:bg-gray-700/50 backdrop-blur-sm">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {forms.reduce((sum, form) => sum + form.submissionCount, 0)}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  Total Submissions
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {forms.length === 0 && !loading && !error && (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">📋</div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              No forms found
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Create some forms to see them here.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
