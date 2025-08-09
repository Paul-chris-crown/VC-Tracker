import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createProjectSchema } from '@/lib/validations'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createProjectSchema.parse(body)

    // Get user's organization membership
    const membership = await prisma.membership.findFirst({
      where: {
        userId: session.user.id,
        organizationId: validatedData.organizationId,
      },
    })

    if (!membership) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Check if project key already exists in organization
    const existingProject = await prisma.project.findFirst({
      where: {
        organizationId: validatedData.organizationId,
        key: validatedData.key,
      },
    })

    if (existingProject) {
      return NextResponse.json(
        { error: 'Project key already exists in this organization' },
        { status: 400 }
      )
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        name: validatedData.name,
        key: validatedData.key,
        description: validatedData.description,
        leadId: validatedData.leadId,
        startDate: validatedData.startDate,
        dueDate: validatedData.dueDate,
        status: validatedData.status,
        priority: validatedData.priority,
        budgetCents: validatedData.budgetCents || 0,
        organizationId: validatedData.organizationId,
      },
      include: {
        organization: true,
        lead: true,
        _count: {
          select: {
            tasks: true,
            epics: true,
          },
        },
      },
    })

    return NextResponse.json({ data: project })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating project:', error)
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
    const orgId = searchParams.get('orgId')

    if (!orgId) {
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 400 }
      )
    }

    // Check if user has access to this organization
    const membership = await prisma.membership.findFirst({
      where: {
        userId: session.user.id,
        organizationId: orgId,
      },
    })

    if (!membership) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Get projects for organization
    const projects = await prisma.project.findMany({
      where: { organizationId: orgId },
      include: {
        lead: true,
        _count: {
          select: {
            tasks: true,
            epics: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ data: projects })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
