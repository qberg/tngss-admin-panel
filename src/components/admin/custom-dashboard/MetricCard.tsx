const MetricCard: React.FC<{
  title: string
  value: number
  icon: string
  iconBg: string
  accentColor: string
}> = ({ title, value, icon, iconBg, accentColor }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-1">
              {value.toLocaleString()}
            </div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</div>
          </div>
          <div
            className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center shadow-sm`}
          >
            <span className="text-xl">{icon}</span>
          </div>
        </div>

        {/* Subtle accent bar */}
        <div className="mt-4 h-1 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className={`h-full ${accentColor} rounded-full w-3/4`}></div>
        </div>
      </div>
    </div>
  )
}

export default MetricCard
