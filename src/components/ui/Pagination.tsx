import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import React from 'react'

const paginationButtonVariants = cva(
  'inline-flex items-center justify-center text-sm font-medium transition-all duration-200 border rounded-xl shadow-inner backdrop-blur-sm',
  {
    variants: {
      variant: {
        default:
          'bg-gray-50/70 dark:bg-gray-800/50 border-gray-200/40 dark:border-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-700/60',
        active:
          'bg-blue-50/70 dark:bg-blue-900/30 border-blue-200/50 dark:border-blue-600/40 text-blue-700 dark:text-blue-300',
        disabled:
          'bg-gray-50/30 dark:bg-gray-800/30 border-gray-200/20 dark:border-gray-700/20 text-gray-400 dark:text-gray-600 cursor-not-allowed',
      },
      size: {
        sm: 'px-3 py-1.5 text-xs',
        default: 'px-4 py-2 text-sm',
        lg: 'px-5 py-2.5 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

interface PaginationButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof paginationButtonVariants> {
  children: React.ReactNode
}

const PaginationButton = React.forwardRef<HTMLButtonElement, PaginationButtonProps>(
  ({ children, variant, size, className, disabled, ...props }, ref) => {
    const buttonVariant = disabled ? 'disabled' : variant

    return (
      <button
        ref={ref}
        className={cn(paginationButtonVariants({ variant: buttonVariant, size }), className)}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    )
  },
)
PaginationButton.displayName = 'PaginationButton'

// Main Pagination Component
interface PaginationProps {
  currentPage: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
  totalRecords: number
  perPage: number
  onPageChange: (page: number) => void
}

export const Pagination = ({
  currentPage,
  totalPages,
  hasNext,
  hasPrevious,
  totalRecords,
  perPage,
  onPageChange,
}: PaginationProps) => {
  const startRecord = (currentPage - 1) * perPage + 1
  const endRecord = Math.min(currentPage * perPage, totalRecords)

  return (
    <div className="px-6 py-4 bg-gray-50/30 dark:bg-gray-800/30 border-t border-gray-200/30 dark:border-gray-700/30 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <PaginationInfo
          startRecord={startRecord}
          endRecord={endRecord}
          totalRecords={totalRecords}
        />

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          hasNext={hasNext}
          hasPrevious={hasPrevious}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  )
}

// Pagination Info Component
interface PaginationInfoProps {
  startRecord: number
  endRecord: number
  totalRecords: number
}

const PaginationInfo = ({ startRecord, endRecord, totalRecords }: PaginationInfoProps) => (
  <div className="text-sm text-gray-600 dark:text-gray-400">
    Showing <span className="font-medium text-gray-900 dark:text-white">{startRecord}</span> to{' '}
    <span className="font-medium text-gray-900 dark:text-white">{endRecord}</span> of{' '}
    <span className="font-medium text-gray-900 dark:text-white">{totalRecords}</span> results
  </div>
)

// Pagination Controls Component
interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
  onPageChange: (page: number) => void
}

const PaginationControls = ({
  currentPage,
  totalPages,
  hasNext,
  hasPrevious,
  onPageChange,
}: PaginationControlsProps) => {
  const pageNumbers = generatePageNumbers(currentPage, totalPages)

  return (
    <div className="flex items-center gap-1">
      <PaginationButton onClick={() => onPageChange(currentPage - 1)} disabled={!hasPrevious}>
        Previous
      </PaginationButton>

      <div className="flex items-center gap-1 mx-2">
        {pageNumbers.map((pageNum, index) =>
          pageNum === '...' ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 py-1 text-sm text-gray-500 dark:text-gray-400"
            >
              ...
            </span>
          ) : (
            <PaginationButton
              key={pageNum}
              onClick={() => onPageChange(Number(pageNum))}
              variant={currentPage === Number(pageNum) ? 'active' : 'default'}
            >
              {pageNum}
            </PaginationButton>
          ),
        )}
      </div>

      <PaginationButton onClick={() => onPageChange(currentPage + 1)} disabled={!hasNext}>
        Next
      </PaginationButton>
    </div>
  )
}

// Helper function to generate page numbers with ellipsis
function generatePageNumbers(currentPage: number, totalPages: number): (number | string)[] {
  const pages: (number | string)[] = []

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)

    if (currentPage > 4) {
      pages.push('...')
    }

    const startPage = Math.max(2, currentPage - 1)
    const endPage = Math.min(totalPages - 1, currentPage + 1)

    for (let i = startPage; i <= endPage; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i)
      }
    }

    if (currentPage < totalPages - 3) {
      pages.push('...')
    }

    if (totalPages > 1) {
      pages.push(totalPages)
    }
  }

  return pages
}

export { paginationButtonVariants, PaginationButton }
