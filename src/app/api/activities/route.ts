import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createActivitySchema } from '@/lib/validations'
import { z } from 'zod'

// GET /api/activities - List activities
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const type = searchParams.get('type') || undefined
    const contactId = searchParams.get('contactId') || undefined
    const companyId = searchParams.get('companyId') || undefined
    const dealId = searchParams.get('dealId') || undefined
    
    const skip = (page - 1) * limit
    
    // Build where clause
    const where: any = {}
    
    if (type) {
      where.type = type
    }
    
    if (contactId) {
      where.contactId = contactId
    }
    
    if (companyId) {
      where.companyId = companyId
    }
    
    if (dealId) {
      where.dealId = dealId
    }

    // Get total count
    const total = await db.activity.count({ where })

    // Get activities with related data
    const activities = await db.activity.findMany({
      where,
      include: {
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        deal: {
          select: {
            id: true,
            name: true,
            stage: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    })

    return NextResponse.json({
      activities,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching activities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    )
  }
}

// POST /api/activities - Create new activity
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createActivitySchema.parse(body)

    const activity = await db.activity.create({
      data: {
        ...validatedData,
        followUpDate: validatedData.followUpDate ? new Date(validatedData.followUpDate) : null,
      },
      include: {
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        deal: {
          select: {
            id: true,
            name: true,
            stage: true,
          },
        },
      },
    })

    return NextResponse.json(activity, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating activity:', error)
    return NextResponse.json(
      { error: 'Failed to create activity' },
      { status: 500 }
    )
  }
}