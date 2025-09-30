import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'

const logCallSchema = z.object({
  contactId: z.string(),
  duration: z.number().int().min(0).optional(),
  subject: z.string().min(1, "Subject is required"),
  summary: z.string().optional(),
  details: z.string().optional(),
  outcome: z.string().optional(),
  transcriptUrl: z.string().url().optional(),
  recordingUrl: z.string().url().optional(),
  aiSentiment: z.string().optional(),
  aiIntent: z.string().optional(),
  followUpRequired: z.boolean().default(false),
  followUpDate: z.string().datetime().optional(),
})

export async function POST(request: NextRequest) {
  try {
    // TODO: Add API key authentication middleware
    const body = await request.json()
    const data = logCallSchema.parse(body)

    // Verify contact exists
    const contact = await db.contact.findUnique({
      where: { id: data.contactId },
    })

    if (!contact) {
      return NextResponse.json(
        { success: false, error: 'Contact not found' },
        { status: 404 }
      )
    }

    // Create voice agent call activity
    const activity = await db.activity.create({
      data: {
        type: 'VOICE_AGENT_CALL',
        subject: data.subject,
        summary: data.summary,
        details: data.details,
        duration: data.duration,
        outcome: data.outcome,
        transcriptUrl: data.transcriptUrl,
        recordingUrl: data.recordingUrl,
        aiSentiment: data.aiSentiment,
        aiIntent: data.aiIntent,
        followUpRequired: data.followUpRequired,
        followUpDate: data.followUpDate ? new Date(data.followUpDate) : null,
        contactId: data.contactId,
        companyId: contact.companyId,
        createdBy: 'VOICE_AGENT',
        completedAt: new Date(),
      },
    })

    // Update contact's last interaction date
    await db.contact.update({
      where: { id: data.contactId },
      data: { lastInteractionDate: new Date() },
    })

    // Create audit log
    await db.auditLog.create({
      data: {
        actor: 'VOICE_AGENT',
        action: 'CREATE_ACTIVITY',
        entity: 'Activity',
        entityId: activity.id,
        changes: {
          type: 'VOICE_AGENT_CALL',
          contactId: data.contactId,
          duration: data.duration,
        },
      },
    })

    return NextResponse.json({
      success: true,
      activity: {
        id: activity.id,
        createdAt: activity.createdAt,
      },
    })
  } catch (error) {
    console.error('Log call error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}