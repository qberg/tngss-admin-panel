import type { PayloadHandler, Where } from 'payload'
import { headersWithCors } from 'payload'

export const getOrganisationRolesByType: PayloadHandler = async (req) => {
  try {
    const { type } = req.query

    if (!type) {
      return Response.json(
        { error: 'Type parameter is required' },
        {
          status: 400,
          headers: headersWithCors({
            headers: new Headers(),
            req,
          }),
        },
      )
    }

    // @ts-expect-error any
    const types = Array.isArray(type) ? type : type.split(',').map((t) => t.trim())

    const query: Where =
      types.length === 1
        ? {
            organisation_type: {
              equals: types[0],
            },
          }
        : {
            organisation_type: {
              in: types,
            },
          }

    const result = await req.payload.find({
      collection: 'organisation_roles',
      where: query,
      select: {
        roles: true,
        id: true,
      },
      depth: 1,
    })

    if (result.docs.length === 0) {
      return Response.json(
        {
          success: false,
          error: `No roles found for organisation type: ${type}`,
        },
        {
          status: 404,
          headers: headersWithCors({
            headers: new Headers(),
            req,
          }),
        },
      )
    }

    const allRoles = result.docs.reduce((acc, doc) => {
      if (doc.roles && Array.isArray(doc.roles)) {
        // @ts-expect-error any
        acc.push(...doc.roles)
      }
      return acc
    }, [])

    const uniqueRoles = allRoles.filter(
      (role, index, self) =>
        // @ts-expect-error any
        index === self.findIndex((r) => r.key === role.key),
    )

    return Response.json(
      {
        success: true,
        status: 200,
        roles: uniqueRoles,
        total_records: uniqueRoles.length,
        requested_types: types,
      },
      {
        headers: headersWithCors({
          headers: new Headers(),
          req,
        }),
      },
    )
  } catch (error) {
    console.error('Error fetching organisation roles:', error)
    return Response.json(
      { error: 'Failed to fetch organisation roles' },
      {
        status: 500,
        headers: headersWithCors({
          headers: new Headers(),
          req,
        }),
      },
    )
  }
}
