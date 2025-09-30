import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PUT /api/api-keys/[id] - Update API key (activate/deactivate)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { isActive, name, scopes } = body

    const apiKey = await db.apiKey.update({
      where: { id },
      data: {
        isActive,
        name,
        scopes,
      },
      select: {
        id: true,
        name: true,
        keyPrefix: true,
        scopes: true,
        isActive: true,
        lastUsedAt: true,
        expiresAt: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json(apiKey)
  } catch (error) {
    console.error('Error updating API key:', error)
    return NextResponse.json(
      { error: 'Failed to update API key' },
      { status: 500 }
    )
  }
}

// DELETE /api/api-keys/[id] - Revoke API key
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.apiKey.delete({
      where: { id },
    })

    return NextResponse.json(
      { message: 'API key revoked successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error revoking API key:', error)
    return NextResponse.json(
      { error: 'Failed to revoke API key' },
      { status: 500 }
    )
  }
}

// GET /api/api-keys/[id]/usage - Get API key usage stats
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const apiKey = await db.apiKey.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        keyPrefix: true,
        lastUsedAt: true,
        createdAt: true,
        // Add usage tracking if needed
      },
    })

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not found' },
        { status: 404 }
      )
    }

    // Mock usage data - in a real app, you'd track this in the database
    const usageData = {
      totalRequests: Math.floor(Math.random() * 1000) + 100,
      thisMonth: Math.floor(Math.random() * 200) + 50,
      lastWeek: Math.floor(Math.random() * 50) + 10,
      apiKey,
    }

    return NextResponse.json(usageData)
  } catch (error) {
    console.error('Error fetching API key usage:', error)
    return NextResponse.json(
      { error: 'Failed to fetch usage data' },
      { status: 500 }
    )
  }
}