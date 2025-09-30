import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { contactSearchSchema, createContactSchema } from '@/lib/validations'
import { z } from 'zod'

// GET /api/contacts - List contacts with search and filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = Object.fromEntries(searchParams.entries())
    
    const {
      q,
      status,
      companyId,
      tags,
      page,
      limit,
      sortBy,
      sortOrder,
    } = contactSearchSchema.parse(query)

    const skip = (page - 1) * limit
    
    // Build where clause
    const where: any = {}
    
    if (q) {
      where.OR = [
        { firstName: { contains: q, mode: 'insensitive' } },
        { lastName: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
        { phoneNumber: { contains: q } },
      ]
    }
    
    if (status) {
      where.status = status
    }
    
    if (companyId) {
      where.companyId = companyId
    }
    
    if (tags && tags.length > 0) {
      where.tags = { hasSome: tags }
    }

    // Get total count
    const total = await db.contact.count({ where })

    // Get contacts
    const contacts = await db.contact.findMany({
      where,
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
    })

    return NextResponse.json({
      success: true,
      data: contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get contacts error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/contacts - Create new contact
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = createContactSchema.parse(body)

    // Check for duplicate email if provided
    if (data.email) {
      const existing = await db.contact.findUnique({
        where: { email: data.email },
      })
      
      if (existing) {
        return NextResponse.json(
          { success: false, error: 'Contact with this email already exists' },
          { status: 409 }
        )
      }
    }

    // Verify company exists if provided
    if (data.companyId) {
      const company = await db.company.findUnique({
        where: { id: data.companyId },
      })
      
      if (!company) {
        return NextResponse.json(
          { success: false, error: 'Company not found' },
          { status: 404 }
        )
      }
    }

    const contact = await db.contact.create({
      data: {
        ...data,
        email: data.email || null,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    // Create audit log
    await db.auditLog.create({
      data: {
        actor: 'USER',
        action: 'CREATE_CONTACT',
        entity: 'Contact',
        entityId: contact.id,
        changes: data,
      },
    })

    return NextResponse.json({
      success: true,
      data: contact,
    })
  } catch (error) {
    console.error('Create contact error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid contact data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}