import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createCompanySchema } from '@/lib/validations'
import { z } from 'zod'

// GET /api/companies - List companies
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('q') || undefined
    const industry = searchParams.get('industry') || undefined
    
    const skip = (page - 1) * limit
    
    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { industry: { contains: search, mode: 'insensitive' } },
        { website: { contains: search, mode: 'insensitive' } },
      ]
    }
    
    if (industry) {
      where.industry = { contains: industry, mode: 'insensitive' }
    }

    // Get total count
    const total = await db.company.count({ where })

    // Get companies with contact counts
    const companies = await db.company.findMany({
      where,
      include: {
        _count: {
          select: {
            contacts: true,
            deals: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    })

    return NextResponse.json({
      success: true,
      data: companies,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get companies error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/companies - Create new company
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = createCompanySchema.parse(body)

    const company = await db.company.create({
      data,
      include: {
        _count: {
          select: {
            contacts: true,
            deals: true,
          },
        },
      },
    })

    // Create audit log
    await db.auditLog.create({
      data: {
        actor: 'USER',
        action: 'CREATE_COMPANY',
        entity: 'Company',
        entityId: company.id,
        changes: data,
      },
    })

    return NextResponse.json({
      success: true,
      data: company,
    })
  } catch (error) {
    console.error('Create company error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid company data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}