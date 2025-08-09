import { Status } from '@prisma/client'
import { Badge } from './badge'
import { cn } from '@/utils/cn'

interface StatusBadgeProps {
  status: Status
  className?: string
}

const statusConfig = {
  [Status.BACKLOG]: {
    label: 'Backlog',
    className: 'bg-gray-100 text-gray-800 border-gray-200',
  },
  [Status.TODO]: {
    label: 'To Do',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  [Status.IN_PROGRESS]: {
    label: 'In Progress',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
  [Status.BLOCKED]: {
    label: 'Blocked',
    className: 'bg-red-100 text-red-800 border-red-200',
  },
  [Status.REVIEW]: {
    label: 'Review',
    className: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  [Status.DONE]: {
    label: 'Done',
    className: 'bg-green-100 text-green-800 border-green-200',
  },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]
  
  return (
    <Badge 
      variant="outline" 
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  )
}
