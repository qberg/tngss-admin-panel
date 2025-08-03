export interface CollectionStats {
  speakers: number
  'speaker-types': number
  representatives: number
  users: number
  media: number
  documents: number
}

export type CollectionSlug = keyof CollectionStats

export interface DashboardCollection {
  key: CollectionSlug
  title: string
  href: string
  icon: string
  iconBg: string
  description: string
  category?: 'core' | 'file' | 'system' | 'other'
}

export interface QuickAction {
  href: string
  icon: string
  title: string
  iconBg: string
  category?: string
}
