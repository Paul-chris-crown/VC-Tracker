import { Priority } from '@prisma/client'
import { Badge } from './badge'
import { cn } from '@/utils/cn'

interface PriorityBadgeProps {
  priority: Priority
  className?: string
}

const priorityConfig = {
  [Priority.LOW]: {
    label: 'Low',
    className: 'bg-gray-100 text-gray-800 border-gray-200',
  },
  [Priority.MEDIUM]: {
    label: 'Medium',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  [Priority.HIGH]: {
    label: 'High',
    className: 'bg-orange-100 text-orange-800 border-orange-200',
  },
  [Priority.URGENT]: {
    label: 'Urgent',
    className: 'bg-red-100 text-red-800 border-red-200',
  },
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority]
  
  return (
    <Badge 
      variant="outline" 
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  )
}
