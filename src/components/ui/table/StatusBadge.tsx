import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import React from 'react'

const statusBadgeVariants = cva(
  'inline-flex px-4 py-2 rounded-xl border text-xs font-medium backdrop-blur-sm',
  {
    variants: {
      variant: {
        success:
          'bg-emerald-50/70 dark:bg-emerald-900/30 border-emerald-200/40 dark:border-emerald-700/40 text-emerald-700 dark:text-emerald-300 shadow-inner',
        destructive:
          'bg-red-50/70 dark:bg-red-900/30 border-red-200/40 dark:border-red-700/40 text-red-700 dark:text-red-300 shadow-inner',
        warning:
          'bg-amber-50/70 dark:bg-amber-900/30 border-amber-200/40 dark:border-amber-700/40 text-amber-700 dark:text-amber-300 shadow-inner',
        neutral:
          'bg-gray-50/70 dark:bg-gray-800/50 border-gray-200/40 dark:border-gray-700/40 text-gray-700 dark:text-gray-300 shadow-inner',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  },
)

interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  children: React.ReactNode
}

const StatusBadge = React.forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ children, variant, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(statusBadgeVariants({ variant }), className)} {...props}>
        {children}
      </div>
    )
  },
)
StatusBadge.displayName = 'StatusBadge'

export { statusBadgeVariants, StatusBadge }
