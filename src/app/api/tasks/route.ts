import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createTaskSchema, taskFiltersSchema } from '@/lib/validations'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createTaskSchema.parse(body)

    // Check if user has access to the project
    const project = await prisma.project.findUnique({
      where: { id: validatedData.projectId },
      include: {
        organization: {
          include: {
            memberships: {
              where: { userId: session.user.id },
            },
          },
        },
      },
    })

    if (!project || project.organization.memberships.length === 0) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Create task
    const task = await prisma.task.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        status: validatedData.status,
        priority: validatedData.priority,
        points: validatedData.points,
        startDate: validatedData.startDate,
        dueDate: validatedData.dueDate,
        epicId: validatedData.epicId,
        parentTaskId: validatedData.parentTaskId,
        projectId: validatedData.projectId,
        createdById: session.user.id!,
        assignees: validatedData.assigneeIds ? {
          create: validatedData.assigneeIds.map(userId => ({
            userId,
          })),
        } : undefined,
        labels: validatedData.labelIds ? {
          create: validatedData.labelIds.map(labelId => ({
            labelId,
          })),
        } : undefined,
      },
      include: {
        project: true,
        epic: true,
        parentTask: true,
        createdBy: true,
        assignees: {
          include: {
            user: true,
          },
        },
        labels: {
          include: {
            label: true,
          },
        },
        _count: {
          select: {
            subtasks: true,
            comments: true,
            timeEntries: true,
          },
        },
      },
    })

    return NextResponse.json({ data: task })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating task:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const filters = {
      projectId: searchParams.get('projectId'),
      status: searchParams.getAll('status'),
      priority: searchParams.getAll('priority'),
      assigneeIds: searchParams.getAll('assigneeIds'),
      epicId: searchParams.get('epicId'),
      labelIds: searchParams.getAll('labelIds'),
      startDate: searchParams.get('startDate'),
      endDate: searchParams.get('endDate'),
      search: searchParams.get('search'),
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
    }

    // Validate filters
    const validatedFilters = taskFiltersSchema.parse(filters)

    // Check if user has access to the project
    const project = await prisma.project.findUnique({
      where: { id: validatedFilters.projectId },
      include: {
        organization: {
          include: {
            memberships: {
              where: { userId: session.user.id },
            },
          },
        },
      },
    })

    if (!project || project.organization.memberships.length === 0) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Build where clause
    const where: any = {
      projectId: validatedFilters.projectId,
    }

    if (validatedFilters.status && validatedFilters.status.length > 0) {
      where.status = { in: validatedFilters.status }
    }

    if (validatedFilters.priority && validatedFilters.priority.length > 0) {
      where.priority = { in: validatedFilters.priority }
    }

    if (validatedFilters.epicId) {
      where.epicId = validatedFilters.epicId
    }

    if (validatedFilters.assigneeIds && validatedFilters.assigneeIds.length > 0) {
      where.assignees = {
        some: {
          userId: { in: validatedFilters.assigneeIds },
        },
      }
    }

    if (validatedFilters.labelIds && validatedFilters.labelIds.length > 0) {
      where.labels = {
        some: {
          labelId: { in: validatedFilters.labelIds },
        },
      }
    }

    if (validatedFilters.startDate || validatedFilters.endDate) {
      where.OR = []
      if (validatedFilters.startDate) {
        where.OR.push({ startDate: { gte: validatedFilters.startDate } })
      }
      if (validatedFilters.endDate) {
        where.OR.push({ dueDate: { lte: validatedFilters.endDate } })
      }
    }

    if (validatedFilters.search) {
      where.OR = [
        { title: { contains: validatedFilters.search, mode: 'insensitive' } },
        { description: { contains: validatedFilters.search, mode: 'insensitive' } },
      ]
    }

    // Get tasks with pagination
    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        include: {
          project: true,
          epic: true,
          parentTask: true,
          createdBy: true,
          assignees: {
            include: {
              user: true,
            },
          },
          labels: {
            include: {
              label: true,
            },
          },
          _count: {
            select: {
              subtasks: true,
              comments: true,
              timeEntries: true,
            },
          },
        },
        orderBy: { orderIndex: 'asc' },
        skip: (validatedFilters.page - 1) * validatedFilters.limit,
        take: validatedFilters.limit,
      }),
      prisma.task.count({ where }),
    ])

    const totalPages = Math.ceil(total / validatedFilters.limit)

    return NextResponse.json({
      data: tasks,
      pagination: {
        page: validatedFilters.page,
        limit: validatedFilters.limit,
        total,
        totalPages,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
