'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { 
  LayoutDashboard, 
  FolderOpen, 
  Users, 
  Search, 
  Bell, 
  Settings,
  Plus,
  ChevronDown,
  Building2,
  Calendar,
  BarChart3,
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/utils/cn'

interface SidebarItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

export function AppSidebar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const params = useParams()
  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false)
  const [isProjectsDropdownOpen, setIsProjectsDropdownOpen] = useState(false)

  const orgSlug = params.org as string

  const sidebarItems: SidebarItem[] = [
    {
      href: `/app/${orgSlug}/portfolio`,
      label: 'Portfolio',
      icon: LayoutDashboard,
    },
    {
      href: `/app/${orgSlug}/my-work`,
      label: 'My Work',
      icon: Clock,
    },
    {
      href: `/app/${orgSlug}/search`,
      label: 'Search',
      icon: Search,
    },
    {
      href: `/app/${orgSlug}/notifications`,
      label: 'Notifications',
      icon: Bell,
      badge: 3, // This would come from API
    },
  ]

  const adminItems: SidebarItem[] = [
    {
      href: `/app/${orgSlug}/admin/overview`,
      label: 'Overview',
      icon: BarChart3,
    },
    {
      href: `/app/${orgSlug}/admin/settings`,
      label: 'Settings',
      icon: Settings,
    },
  ]

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      {/* Organization Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Button
            variant="ghost"
            className="w-full justify-between p-2 h-auto"
            onClick={() => setIsOrgDropdownOpen(!isOrgDropdownOpen)}
          >
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">VC</span>
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">VC Tracker</div>
                <div className="text-xs text-gray-500">{orgSlug}</div>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </Button>
          
          {isOrgDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <div className="p-2">
                <div className="text-xs font-medium text-gray-500 mb-2">Organizations</div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                    <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white font-bold text-xs">VC</span>
                    </div>
                    <span className="text-sm font-medium">VC Tracker</span>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Organization
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {/* Projects Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Projects
            </h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setIsProjectsDropdownOpen(!isProjectsDropdownOpen)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-1">
            <Link
              href={`/app/${orgSlug}/projects`}
              className={cn(
                'sidebar-item',
                pathname === `/app/${orgSlug}/projects` 
                  ? 'sidebar-item-active' 
                  : 'sidebar-item-inactive'
              )}
            >
              <FolderOpen className="h-4 w-4 mr-3" />
              All Projects
            </Link>
            
            {/* Project list would be populated from API */}
            <Link
              href={`/app/${orgSlug}/projects/demo`}
              className={cn(
                'sidebar-item pl-8',
                pathname.startsWith(`/app/${orgSlug}/projects/demo`)
                  ? 'sidebar-item-active'
                  : 'sidebar-item-inactive'
              )}
            >
              Demo Project
            </Link>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Navigation
          </h3>
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'sidebar-item',
                  pathname === item.href 
                    ? 'sidebar-item-active' 
                    : 'sidebar-item-inactive'
                )}
              >
                <item.icon className="h-4 w-4 mr-3" />
                {item.label}
                {item.badge && (
                  <span className="ml-auto bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Admin Section */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Admin
          </h3>
          <div className="space-y-1">
            {adminItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'sidebar-item',
                  pathname === item.href 
                    ? 'sidebar-item-active' 
                    : 'sidebar-item-inactive'
                )}
              >
                <item.icon className="h-4 w-4 mr-3" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* User Profile */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={session?.user?.image || ''} />
            <AvatarFallback>
              {session?.user?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">
              {session?.user?.name}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {session?.user?.email}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
