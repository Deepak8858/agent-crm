import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createApiKeySchema } from '@/lib/validations'
import { z } from 'zod'
import { randomBytes } from 'crypto'
import bcrypt from 'bcryptjs'

// GET /api/api-keys - List API keys
export async function GET(request: NextRequest) {
  try {
    const apiKeys = await db.apiKey.findMany({
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
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ apiKeys })
  } catch (error) {
    console.error('Error fetching API keys:', error)
    return NextResponse.json(
      { error: 'Failed to fetch API keys' },
      { status: 500 }
    )
  }
}

// POST /api/api-keys - Create new API key
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createApiKeySchema.parse(body)

    // Generate API key
    const keyValue = `ak_${randomBytes(32).toString('hex')}`
    const keyHash = await bcrypt.hash(keyValue, 12)
    const keyPrefix = keyValue.substring(0, 12)

    const apiKey = await db.apiKey.create({
      data: {
        name: validatedData.name,
        keyHash,
        keyPrefix,
        scopes: validatedData.scopes,
        expiresAt: validatedData.expiresAt ? new Date(validatedData.expiresAt) : null,
        createdBy: 'system', // In a real app, this would be the current user ID from auth
      },
      select: {
        id: true,
        name: true,
        keyPrefix: true,
        scopes: true,
        isActive: true,
        expiresAt: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      apiKey,
      keyValue, // Only returned once during creation
      message: 'API key created successfully. Please save it securely as it will not be shown again.',
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating API key:', error)
    return NextResponse.json(
      { error: 'Failed to create API key' },
      { status: 500 }
    )
  }
}