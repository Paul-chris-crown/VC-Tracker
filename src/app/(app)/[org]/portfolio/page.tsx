'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  Plus, 
  Calendar, 
  Users, 
  Clock, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock as ClockIcon
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'
import { PriorityBadge } from '@/components/ui/priority-badge'
import { Badge } from '@/components/ui/badge'
import { Status, Priority } from '@prisma/client'

// Mock data - would come from API
const mockProjects = [
  {
    id: '1',
    name: 'Website Redesign',
    key: 'WR',
    description: 'Complete redesign of the company website with modern UI/UX',
    status: Status.IN_PROGRESS,
    priority: Priority.HIGH,
    progress: 65,
    dueDate: '2024-02-15',
    lead: { name: 'John Doe', image: '' },
    assignees: [
      { name: 'Jane Smith', image: '' },
      { name: 'Mike Johnson', image: '' }
    ],
    tasks: { total: 24, completed: 16 },
    budget: { spent: 15000, total: 25000 }
  },
  {
    id: '2',
    name: 'Mobile App Development',
    key: 'MAD',
    description: 'iOS and Android app for customer engagement',
    status: Status.TODO,
    priority: Priority.URGENT,
    progress: 0,
    dueDate: '2024-03-30',
    lead: { name: 'Sarah Wilson', image: '' },
    assignees: [
      { name: 'Alex Brown', image: '' }
    ],
    tasks: { total: 45, completed: 0 },
    budget: { spent: 0, total: 50000 }
  },
  {
    id: '3',
    name: 'Database Migration',
    key: 'DM',
    description: 'Migrate legacy database to cloud infrastructure',
    status: Status.DONE,
    priority: Priority.MEDIUM,
    progress: 100,
    dueDate: '2024-01-20',
    lead: { name: 'David Chen', image: '' },
    assignees: [
      { name: 'David Chen', image: '' },
      { name: 'Lisa Wang', image: '' }
    ],
    tasks: { total: 12, completed: 12 },
    budget: { spent: 8000, total: 10000 }
  }
]

const mockStats = {
  totalProjects: 8,
  activeProjects: 5,
  completedProjects: 3,
  overdueProjects: 1,
  totalTasks: 156,
  completedTasks: 89,
  totalBudget: 125000,
  spentBudget: 78000,
  teamMembers: 12
}

export default function PortfolioPage() {
  const params = useParams()
  const orgSlug = params.org as string

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Portfolio</h1>
          <p className="text-gray-600">Overview of all projects in your organization</p>
        </div>
        <Link href={`/app/${orgSlug}/projects/new`}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              {mockStats.activeProjects} active, {mockStats.completedProjects} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              {mockStats.completedTasks} completed ({Math.round(mockStats.completedTasks / mockStats.totalTasks * 100)}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mockStats.spentBudget.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              of ${mockStats.totalBudget.toLocaleString()} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.teamMembers}</div>
            <p className="text-xs text-muted-foreground">
              active members
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
          <Link href={`/app/${orgSlug}/projects`}>
            <Button variant="ghost" size="sm">
              View all projects
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-sm">{project.key}</span>
                      </div>
                      <div>
                        <CardTitle className="text-base">{project.name}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <StatusBadge status={project.status} />
                          <PriorityBadge priority={project.priority} />
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-sm">
                      {project.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Tasks</div>
                    <div className="font-medium">
                      {project.tasks.completed}/{project.tasks.total}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Budget</div>
                    <div className="font-medium">
                      ${project.budget.spent.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Team */}
                <div>
                  <div className="text-gray-600 text-sm mb-2">Team</div>
                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-2">
                      {project.assignees.slice(0, 3).map((assignee, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium"
                        >
                          {assignee.name.charAt(0)}
                        </div>
                      ))}
                    </div>
                    {project.assignees.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{project.assignees.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Due Date */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Due {new Date(project.dueDate).toLocaleDateString()}</span>
                  </div>
                  {new Date(project.dueDate) < new Date() && (
                    <Badge variant="destructive" className="text-xs">
                      Overdue
                    </Badge>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Link href={`/app/${orgSlug}/projects/${project.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      View Project
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
