import { z } from 'zod'
import { Status, Priority, Role } from '@prisma/client'

// Base schemas
export const statusSchema = z.nativeEnum(Status)
export const prioritySchema = z.nativeEnum(Priority)
export const roleSchema = z.nativeEnum(Role)

// Organization schemas
export const createOrganizationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  slug: z.string().min(1, 'Slug is required').max(50, 'Slug must be less than 50 characters').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
})

export const updateOrganizationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters').optional(),
  logo: z.string().url('Must be a valid URL').optional(),
})

// Project schemas
export const createProjectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  key: z.string().min(1, 'Key is required').max(10, 'Key must be less than 10 characters').regex(/^[A-Z]+$/, 'Key must contain only uppercase letters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  leadId: z.string().cuid().optional(),
  startDate: z.date().optional(),
  dueDate: z.date().optional(),
  status: statusSchema,
  priority: prioritySchema,
  budgetCents: z.number().int().min(0, 'Budget must be positive').optional(),
})

export const updateProjectSchema = createProjectSchema.partial()

// Task schemas
export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  status: statusSchema,
  priority: prioritySchema,
  points: z.number().int().min(0, 'Points must be positive').max(100, 'Points must be less than 100').optional(),
  startDate: z.date().optional(),
  dueDate: z.date().optional(),
  epicId: z.string().cuid().optional(),
  parentTaskId: z.string().cuid().optional(),
  assigneeIds: z.array(z.string().cuid()).optional(),
  labelIds: z.array(z.string().cuid()).optional(),
})

export const updateTaskSchema = createTaskSchema.partial().extend({
  orderIndex: z.number().int().min(0).optional(),
})

// Comment schemas
export const createCommentSchema = z.object({
  body: z.string().min(1, 'Comment body is required').max(1000, 'Comment must be less than 1000 characters'),
})

// Invite schemas
export const createInviteSchema = z.object({
  email: z.string().email('Must be a valid email'),
  role: roleSchema,
})

// Time entry schemas
export const createTimeEntrySchema = z.object({
  taskId: z.string().cuid(),
  startedAt: z.date(),
  endedAt: z.date().optional(),
  seconds: z.number().int().min(0, 'Seconds must be positive'),
  billable: z.boolean().default(false),
  rateCents: z.number().int().min(0, 'Rate must be positive').default(0),
})

// Search schemas
export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  type: z.enum(['all', 'tasks', 'projects', 'comments']).default('all'),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
})

// Filter schemas
export const taskFiltersSchema = z.object({
  status: z.array(statusSchema).optional(),
  priority: z.array(prioritySchema).optional(),
  assigneeIds: z.array(z.string().cuid()).optional(),
  epicId: z.string().cuid().optional(),
  labelIds: z.array(z.string().cuid()).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  search: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
})

// Dashboard schemas
export const dashboardFiltersSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  projectIds: z.array(z.string().cuid()).optional(),
})

// Automation schemas
export const automationRuleSchema = z.object({
  name: z.string().min(1, 'Rule name is required'),
  description: z.string().optional(),
  conditions: z.array(z.object({
    field: z.string(),
    operator: z.enum(['equals', 'not_equals', 'contains', 'not_contains', 'greater_than', 'less_than', 'is_empty', 'is_not_empty']),
    value: z.any(),
  })),
  actions: z.array(z.object({
    type: z.enum(['notify', 'update_status', 'assign', 'add_label', 'create_activity']),
    params: z.record(z.any()),
  })),
  enabled: z.boolean().default(true),
})

// File upload schemas
export const fileUploadSchema = z.object({
  name: z.string().min(1, 'File name is required'),
  size: z.number().int().min(1, 'File size must be positive'),
  type: z.string().min(1, 'File type is required'),
})

// API response schemas
export const apiResponseSchema = z.object({
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
})

export const paginatedResponseSchema = z.object({
  data: z.array(z.any()),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
})

// Export types
export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>
export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>
export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
export type CreateCommentInput = z.infer<typeof createCommentSchema>
export type CreateInviteInput = z.infer<typeof createInviteSchema>
export type CreateTimeEntryInput = z.infer<typeof createTimeEntrySchema>
export type SearchInput = z.infer<typeof searchSchema>
export type TaskFiltersInput = z.infer<typeof taskFiltersSchema>
export type DashboardFiltersInput = z.infer<typeof dashboardFiltersSchema>
export type AutomationRuleInput = z.infer<typeof automationRuleSchema>
export type FileUploadInput = z.infer<typeof fileUploadSchema>
