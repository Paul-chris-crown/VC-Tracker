import { Status, Priority, Role } from '@prisma/client'

export interface User {
  id: string
  email: string
  name: string | null
  image: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Organization {
  id: string
  name: string
  slug: string
  logo: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Membership {
  id: string
  role: Role
  userId: string
  organizationId: string
  user: User
  organization: Organization
  createdAt: Date
  updatedAt: Date
}

export interface Project {
  id: string
  organizationId: string
  name: string
  key: string
  description: string | null
  leadId: string | null
  startDate: Date | null
  dueDate: Date | null
  status: Status
  priority: Priority
  budgetCents: number
  createdAt: Date
  updatedAt: Date
  organization: Organization
  lead: User | null
  _count?: {
    tasks: number
    epics: number
  }
}

export interface Epic {
  id: string
  projectId: string
  name: string
  createdAt: Date
  updatedAt: Date
  project: Project
  _count?: {
    tasks: number
  }
}

export interface Task {
  id: string
  projectId: string
  epicId: string | null
  parentTaskId: string | null
  title: string
  description: string | null
  status: Status
  priority: Priority
  points: number | null
  startDate: Date | null
  dueDate: Date | null
  orderIndex: number
  createdById: string
  createdAt: Date
  updatedAt: Date
  project: Project
  epic: Epic | null
  parentTask: Task | null
  subtasks: Task[]
  createdBy: User
  assignees: TaskAssignee[]
  labels: TaskLabel[]
  comments: Comment[]
  files: File[]
  timeEntries: TimeEntry[]
  _count?: {
    subtasks: number
    comments: number
    timeEntries: number
  }
}

export interface TaskAssignee {
  id: string
  taskId: string
  userId: string
  task: Task
  user: User
}

export interface Label {
  id: string
  name: string
  color: string
  organizationId: string
  createdAt: Date
  updatedAt: Date
  organization: Organization
}

export interface TaskLabel {
  id: string
  taskId: string
  labelId: string
  task: Task
  label: Label
}

export interface Comment {
  id: string
  taskId: string
  authorId: string
  body: string
  createdAt: Date
  updatedAt: Date
  task: Task
  author: User
}

export interface File {
  id: string
  url: string
  name: string
  size: number
  taskId: string | null
  projectId: string | null
  createdAt: Date
  task: Task | null
  project: Project | null
}

export interface TimeEntry {
  id: string
  taskId: string
  userId: string
  startedAt: Date
  endedAt: Date | null
  seconds: number
  billable: boolean
  rateCents: number
  createdAt: Date
  updatedAt: Date
  task: Task
  user: User
}

export interface Activity {
  id: string
  type: string
  meta: any
  projectId: string | null
  taskId: string | null
  actorId: string
  createdAt: Date
  project: Project | null
  task: Task | null
  actor: User
}

export interface Invite {
  id: string
  email: string
  organizationId: string
  role: Role
  token: string
  accepted: boolean
  createdAt: Date
  organization: Organization
}

export interface Notification {
  id: string
  userId: string
  title: string
  body: string
  read: boolean
  createdAt: Date
  user: User
}

// API Response types
export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Form types
export interface CreateOrganizationForm {
  name: string
  slug: string
  logo?: File
}

export interface CreateProjectForm {
  name: string
  key: string
  description?: string
  leadId?: string
  startDate?: Date
  dueDate?: Date
  status: Status
  priority: Priority
  budgetCents?: number
}

export interface CreateTaskForm {
  title: string
  description?: string
  status: Status
  priority: Priority
  points?: number
  startDate?: Date
  dueDate?: Date
  epicId?: string
  parentTaskId?: string
  assigneeIds?: string[]
  labelIds?: string[]
}

export interface UpdateTaskForm {
  title?: string
  description?: string
  status?: Status
  priority?: Priority
  points?: number
  startDate?: Date
  dueDate?: Date
  epicId?: string
  parentTaskId?: string
  assigneeIds?: string[]
  labelIds?: string[]
  orderIndex?: number
}

export interface CreateCommentForm {
  body: string
}

export interface CreateInviteForm {
  email: string
  role: Role
}

// Dashboard types
export interface DashboardMetrics {
  totalProjects: number
  tasksByStatus: Record<Status, number>
  overdueTasks: number
  timeLogged: number
  billableTotal: number
  budgetBurn: number
  plannedBudget: number
  activeUsers: number
  recentActivity: Activity[]
}

// Search types
export interface SearchResult {
  type: 'task' | 'project' | 'comment'
  id: string
  title: string
  description?: string
  url: string
  score: number
}

// Realtime types
export interface PusherEvent {
  type: string
  data: any
  userId?: string
  timestamp: number
}
