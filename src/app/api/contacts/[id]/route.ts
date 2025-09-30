import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { updateContactSchema } from '@/lib/validations'
import { z } from 'zod'
import type { PrismaClient } from '@prisma/client'

// GET /api/contacts/[id] - Get single contact
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const contact = await db.contact.findUnique({
      where: { id },
      include: {
        company: true,
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        deals: {
          where: {
            stage: {
              notIn: ['CLOSED_WON', 'CLOSED_LOST'],
            },
          },
        },
        tickets: {
          where: {
            status: {
              notIn: ['CLOSED', 'RESOLVED'],
            },
          },
        },
        consents: true,
      },
    })

    if (!contact) {
      return NextResponse.json(
        { success: false, error: 'Contact not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: contact,
    })
  } catch (error) {
    console.error('Get contact error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/contacts/[id] - Update contact
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const data = updateContactSchema.parse(body)

    // Check if contact exists
    const existingContact = await db.contact.findUnique({
      where: { id },
    })

    if (!existingContact) {
      return NextResponse.json(
        { success: false, error: 'Contact not found' },
        { status: 404 }
      )
    }

    // Check for duplicate email if being updated
    if (data.email && data.email !== existingContact.email) {
      const duplicate = await db.contact.findUnique({
        where: { email: data.email },
      })
      
      if (duplicate) {
        return NextResponse.json(
          { success: false, error: 'Contact with this email already exists' },
          { status: 409 }
        )
      }
    }

    // Verify company exists if being updated
    if (data.companyId && data.companyId !== existingContact.companyId) {
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

    const contact = await db.contact.update({
      where: { id },
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
        action: 'UPDATE_CONTACT',
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
    console.error('Update contact error:', error)
    
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

// DELETE /api/contacts/[id] - Delete contact
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if contact exists
    const contact = await db.contact.findUnique({
      where: { id },
    })

    if (!contact) {
      return NextResponse.json(
        { success: false, error: 'Contact not found' },
        { status: 404 }
      )
    }

    // Delete related records first (due to foreign key constraints)
    await db.$transaction(async (tx: any) => {
      // Delete consents
      await tx.consent.deleteMany({
        where: { contactId: id },
      })

      // Update activities to remove contact association
      await tx.activity.updateMany({
        where: { contactId: id },
        data: { contactId: null },
      })

      // Update deals to remove contact association
      await tx.deal.updateMany({
        where: { contactId: id },
        data: { contactId: null },
      })

      // Update tickets to remove contact association
      await tx.ticket.updateMany({
        where: { contactId: id },
        data: { contactId: null },
      })

      // Delete the contact
      await tx.contact.delete({
        where: { id },
      })
    })

    // Create audit log
    await db.auditLog.create({
      data: {
        actor: 'USER',
        action: 'DELETE_CONTACT',
        entity: 'Contact',
        entityId: id,
        changes: {
          deletedAt: new Date(),
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email,
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Contact deleted successfully',
    })
  } catch (error) {
    console.error('Delete contact error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}