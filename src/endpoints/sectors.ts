import { SECTORS } from '@/constants/sectors'
import type { PayloadHandler } from 'payload'
import { headersWithCors } from 'payload'

export const getSectors: PayloadHandler = async (req) => {
  try {
    return Response.json(
      {
        success: true,
        status: 200,
        data: SECTORS,
        total_records: SECTORS.length,
      },
      {
        headers: headersWithCors({
          headers: new Headers(),
          req,
        }),
      },
    )
  } catch (error) {
    console.error('Error fetching sectors:', error)
    return Response.json(
      { error: 'Failed to fetch sectors' },
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
