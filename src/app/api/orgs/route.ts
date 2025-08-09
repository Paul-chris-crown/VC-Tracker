import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createOrganizationSchema } from '@/lib/validations'
import { z } from 'zod'
import { Role } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createOrganizationSchema.parse(body)

    // Check if organization slug already exists
    const existingOrg = await prisma.organization.findUnique({
      where: { slug: validatedData.slug },
    })

    if (existingOrg) {
      return NextResponse.json(
        { error: 'Organization slug already exists' },
        { status: 400 }
      )
    }

    // Create organization and membership
    const organization = await prisma.organization.create({
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        memberships: {
          create: {
            userId: session.user.id!,
            role: Role.OWNER,
          },
        },
      },
      include: {
        memberships: {
          include: {
            user: true,
          },
        },
      },
    })

    return NextResponse.json({ data: organization })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating organization:', error)
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
    const slug = searchParams.get('slug')

    if (slug) {
      // Get specific organization by slug
      const organization = await prisma.organization.findUnique({
        where: { slug },
        include: {
          memberships: {
            include: {
              user: true,
            },
          },
        },
      })

      if (!organization) {
        return NextResponse.json(
          { error: 'Organization not found' },
          { status: 404 }
        )
      }

      // Check if user has access to this organization
      const membership = organization.memberships.find(
        (m) => m.userId === session.user!.id
      )

      if (!membership) {
        return NextResponse.json(
          { error: 'Access denied' },
          { status: 403 }
        )
      }

      return NextResponse.json({ data: organization })
    } else {
      // Get user's organizations
      const memberships = await prisma.membership.findMany({
        where: { userId: session.user!.id },
        include: {
          organization: true,
        },
      })

      const organizations = memberships.map((m) => m.organization)
      return NextResponse.json({ data: organizations })
    }
  } catch (error) {
    console.error('Error fetching organizations:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
