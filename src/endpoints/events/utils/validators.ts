import { MainEventFilterParams } from '../types'

const hasAnyFilters = (params: MainEventFilterParams): boolean => {
  return !!(
    params.dates?.length ||
    params.zones?.length ||
    params.halls?.length ||
    params.formats?.length ||
    params.tags?.length ||
    params.accessLevels?.length ||
    params.registerationModes?.length ||
    params.timeStart ||
    params.timeEnd ||
    params.publicOnly
  )
}

export { hasAnyFilters }
