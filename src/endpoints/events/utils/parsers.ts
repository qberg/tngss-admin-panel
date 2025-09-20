import { MainEventFilterParams, MainEventQueryParams } from '../types'

const parseMainEventParams = (query: MainEventQueryParams): MainEventFilterParams => {
  return {
    publicOnly: query.public_only === 'true',
    dates: parseArrayParam(query.dates),
    zones: parseArrayParam(query.zones),
    halls: parseArrayParam(query.halls),
    formats: parseArrayParam(query.formats),
    tags: parseArrayParam(query.tags),
    accessLevels: parseArrayParam(query.access_levels),
    timeStart: query.time_start,
    timeEnd: query.time_end,
  }
}

const parseArrayParam = (param: string | string[] | undefined): string[] | undefined => {
  if (!param) return undefined
  return Array.isArray(param) ? param : param.split(',').map((p) => p.trim())
}

export { parseMainEventParams, parseArrayParam }
