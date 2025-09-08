'use client'
import React from 'react'
import { useCSVDownload } from './hooks/useCSVDownload'

interface CSVDownloadButtonProps {
  formId: string
  formTitle: string
  disabled?: boolean
  submissionCount?: number
}

const CSVDownloadButton: React.FC<CSVDownloadButtonProps> = ({
  formId,
  formTitle,
  disabled = false,
  submissionCount = 0,
}) => {
  const { downloadCSV, loading, error } = useCSVDownload()

  const handleDownload = () => {
    downloadCSV(formId, formTitle)
  }

  return (
    <div>
      <button
        onClick={handleDownload}
        disabled={disabled || loading || !formId}
        className="w-full relative overflow-hidden rounded-lg text-gray-600 font-medium text-lg py-3 px-7 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:text-gray-400 border border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100 hover:border-gray-300 hover:text-gray-700 active:bg-gray-200 active:border-gray-400"
      >
        <div className="flex items-center justify-center space-x-2">
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-gray-600"></div>
              <span>Downloading...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>Download CSV</span>
              {submissionCount > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-gray-200 rounded-full text-xs font-semibold text-gray-600">
                  {submissionCount}
                </span>
              )}
            </>
          )}
        </div>
      </button>
      {error && (
        <div className="mt-2 p-2 rounded-lg bg-red-50 border border-red-200">
          <p className="text-red-600 text-xs">{error}</p>
        </div>
      )}
    </div>
  )
}

export default CSVDownloadButton
