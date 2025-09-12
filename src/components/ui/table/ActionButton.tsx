import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import React from 'react'

const actionButtonVariants = cva(
  'px-4 py-2 text-xs font-medium rounded-xl border shadow-inner backdrop-blur-sm transition-all duration-200',
  {
    variants: {
      variant: {
        success:
          'bg-emerald-50/70 dark:bg-emerald-900/30 border-emerald-200/40 dark:border-emerald-700/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/50',
        destructive:
          'bg-red-50/70 dark:bg-red-900/30 border-red-200/40 dark:border-red-700/40 text-red-700 dark:text-red-300 hover:bg-red-100/70 dark:hover:bg-red-900/50',
        warning:
          'bg-amber-50/70 dark:bg-amber-900/30 border-amber-200/40 dark:border-amber-700/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100/70 dark:hover:bg-amber-900/50',
        neutral:
          'bg-gray-50/70 dark:bg-gray-800/50 border-gray-200/40 dark:border-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-800/70',
      },
      size: {
        sm: 'px-3 py-1 text-xs',
        default: 'px-4 py-2 text-xs',
        lg: 'px-6 py-3 text-sm',
      },
    },
    defaultVariants: {
      variant: 'neutral',
      size: 'default',
    },
  },
)

interface ActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof actionButtonVariants> {
  children: React.ReactNode
}

const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ children, variant, size, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(actionButtonVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </button>
    )
  },
)

ActionButton.displayName = 'ActionButton'

export { actionButtonVariants, ActionButton }
