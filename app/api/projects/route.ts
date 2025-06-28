import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createProjectSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = createProjectSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { contentTypes, ...projectData } = validation.data

    const project = await prisma.project.create({
      data: {
        ...projectData,
        userId: session.user.id,
        // Store content types as metadata for now
        // We can add a separate table later if needed
      },
      include: {
        _count: {
          select: {
            generatedContent: true,
          },
        },
      },
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where: { userId: session.user.id },
        include: {
          generatedContent: {
            take: 3,
            orderBy: { createdAt: 'desc' },
          },
          _count: {
            select: {
              generatedContent: true,
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.project.count({
        where: { userId: session.user.id },
      }),
    ])

    return NextResponse.json({
      projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
