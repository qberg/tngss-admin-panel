import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import React from 'react'

const checkboxVariants = cva(
  'relative inline-flex items-center justify-center rounded-lg border transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20',
  {
    variants: {
      variant: {
        default:
          'bg-gray-50/50 dark:bg-gray-800/50 border-gray-200/40 dark:border-gray-700/40 shadow-inner backdrop-blur-sm',
        selected:
          'bg-blue-50/70 dark:bg-blue-900/30 border-blue-200/50 dark:border-blue-600/40 shadow-inner backdrop-blur-sm',
      },
      size: {
        sm: 'h-4 w-4',
        default: 'h-5 w-5',
        lg: 'h-6 w-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

const checkmarkVariants = cva(
  'absolute inset-0 flex items-center justify-center transition-all duration-200',
  {
    variants: {
      checked: {
        true: 'opacity-100 scale-100',
        false: 'opacity-0 scale-75',
      },
    },
    defaultVariants: {
      checked: false,
    },
  },
)

interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof checkboxVariants> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ checked = false, onCheckedChange, variant, size, className, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(e.target.checked)
      props.onChange?.(e)
    }

    return (
      <label className="inline-flex items-center cursor-pointer">
        <div
          className={cn(
            checkboxVariants({ variant: checked ? 'selected' : 'default', size }),
            className,
          )}
        >
          <input
            type="checkbox"
            ref={ref}
            checked={checked}
            onChange={handleChange}
            className="sr-only"
            {...props}
          />
          <div className={checkmarkVariants({ checked })}>
            <svg
              className="w-3 h-3 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      </label>
    )
  },
)

Checkbox.displayName = 'Checkbox'

export { checkboxVariants, checkmarkVariants, Checkbox }
