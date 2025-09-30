import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'

const createTicketSchema = z.object({
  contactId: z.string().optional(),
  subject: z.string().min(1, "Subject is required"),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  category: z.string().optional(),
  voiceSummary: z.string().optional(),
  aiTags: z.array(z.string()).default([]),
})

export async function POST(request: NextRequest) {
  try {
    // TODO: Add API key authentication middleware
    const body = await request.json()
    const data = createTicketSchema.parse(body)

    // Verify contact exists if provided
    if (data.contactId) {
      const contact = await db.contact.findUnique({
        where: { id: data.contactId },
      })

      if (!contact) {
        return NextResponse.json(
          { success: false, error: 'Contact not found' },
          { status: 404 }
        )
      }
    }

    // Create support ticket
    const ticket = await db.ticket.create({
      data: {
        subject: data.subject,
        description: data.description,
        priority: data.priority,
        category: data.category,
        contactId: data.contactId,
        voiceSummary: data.voiceSummary,
        aiTags: data.aiTags,
        status: 'OPEN',
      },
    })

    // Create audit log
    await db.auditLog.create({
      data: {
        actor: 'VOICE_AGENT',
        action: 'CREATE_TICKET',
        entity: 'Ticket',
        entityId: ticket.id,
        changes: {
          subject: data.subject,
          priority: data.priority,
          contactId: data.contactId,
        },
      },
    })

    return NextResponse.json({
      success: true,
      ticket: {
        id: ticket.id,
        subject: ticket.subject,
        status: ticket.status,
        priority: ticket.priority,
        createdAt: ticket.createdAt,
      },
    })
  } catch (error) {
    console.error('Create ticket error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}