export interface MainEventQueryParams {
  public_only?: string
  dates?: string | string[]
  zones?: string | string[]
  halls?: string | string[]
  formats?: string | string[]
  tags?: string | string[]
  access_levels?: string[]
  registeration_modes?: string[]
  time_start?: string
  time_end?: string
}

export interface EventListQueryParams extends MainEventQueryParams {
  page?: string
  limit?: string
  sort?: string
}

export interface MainEventFilterParams {
  publicOnly?: boolean
  dates?: string[]
  zones?: string[]
  halls?: string[]
  formats?: string[]
  tags?: string[]
  accessLevels?: string[]
  registerationModes?: string[]
  timeStart?: string
  timeEnd?: string
}

export interface EventListParams extends MainEventFilterParams {
  page: number
  limit: number
  sort: string
}

export interface ZoneOption {
  slug?: string | null | undefined
  name?: string
}

export interface TimeRange {
  earliest: string
  latest: string
  events_by_hour: { [hour: string]: number }
}

export interface AllDateAndZones {
  dates: string[]
  zones: ZoneOption[]
  totalEvents: number
  timeRange: TimeRange
}
