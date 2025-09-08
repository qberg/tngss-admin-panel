'use client'
import { useState, useEffect } from 'react'
import { usePayloadAPI } from '@payloadcms/ui'

interface FormFieldItem {
  field: string
  value: string | number | boolean
  id: string
}

interface FormSubmissionData {
  id: string
  form: string | { id: string; title: string }
  submissionData: FormFieldItem[] | Record<string, unknown>
  createdAt: string
  updatedAt: string
}

interface UseCSVDownloadReturn {
  downloadCSV: (formId: string, formTitle: string) => void
  loading: boolean
  error: string | null
}

const convertValueToLabel = (value: string, fieldName?: string): string => {
  if (!value || typeof value !== 'string') return value

  if (fieldName === 'email' || value.includes('@')) {
    return value
  }

  return value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

const isFormFieldItem = (item: unknown): item is FormFieldItem => {
  return (
    typeof item === 'object' &&
    item !== null &&
    'field' in item &&
    'value' in item &&
    typeof (item as FormFieldItem).field === 'string'
  )
}

const hasFieldAndValue = (value: unknown): value is { field: string; value: unknown } => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'field' in value &&
    'value' in value &&
    typeof (value as { field: string }).field === 'string'
  )
}

const generateCSVFile = (data: FormSubmissionData[], formTitle: string): void => {
  if (data.length === 0) {
    alert('No submissions found for this form.')
    return
  }

  const allFieldNames = new Set<string>()
  const parsedSubmissions = data.map((submission) => {
    const parsedData: Record<string, string> = {}

    if (submission.submissionData && Array.isArray(submission.submissionData)) {
      submission.submissionData.forEach((item) => {
        if (isFormFieldItem(item)) {
          allFieldNames.add(item.field)
          parsedData[item.field] = convertValueToLabel(String(item.value || ''), item.field)
        }
      })
    } else if (submission.submissionData && typeof submission.submissionData === 'object') {
      Object.entries(submission.submissionData).forEach(([key, value]) => {
        if (hasFieldAndValue(value)) {
          allFieldNames.add(value.field)
          parsedData[value.field] = convertValueToLabel(String(value.value || ''), value.field)
        } else {
          allFieldNames.add(key)
          parsedData[key] = convertValueToLabel(String(value || ''), key)
        }
      })
    }

    return {
      ...submission,
      parsedData,
    }
  })

  const headers = ['Submitted At', ...Array.from(allFieldNames).sort()]

  const csvRows = parsedSubmissions.map((submission) => {
    const baseRow = [new Date(submission.createdAt).toLocaleString()]

    const fieldValues = Array.from(allFieldNames)
      .sort()
      .map((fieldName) => {
        return submission.parsedData[fieldName] || ''
      })

    return [...baseRow, ...fieldValues]
  })

  const csvContent = [headers, ...csvRows]
    .map((row) =>
      row
        .map((field) => {
          const stringField = String(field)
          if (
            stringField.includes(',') ||
            stringField.includes('"') ||
            stringField.includes('\n')
          ) {
            return `"${stringField.replace(/"/g, '""')}"`
          }
          return stringField
        })
        .join(','),
    )
    .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute(
      'download',
      `${formTitle}-submissions-${new Date().toISOString().split('T')[0]}.csv`,
    )
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}

export const useCSVDownload = (): UseCSVDownloadReturn => {
  const [pendingDownload, setPendingDownload] = useState<{
    formId: string
    formTitle: string
  } | null>(null)

  const [{ data, isLoading, isError }, { setParams }] = usePayloadAPI('/api/form-submissions', {
    initialData: null,
  })

  const [hasStartedDownload, setHasStartedDownload] = useState(false)

  useEffect(() => {
    if (data?.docs && pendingDownload) {
      generateCSVFile(data.docs, pendingDownload.formTitle)
      setPendingDownload(null)
      setHasStartedDownload(false)
    }
  }, [data, pendingDownload])

  const downloadCSV = (formId: string, formTitle: string) => {
    if (!formId) {
      alert('Please select a form first.')
      return
    }

    setHasStartedDownload(true)
    setPendingDownload({ formId, formTitle })

    setParams({
      where: { form: { equals: formId } },
      pagination: false,
      cacheBust: Date.now(),
    })
  }

  return {
    downloadCSV,
    loading: isLoading && hasStartedDownload,
    error: isError ? 'Failed to download submissions' : null,
  }
}
