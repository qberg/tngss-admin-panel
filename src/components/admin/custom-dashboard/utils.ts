import { Payload } from 'payload'
import { COLLECTION_SLUGS } from './config'
import { CollectionStats } from './types'

export async function fetchStatsWithLocalAPI(payload: Payload): Promise<CollectionStats> {
  const statsPromises = COLLECTION_SLUGS.map(async (collectionSlug) => {
    try {
      const result = await payload.count({
        collection: collectionSlug,
        where: {},
      })
      return { collection: collectionSlug, count: result.totalDocs }
    } catch (err) {
      console.error(`Error counting ${collectionSlug}:`, err)
      return { collection: collectionSlug, count: 0 }
    }
  })

  const results = await Promise.all(statsPromises)
  return results.reduce((acc, { collection, count }) => {
    acc[collection as keyof CollectionStats] = count
    return acc
  }, {} as CollectionStats)
}

export async function fetchStatsWithRestAPI(): Promise<CollectionStats> {
  const statsPromises = COLLECTION_SLUGS.map(async (collectionSlug) => {
    try {
      const response = await fetch(`/api/${collectionSlug}?limit=0&depth=0`)
      if (!response.ok) {
        console.warn(
          `Failed to fetch ${collectionSlug} count:`,
          response.status,
          response.statusText,
        )
        return { collection: collectionSlug, count: 0 }
      }
      const data = await response.json()
      return { collection: collectionSlug, count: data.totalDocs || 0 }
    } catch (err) {
      console.error(`Error fetching ${collectionSlug} count via REST:`, err)
      return { collection: collectionSlug, count: 0 }
    }
  })

  const results = await Promise.all(statsPromises)

  return results.reduce((acc, { collection, count }) => {
    acc[collection as keyof CollectionStats] = count
    return acc
  }, {} as CollectionStats)
}
