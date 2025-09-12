import { ExternalRegistrationData } from '@/types/events'
import {
  NameCell,
  ContactCell,
  OrganizationCell,
  StatusCell,
  ActionsCell,
} from './RegistrationCells'

interface SimpleRegistrationTableProps {
  registrations: ExternalRegistrationData[]
  onStatusUpdate: (id: string, status: 'approved' | 'rejected') => void
}

const SimpleRegistrationTable = ({
  registrations,
  onStatusUpdate,
}: SimpleRegistrationTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <TableHeader />
        <TableBody registrations={registrations} onStatusUpdate={onStatusUpdate} />
      </table>
    </div>
  )
}

// Table Header
const TableHeader = () => {
  const columns = ['Name', 'Contact', 'Organization', 'Status', 'Actions']

  return (
    <thead className="bg-gray-50/30 dark:bg-gray-900/30">
      <tr>
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

// Table Body
interface TableBodyProps {
  registrations: ExternalRegistrationData[]
  onStatusUpdate: (id: string, status: 'approved' | 'rejected') => void
}

const TableBody = ({ registrations, onStatusUpdate }: TableBodyProps) => {
  return (
    <tbody className="divide-y divide-gray-200/30 dark:divide-gray-700/30">
      {registrations.map((registration) => (
        <TableRow
          key={registration._id}
          registration={registration}
          onStatusUpdate={onStatusUpdate}
        />
      ))}
    </tbody>
  )
}

// Table Row
interface TableRowProps {
  registration: ExternalRegistrationData
  onStatusUpdate: (id: string, status: 'approved' | 'rejected') => void
}

const TableRow = ({ registration, onStatusUpdate }: TableRowProps) => {
  return (
    <tr className="hover:bg-gray-50/20 dark:hover:bg-gray-800/20 transition-colors duration-200">
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

export default SimpleRegistrationTable
