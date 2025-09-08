'use client'

import { usePayloadAPI } from '@payloadcms/ui'
import { useState, useEffect } from 'react'

interface FormOption {
  id: string
  title: string
  submissionCount: number
}

export const useFormsData = () => {
  const [forms, setForms] = useState<FormOption[]>([])
  const [submissionsCount, setSubmissionsCount] = useState<Record<string, number>>({})

  const [{ data: formsData, isLoading, isError }, { setParams }] = usePayloadAPI('/api/forms', {
    initialParams: { limit: 10 },
  })

  useEffect(() => {
    if (formsData?.docs) {
      const fetchSubmissionCounts = async () => {
        const counts: Record<string, number> = {}

        await Promise.all(
          // @ts-expect-error any
          formsData.docs.map(async (form) => {
            try {
              const response = await fetch(
                `/api/form-submissions?where[form][equals]=${form.id}&limit=1`,
              )
              const result = await response.json()
              counts[form.id] = result.totalDocs || 0
            } catch {
              counts[form.id] = 0
            }
          }),
        )

        setSubmissionsCount(counts)
      }
      fetchSubmissionCounts()
    }
  }, [formsData])

  useEffect(() => {
    if (formsData?.docs) {
      // @ts-expect-error any
      const formsWithCounts: FormOption[] = formsData.docs.map((form) => ({
        id: form.id,
        title: form.title || 'Untitled Form',
        submissionCount: submissionsCount[form.id] || 0,
      }))

      setForms(formsWithCounts)
    }
  }, [formsData, submissionsCount])

  const refetch = () => {
    setParams({ cacheBust: Date.now() })
  }

  return {
    forms,
    loading: isLoading,
    error: isError ? 'Failed to load forms' : null,
    refetch,
  }
}
