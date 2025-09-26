import type { PayloadHandler, Payload } from 'payload'
import { headersWithCors } from 'payload'

export const getSpeakersFilters: PayloadHandler = async (req) => {
  try {
    const response = await fetchSpeakersFilters(req.payload)
    return Response.json(response, {
      headers: headersWithCors({ headers: new Headers(), req }),
    })
  } catch (error) {
    console.error('Error fetching filter options:', error)
    return Response.json(
      { error: 'Failed to fetch filter options' },
      { status: 500, headers: headersWithCors({ headers: new Headers(), req }) },
    )
  }
}

const fetchSpeakersFilters = async (payload: Payload) => {
  const [speakerData] = await Promise.all([
    payload.find({
      collection: 'speakers',
      where: {
        and: [
          {
            isPublic: { equals: true },
          },
          {
            'speaker_type.slug': { not_equals: 'government-dignitaries' },
          },
        ],
      },
      select: {
        speaker_type: true,
        location: true,
        tags: true,
      },
      depth: 2,
      limit: 0,
    }),
  ])

  const speakerTypeCounts = new Map()
  const tagCounts = new Map()
  const countryCounts = new Map()

  speakerData.docs.forEach((speaker: any) => {
    if (speaker.speaker_type?.slug && speaker.speaker_type?.name) {
      const slug = speaker.speaker_type.slug
      const existing = speakerTypeCounts.get(slug) || { name: speaker.speaker_type.name, count: 0 }
      speakerTypeCounts.set(slug, { ...existing, count: existing.count + 1 })
    }

    if (speaker.tags && Array.isArray(speaker.tags)) {
      speaker.tags.forEach((tag: any) => {
        if (tag?.name && tag?.slug) {
          const slug = tag.slug
          const existing = tagCounts.get(slug) || { name: tag.name, count: 0 }
          tagCounts.set(slug, { ...existing, count: existing.count + 1 })
        }
      })
    }

    if (speaker.location) {
      const country = speaker.location?.country || ''
      if (country) {
        const existing = countryCounts.get(country) || { count: 0 }
        countryCounts.set(country, { ...existing, count: existing.count + 1 })
      }
    }
  })

  return {
    status: 200,
    message: 'Options for filters fetched',
    available: {
      speaker_types: [
        {
          value: 'all',
          label: 'All Types',
          count: speakerData.totalDocs,
        },
        ...Array.from(speakerTypeCounts.entries())
          .map(([slug, data]) => ({
            value: slug,
            label: data.name,
            count: data.count,
          }))
          .sort((a, b) => a.label.localeCompare(b.label)),
      ],
      tags: Array.from(tagCounts.entries())
        .map(([slug, data]) => ({
          value: slug,
          label: data.name,
          count: data.count,
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
      countries: Array.from(countryCounts.entries())
        .map(([country, data]) => ({
          value: country,
          label: country,
          count: data.count,
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    },
  }
}
