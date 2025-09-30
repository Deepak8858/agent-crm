import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createDealSchema } from '@/lib/validations'
import { z } from 'zod'

// GET /api/deals - List deals
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const stage = searchParams.get('stage') || undefined
    const contactId = searchParams.get('contactId') || undefined
    const companyId = searchParams.get('companyId') || undefined
    
    const skip = (page - 1) * limit
    
    // Build where clause
    const where: any = {}
    
    if (stage) {
      where.stage = stage
    }
    
    if (contactId) {
      where.contactId = contactId
    }
    
    if (companyId) {
      where.companyId = companyId
    }

    // Get total count
    const total = await db.deal.count({ where })

    // Get deals with related data
    const deals = await db.deal.findMany({
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
        activities: {
          select: {
            id: true,
            type: true,
            subject: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 3,
        },
      },
      orderBy: { updatedAt: 'desc' },
      skip,
      take: limit,
    })

    return NextResponse.json({
      deals,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching deals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch deals' },
      { status: 500 }
    )
  }
}

// POST /api/deals - Create new deal
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createDealSchema.parse(body)

    const deal = await db.deal.create({
      data: {
        ...validatedData,
        closeDate: validatedData.closeDate ? new Date(validatedData.closeDate) : null,
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
      },
    })

    return NextResponse.json(deal, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating deal:', error)
    return NextResponse.json(
      { error: 'Failed to create deal' },
      { status: 500 }
    )
  }
}