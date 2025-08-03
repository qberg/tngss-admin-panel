import Link from 'next/link'

const QuickActionButton: React.FC<{
  href: string
  icon: string
  title: string
  iconBg: string
}> = ({ href, icon, title, iconBg }) => {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300/70 dark:hover:border-gray-600/70 hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
    >
      <div className="p-4">
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}
          >
            <span className="text-lg">{icon}</span>
          </div>
          <span className="font-semibold text-sm tracking-tight text-gray-900 dark:text-white">
            {title}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default QuickActionButton
