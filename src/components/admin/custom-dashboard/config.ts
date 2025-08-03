import { CollectionSlug } from 'payload'
import { DashboardCollection, QuickAction } from './types'

export const COLLECTION_SLUGS: CollectionSlug[] = [
  'speakers',
  'speaker-types',
  'representatives',
  'users',
  'media',
  'documents',
]

export const CORE_COLLECTIONS = (adminRoute: string): DashboardCollection[] => [
  {
    key: 'speakers',
    title: 'Speakers',
    href: `${adminRoute}/collections/speakers`,
    icon: '🎤',
    iconBg: 'bg-orange-100 dark:bg-orange-900/30',
    description: 'Event speakers and their profiles',
    category: 'core',
  },
  {
    key: 'representatives',
    title: 'Representatives',
    href: `${adminRoute}/collections/representatives`,
    icon: '👥',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    description: 'Organization representatives',
    category: 'core',
  },
  {
    key: 'users',
    title: 'Admin Users',
    href: `${adminRoute}/collections/users`,
    icon: '🔐',
    iconBg: 'bg-green-100 dark:bg-green-900/30',
    description: 'System administrators',
    category: 'core',
  },
]

export const FILE_COLLECTIONS = (adminRoute: string): DashboardCollection[] => [
  {
    key: 'media',
    title: 'Media Files',
    href: `${adminRoute}/collections/media`,
    icon: '🖼️',
    iconBg: 'bg-pink-100 dark:bg-pink-900/30',
    description: 'Images, videos, and other media',
    category: 'file',
  },
  {
    key: 'documents',
    title: 'Documents',
    href: `${adminRoute}/collections/documents`,
    icon: '📄',
    iconBg: 'bg-indigo-100 dark:bg-indigo-900/30',
    description: 'PDFs, documents, and files',
    category: 'file',
  },
]

export const QUICK_ACTIONS = (adminRoute: string): QuickAction[] => [
  {
    href: `${adminRoute}/collections/speakers/create`,
    icon: '➕',
    title: 'Add Speaker',
    iconBg: 'bg-orange-100 dark:bg-orange-900/30',
    category: 'create',
  },
  {
    href: `${adminRoute}/collections/representatives/create`,
    icon: '👥',
    title: 'Add Representative',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    category: 'create',
  },
  {
    href: `${adminRoute}/collections/users/create`,
    icon: '🔐',
    title: 'Add Admin User',
    iconBg: 'bg-green-100 dark:bg-green-900/30',
    category: 'create',
  },
  {
    href: `${adminRoute}/collections/speaker-types/create`,
    icon: '🏷️',
    title: 'Add Type',
    iconBg: 'bg-purple-100 dark:bg-purple-900/30',
    category: 'create',
  },
]

export const getAllCollections = (adminRoute: string): DashboardCollection[] => [
  ...CORE_COLLECTIONS(adminRoute),
  ...FILE_COLLECTIONS(adminRoute),
]

/*
    key: 'speaker-types',
    title: 'Speaker Types',
    href: `${adminRoute}/collections/speaker-types`,
    icon: '🏷️',
    iconBg: 'bg-purple-100 dark:bg-purple-900/30',
    description: 'Categories and types for speakers',
    category: 'system',
  */
