import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'

const lookupContactSchema = z.object({
  phone: z.string().optional(),
  email: z.string().email().optional(),
}).refine(data => data.phone || data.email, {
  message: "Either phone or email must be provided",
})

export async function POST(request: NextRequest) {
  try {
    // TODO: Add API key authentication middleware
    const body = await request.json()
    const { phone, email } = lookupContactSchema.parse(body)

    // Find contact by phone or email
    const contact = await db.contact.findFirst({
      where: {
        OR: [
          ...(phone ? [{ phoneNumber: phone }, { alternatePhone: phone }] : []),
          ...(email ? [{ email }] : []),
        ],
      },
      include: {
        company: true,
        deals: {
          where: {
            stage: {
              notIn: ['CLOSED_WON', 'CLOSED_LOST']
            }
          }
        },
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    })

    return NextResponse.json({
      success: true,
      contact,
      found: !!contact,
    })
  } catch (error) {
    console.error('Contact lookup error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}