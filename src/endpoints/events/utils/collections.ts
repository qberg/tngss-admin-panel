import { Payload } from 'payload'

const getFormatsBySlugs = async (slugs: string[], payload: Payload) => {
  if (slugs.length === 0) return []

  const result = await payload.find({
    collection: 'event-formats',
    where: { slug: { in: slugs } },
    limit: slugs.length,
  })

  return result.docs.map((r) => ({ slug: r.slug, name: r.name }))
}

const getTagsBySlugs = async (slugs: string[], payload: Payload) => {
  if (slugs.length === 0) return []

  const result = await payload.find({
    collection: 'tags',
    where: { slug: { in: slugs } },
    limit: slugs.length,
  })

  return result.docs.map((r) => ({ slug: r.slug, name: r.name }))
}

const getHallsBySlugs = async (slugs: string[], payload: Payload) => {
  if (slugs.length === 0) return []

  const result = await payload.find({
    collection: 'halls',
    where: { slug: { in: slugs } },
    limit: slugs.length,
  })

  return result.docs.map((r) => ({ slug: r.slug, name: r.name }))
}

const getAccessLevelsBySlugs = async (slugs: string[], payload: Payload) => {
  if (slugs.length === 0) return []

  const result = await payload.find({
    collection: 'ticket-types',
    where: { slug: { in: slugs } },
    limit: slugs.length,
  })

  return result.docs.map((r) => ({ slug: r.slug, name: r.name }))
}

export { getFormatsBySlugs, getTagsBySlugs, getHallsBySlugs, getAccessLevelsBySlugs }
