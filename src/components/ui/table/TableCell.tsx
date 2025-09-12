import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import React from 'react'

const tableCellVariants = cva('px-6 py-4', {
  variants: {
    variant: {
      default: 'bg-gray-50/50 dark:bg-gray-800/50 border-gray-200/30 dark:border-gray-700/30',
      status: 'bg-transparent',
      actions: 'bg-transparent',
    },
    size: {
      default: 'p-3',
      sm: 'p-2',
      lg: 'p-4',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

const cellContentVariants = cva('rounded-xl border shadow-inner backdrop-blur-sm', {
  variants: {
    variant: {
      default: 'bg-gray-50/50 dark:bg-gray-800/50 border-gray-200/30 dark:border-gray-700/30',
      status: 'border-transparent',
      actions: 'bg-transparent border-transparent shadow-none',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

interface TableCellProps
  extends React.TdHTMLAttributes<HTMLTableCellElement>,
    VariantProps<typeof tableCellVariants> {
  children: React.ReactNode
}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ children, variant, size, className, ...props }, ref) => {
    return (
      <td ref={ref} className={cn(tableCellVariants({ variant }), className)} {...props}>
        <div className={cellContentVariants({ variant, className: tableCellVariants({ size }) })}>
          {children}
        </div>
      </td>
    )
  },
)

TableCell.displayName = 'TableCell'

export { tableCellVariants, cellContentVariants, TableCell }
