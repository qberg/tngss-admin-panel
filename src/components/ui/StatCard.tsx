import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import React from 'react'

const statCardVariants = cva('rounded-2xl p-4 border shadow-inner backdrop-blur-sm text-center', {
  variants: {
    variant: {
      neutral: 'bg-gray-50/50 dark:bg-gray-700/30 border-gray-200/30 dark:border-gray-600/30',
      warning: 'bg-amber-50/50 dark:bg-amber-900/20 border-amber-200/30 dark:border-amber-600/30',
      success:
        'bg-emerald-50/50 dark:bg-emerald-900/20 border-emerald-200/30 dark:border-emerald-600/30',
      destructive: 'bg-red-50/50 dark:bg-red-900/20 border-red-200/30 dark:border-red-600/30',
    },
  },
  defaultVariants: {
    variant: 'neutral',
  },
})

const statNumberVariants = cva('text-2xl font-bold mb-1', {
  variants: {
    variant: {
      neutral: 'text-gray-900 dark:text-white',
      warning: 'text-amber-700 dark:text-amber-300',
      success: 'text-emerald-700 dark:text-emerald-300',
      destructive: 'text-red-700 dark:text-red-300',
    },
  },
  defaultVariants: {
    variant: 'neutral',
  },
})

const statLabelVariants = cva('text-xs font-medium uppercase tracking-wide', {
  variants: {
    variant: {
      neutral: 'text-gray-500 dark:text-gray-400',
      warning: 'text-amber-600 dark:text-amber-400',
      success: 'text-emerald-600 dark:text-emerald-400',
      destructive: 'text-red-600 dark:text-red-400',
    },
  },
  defaultVariants: {
    variant: 'neutral',
  },
})

interface StatCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statCardVariants> {
  count: number
  label: string
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ count, label, variant, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-id="stat-card"
        data-variant={variant}
        className={cn(statCardVariants({ variant }), className)}
        {...props}
      >
        <div className={statNumberVariants({ variant })}>{count}</div>
        <div className={statLabelVariants({ variant })}>{label}</div>
      </div>
    )
  },
)

StatCard.displayName = 'StatCard'

export { statCardVariants, statLabelVariants, statNumberVariants, StatCard }
