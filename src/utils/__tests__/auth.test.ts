import { describe, it, expect } from 'vitest'
import { Role } from '@prisma/client'
import {
  canManageOrg,
  canEditProject,
  canMoveTask,
  canViewTask,
  canCreateTask,
  canDeleteTask,
  canInviteUsers,
  canManageRoles,
} from '../auth'

describe('Auth Utilities', () => {
  describe('canManageOrg', () => {
    it('should return true for OWNER role', () => {
      expect(canManageOrg(Role.OWNER)).toBe(true)
    })

    it('should return true for ADMIN role', () => {
      expect(canManageOrg(Role.ADMIN)).toBe(true)
    })

    it('should return false for other roles', () => {
      expect(canManageOrg(Role.MANAGER)).toBe(false)
      expect(canManageOrg(Role.MEMBER)).toBe(false)
      expect(canManageOrg(Role.VIEWER)).toBe(false)
    })
  })

  describe('canEditProject', () => {
    it('should return true for OWNER, ADMIN, and MANAGER roles', () => {
      expect(canEditProject(Role.OWNER)).toBe(true)
      expect(canEditProject(Role.ADMIN)).toBe(true)
      expect(canEditProject(Role.MANAGER)).toBe(true)
    })

    it('should return false for MEMBER and VIEWER roles', () => {
      expect(canEditProject(Role.MEMBER)).toBe(false)
      expect(canEditProject(Role.VIEWER)).toBe(false)
    })
  })

  describe('canMoveTask', () => {
    it('should return true for all roles except VIEWER', () => {
      expect(canMoveTask(Role.OWNER)).toBe(true)
      expect(canMoveTask(Role.ADMIN)).toBe(true)
      expect(canMoveTask(Role.MANAGER)).toBe(true)
      expect(canMoveTask(Role.MEMBER)).toBe(true)
    })

    it('should return false for VIEWER role', () => {
      expect(canMoveTask(Role.VIEWER)).toBe(false)
    })
  })

  describe('canViewTask', () => {
    it('should return true for all roles', () => {
      expect(canViewTask(Role.OWNER)).toBe(true)
      expect(canViewTask(Role.ADMIN)).toBe(true)
      expect(canViewTask(Role.MANAGER)).toBe(true)
      expect(canViewTask(Role.MEMBER)).toBe(true)
      expect(canViewTask(Role.VIEWER)).toBe(true)
    })
  })

  describe('canCreateTask', () => {
    it('should return true for all roles except VIEWER', () => {
      expect(canCreateTask(Role.OWNER)).toBe(true)
      expect(canCreateTask(Role.ADMIN)).toBe(true)
      expect(canCreateTask(Role.MANAGER)).toBe(true)
      expect(canCreateTask(Role.MEMBER)).toBe(true)
    })

    it('should return false for VIEWER role', () => {
      expect(canCreateTask(Role.VIEWER)).toBe(false)
    })
  })

  describe('canDeleteTask', () => {
    it('should return true for OWNER, ADMIN, and MANAGER roles', () => {
      expect(canDeleteTask(Role.OWNER)).toBe(true)
      expect(canDeleteTask(Role.ADMIN)).toBe(true)
      expect(canDeleteTask(Role.MANAGER)).toBe(true)
    })

    it('should return false for MEMBER and VIEWER roles', () => {
      expect(canDeleteTask(Role.MEMBER)).toBe(false)
      expect(canDeleteTask(Role.VIEWER)).toBe(false)
    })
  })

  describe('canInviteUsers', () => {
    it('should return true for OWNER and ADMIN roles', () => {
      expect(canInviteUsers(Role.OWNER)).toBe(true)
      expect(canInviteUsers(Role.ADMIN)).toBe(true)
    })

    it('should return false for other roles', () => {
      expect(canInviteUsers(Role.MANAGER)).toBe(false)
      expect(canInviteUsers(Role.MEMBER)).toBe(false)
      expect(canInviteUsers(Role.VIEWER)).toBe(false)
    })
  })

  describe('canManageRoles', () => {
    it('should return true for OWNER and ADMIN roles', () => {
      expect(canManageRoles(Role.OWNER)).toBe(true)
      expect(canManageRoles(Role.ADMIN)).toBe(true)
    })

    it('should return false for other roles', () => {
      expect(canManageRoles(Role.MANAGER)).toBe(false)
      expect(canManageRoles(Role.MEMBER)).toBe(false)
      expect(canManageRoles(Role.VIEWER)).toBe(false)
    })
  })
})
