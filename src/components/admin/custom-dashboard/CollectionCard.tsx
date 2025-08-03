import Link from 'next/link'

interface CollectionCardProps {
  title: string
  count: number | null
  href: string
  icon: string
  iconBg: string
  description: string
  loading: boolean
}

const CollectionCard: React.FC<CollectionCardProps> = ({
  title,
  count,
  href,
  icon,
  iconBg,
  description,
  loading,
}) => {
  return (
    <Link
      href={href}
      className="group block relative overflow-hidden rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300/70 dark:hover:border-gray-600/70 hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div
            className={`w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300`}
          >
            <span className="text-2xl">{icon}</span>
          </div>
          <div className="text-right">
            {loading ? (
              <div className="animate-pulse">
                <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              </div>
            ) : (
              <span className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                {count !== null ? count.toLocaleString() : '—'}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
        </div>

        {/* Subtle arrow indicator */}
        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <svg
              className="w-3 h-3 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default CollectionCard
