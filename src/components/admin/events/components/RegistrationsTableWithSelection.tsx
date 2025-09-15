import { useState } from 'react'
import { ExternalRegistrationData } from '@/types/events'
import {
  NameCell,
  ContactCell,
  OrganizationCell,
  StatusCell,
  ActionsCell,
  SelectionCell,
} from './RegistrationCells'
import { Checkbox } from '@/components/ui/Checkbox'

interface RegistrationTableWithSelectionProps {
  registrations: ExternalRegistrationData[]
  onStatusUpdate: (id: string, status: 'approved' | 'rejected') => void
  onBulkStatusUpdate?: (ids: string[], status: 'approved' | 'rejected') => void
}

const RegistrationTableWithSelection = ({
  registrations,
  onStatusUpdate,
  onBulkStatusUpdate,
}: RegistrationTableWithSelectionProps) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const pendingRegistrations = registrations.filter(
    (r) => r.registration_status === 'waiting_for_approval',
  )
  const hasPendingRegistrations = pendingRegistrations.length > 0

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(pendingRegistrations.map((r) => r._id)))
    } else {
      setSelectedIds(new Set())
    }
  }

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedIds(newSelected)
  }

  const handleBulkAction = (status: 'approved' | 'rejected') => {
    if (selectedIds.size > 0 && onBulkStatusUpdate) {
      onBulkStatusUpdate(Array.from(selectedIds), status)
      setSelectedIds(new Set()) // Clear selection after action
    }
  }

  // Selection state
  const allPendingSelected =
    pendingRegistrations.length > 0 && pendingRegistrations.every((r) => selectedIds.has(r._id))
  const someSelected = selectedIds.size > 0 && selectedIds.size < pendingRegistrations.length

  return (
    <>
      {/* Bulk Actions Bar - only show when items are selected */}
      {selectedIds.size > 0 && (
        <BulkActionsBar
          selectedCount={selectedIds.size}
          onBulkApprove={() => handleBulkAction('approved')}
          onBulkReject={() => handleBulkAction('rejected')}
          onClearSelection={() => setSelectedIds(new Set())}
        />
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <TableHeader
            showSelection={hasPendingRegistrations}
            allSelected={allPendingSelected}
            indeterminate={someSelected}
            onSelectAll={handleSelectAll}
          />
          <TableBody
            registrations={registrations}
            selectedIds={selectedIds}
            onStatusUpdate={onStatusUpdate}
            onSelectRow={handleSelectRow}
            showSelection={hasPendingRegistrations}
          />
        </table>
      </div>
    </>
  )
}

interface BulkActionsBarProps {
  selectedCount: number
  onBulkApprove: () => void
  onBulkReject: () => void
  onClearSelection: () => void
}

const BulkActionsBar = ({
  selectedCount,
  onBulkApprove,
  onBulkReject,
  onClearSelection,
}: BulkActionsBarProps) => {
  return (
    <div className="p-4 bg-blue-50/50 dark:bg-blue-900/20 border-b border-blue-200/30 dark:border-blue-600/30 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
          {selectedCount} registration{selectedCount !== 1 ? 's' : ''} selected
        </span>
        <div className="flex gap-2">
          <button
            onClick={onBulkApprove}
            className="px-4 py-2 bg-emerald-50/70 dark:bg-emerald-900/30 border border-emerald-200/40 dark:border-emerald-700/40 text-emerald-700 dark:text-emerald-300 text-sm font-medium rounded-xl shadow-inner hover:bg-emerald-100/70 dark:hover:bg-emerald-900/50 transition-all duration-200 backdrop-blur-sm"
          >
            Approve Selected
          </button>
          <button
            onClick={onBulkReject}
            className="px-4 py-2 bg-red-50/70 dark:bg-red-900/30 border border-red-200/40 dark:border-red-700/40 text-red-700 dark:text-red-300 text-sm font-medium rounded-xl shadow-inner hover:bg-red-100/70 dark:hover:bg-red-900/50 transition-all duration-200 backdrop-blur-sm"
          >
            Reject Selected
          </button>
          <button
            onClick={onClearSelection}
            className="px-4 py-2 bg-gray-50/70 dark:bg-gray-800/50 border border-gray-200/40 dark:border-gray-700/40 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-xl shadow-inner hover:bg-gray-100/70 dark:hover:bg-gray-800/70 transition-all duration-200 backdrop-blur-sm"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}

interface TableHeaderProps {
  showSelection: boolean
  allSelected: boolean
  indeterminate: boolean
  onSelectAll: (checked: boolean) => void
}

const TableHeader = ({
  showSelection,
  allSelected,
  indeterminate,
  onSelectAll,
}: TableHeaderProps) => {
  const columns = ['Name', 'Contact', 'Organization', 'Status', 'Actions']

  return (
    <thead className="bg-gray-50/30 dark:bg-gray-900/30">
      <tr>
        {showSelection && (
          <th className="px-6 py-4">
            <div className="flex items-center justify-center">
              <div className="relative">
                <Checkbox checked={allSelected} onCheckedChange={onSelectAll} />
                {indeterminate && !allSelected && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-2 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
                  </div>
                )}
              </div>
            </div>
          </th>
        )}
        {columns.map((column) => (
          <th
            key={column}
            className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
          >
            {column}
          </th>
        ))}
      </tr>
    </thead>
  )
}

interface TableBodyProps {
  registrations: ExternalRegistrationData[]
  selectedIds: Set<string>
  onStatusUpdate: (id: string, status: 'approved' | 'rejected') => void
  onSelectRow: (id: string, checked: boolean) => void
  showSelection: boolean
}

const TableBody = ({
  registrations,
  selectedIds,
  onStatusUpdate,
  onSelectRow,
  showSelection,
}: TableBodyProps) => {
  return (
    <tbody className="divide-y divide-gray-200/30 dark:divide-gray-700/30">
      {registrations.map((registration) => (
        <TableRow
          key={registration._id}
          registration={registration}
          isSelected={selectedIds.has(registration._id)}
          onStatusUpdate={onStatusUpdate}
          onSelectRow={onSelectRow}
          showSelection={showSelection}
        />
      ))}
    </tbody>
  )
}

interface TableRowProps {
  registration: ExternalRegistrationData
  isSelected: boolean
  onStatusUpdate: (id: string, status: 'approved' | 'rejected') => void
  onSelectRow: (id: string, checked: boolean) => void
  showSelection: boolean
}

const TableRow = ({
  registration,
  isSelected,
  onStatusUpdate,
  onSelectRow,
  showSelection,
}: TableRowProps) => {
  const isPending = registration.registration_status === 'waiting_for_approval'

  return (
    <tr className="hover:bg-gray-50/20 dark:hover:bg-gray-800/20 transition-colors duration-200">
      {showSelection && (
        <SelectionCell
          checked={isSelected}
          onCheckedChange={(checked) => onSelectRow(registration._id, checked)}
          disabled={!isPending}
        />
      )}

      <NameCell name={registration.name} designation={registration.designation} />
      <ContactCell email={registration.email_id} phone={registration.phone_number} />
      <OrganizationCell
        organization={registration.organization_name}
        sector={registration.sector}
      />
      <StatusCell status={registration.registration_status} />
      <ActionsCell registration={registration} onStatusUpdate={onStatusUpdate} />
    </tr>
  )
}

export default RegistrationTableWithSelection
