import { Role } from '@prisma/client'

export const ROLES = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  MEMBER: 'MEMBER',
  VIEWER: 'VIEWER',
} as const

export type UserRole = keyof typeof ROLES

export function canManageOrg(role: Role): boolean {
  return role === 'OWNER' || role === 'ADMIN'
}

export function canEditProject(role: Role): boolean {
  return role === 'OWNER' || role === 'ADMIN' || role === 'MANAGER'
}

export function canMoveTask(role: Role): boolean {
  return role === 'OWNER' || role === 'ADMIN' || role === 'MANAGER' || role === 'MEMBER'
}

export function canViewTask(role: Role): boolean {
  return true // All roles can view tasks
}

export function canCreateTask(role: Role): boolean {
  return role === 'OWNER' || role === 'ADMIN' || role === 'MANAGER' || role === 'MEMBER'
}

export function canDeleteTask(role: Role): boolean {
  return role === 'OWNER' || role === 'ADMIN' || role === 'MANAGER'
}

export function canInviteUsers(role: Role): boolean {
  return role === 'OWNER' || role === 'ADMIN'
}

export function canManageRoles(role: Role): boolean {
  return role === 'OWNER' || role === 'ADMIN'
}
