import { Checkbox } from '@/components/ui/Checkbox'
import { ActionButton } from '@/components/ui/table/ActionButton'
import { StatusBadge } from '@/components/ui/table/StatusBadge'
import { TableCell } from '@/components/ui/table/TableCell'
import { ExternalRegistrationData } from '@/types/events'

interface NameCellProps {
  name: string
  designation: string
}

const NameCell = ({ name, designation }: NameCellProps) => (
  <TableCell>
    <div className="text-sm font-medium text-gray-900 dark:text-white">{name}</div>
    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{designation}</div>
  </TableCell>
)

interface ContactCellProps {
  email: string
  phone: string
}

const ContactCell = ({ email, phone }: ContactCellProps) => (
  <TableCell>
    <div className="text-sm text-gray-900 dark:text-white font-medium">{email}</div>
    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{phone}</div>
  </TableCell>
)

interface OrganizationCellProps {
  organization: string
  sector?: string
}

const OrganizationCell = ({ organization, sector }: OrganizationCellProps) => (
  <TableCell>
    <div className="text-sm font-medium text-gray-900 dark:text-white">{organization}</div>
    {sector && <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{sector}</div>}
  </TableCell>
)

interface StatusCellProps {
  status: string
}

const StatusCell = ({ status }: StatusCellProps) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success'
      case 'rejected':
        return 'destructive'
      case 'waiting_for_approval':
        return 'warning'
      default:
        return 'neutral'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'waiting_for_approval':
        return 'Pending'
      case 'approved':
        return 'Approved'
      case 'rejected':
        return 'Rejected'
      default:
        return status.charAt(0).toUpperCase() + status.slice(1)
    }
  }

  return (
    <TableCell variant="status">
      <StatusBadge variant={getStatusVariant(status)}>{getStatusText(status)}</StatusBadge>
    </TableCell>
  )
}

interface ActionsCellProps {
  registration: ExternalRegistrationData
  onStatusUpdate: (id: string, status: 'approved' | 'rejected') => void
}

const ActionsCell = ({ registration, onStatusUpdate }: ActionsCellProps) => {
  if (registration.registration_status !== 'waiting_for_approval') {
    return (
      <TableCell variant="actions">
        <div></div>
      </TableCell>
    )
  }

  return (
    <TableCell variant="actions">
      <div className="flex space-x-2">
        <ActionButton
          variant="success"
          onClick={() => onStatusUpdate(registration._id, 'approved')}
        >
          Approve
        </ActionButton>
        <ActionButton
          variant="destructive"
          onClick={() => onStatusUpdate(registration._id, 'rejected')}
        >
          Reject
        </ActionButton>
      </div>
    </TableCell>
  )
}

interface SelectionCellProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
}

const SelectionCell = ({
  checked = false,
  onCheckedChange,
  disabled = false,
}: SelectionCellProps) => {
  return (
    <td className="px-6 py-4">
      <div className="flex items-center justify-center">
        <Checkbox checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
      </div>
    </td>
  )
}

interface HeaderSelectionCellProps {
  checked?: boolean
  indeterminate?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const HeaderSelectionCell = ({
  checked = false,
  indeterminate = false,
  onCheckedChange,
}: HeaderSelectionCellProps) => {
  return (
    <th className="px-6 py-4">
      <div className="flex items-center justify-center">
        <div className="relative">
          <Checkbox checked={checked} onCheckedChange={onCheckedChange} />
          {indeterminate && !checked && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-2 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
            </div>
          )}
        </div>
      </div>
    </th>
  )
}

export {
  NameCell,
  ContactCell,
  OrganizationCell,
  StatusCell,
  ActionsCell,
  SelectionCell,
  HeaderSelectionCell,
}
