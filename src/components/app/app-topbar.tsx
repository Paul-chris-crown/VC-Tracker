'use client'

import { useState } from 'react'
import { usePathname, useParams } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { 
  Search, 
  Bell, 
  Settings, 
  LogOut, 
  User,
  ChevronRight,
  Command
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/utils/cn'

export function AppTopbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const params = useParams()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const orgSlug = params.org as string

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs = []
    
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i]
      const href = '/' + segments.slice(0, i + 1).join('/')
      
      if (segment === 'app') continue
      if (segment === orgSlug) continue
      
      let label = segment
      if (segment === 'portfolio') label = 'Portfolio'
      if (segment === 'projects') label = 'Projects'
      if (segment === 'admin') label = 'Admin'
      if (segment === 'overview') label = 'Overview'
      if (segment === 'settings') label = 'Settings'
      if (segment === 'my-work') label = 'My Work'
      if (segment === 'search') label = 'Search'
      if (segment === 'notifications') label = 'Notifications'
      
      breadcrumbs.push({ label, href })
    }
    
    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-500">VC Tracker</span>
          {breadcrumbs.map((breadcrumb, index) => (
            <div key={breadcrumb.href} className="flex items-center space-x-2">
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-900">
                {breadcrumb.label}
              </span>
            </div>
          ))}
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="relative"
          >
            <Search className="h-4 w-4" />
            <span className="ml-2 text-sm">Search</span>
            <div className="ml-2 flex items-center space-x-1 text-xs text-gray-500">
              <Command className="h-3 w-3" />
              <span>K</span>
            </div>
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </Button>

          {/* User Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2"
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src={session?.user?.image || ''} />
                <AvatarFallback className="text-xs">
                  {session?.user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{session?.user?.name}</span>
            </Button>

            {isUserMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <div className="py-1">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <div className="text-sm font-medium text-gray-900">
                      {session?.user?.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {session?.user?.email}
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {/* Navigate to profile */}}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {/* Navigate to settings */}}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-red-600 hover:text-red-700"
                    onClick={() => signOut()}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search overlay */}
      {isSearchOpen && (
        <div className="absolute inset-0 bg-white border-b border-gray-200 px-6 py-4 z-20">
          <div className="flex items-center space-x-4">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search tasks, projects, people..."
              className="flex-1 border-0 focus:ring-0 text-lg"
              autoFocus
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSearchOpen(false)}
            >
              Esc
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
