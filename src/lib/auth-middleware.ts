import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { verifyApiKey, validateScopes } from '@/lib/api-key'

export interface AuthContext {
  authenticated: boolean
  apiKeyId?: string
  scopes?: string[]
  error?: string
}

export async function authenticateApiKey(
  request: NextRequest,
  requiredScopes: string[] = []
): Promise<AuthContext> {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader?.startsWith('Bearer ')) {
      return { 
        authenticated: false, 
        error: 'Missing or invalid authorization header' 
      }
    }

    const apiKey = authHeader.substring(7)
    
    if (!apiKey.startsWith('va_')) {
      return { 
        authenticated: false, 
        error: 'Invalid API key format' 
      }
    }

    // Extract prefix from the key
    const keyParts = apiKey.split('_')
    if (keyParts.length < 3) {
      return { 
        authenticated: false, 
        error: 'Invalid API key format' 
      }
    }
    
    const prefix = `${keyParts[0]}_${keyParts[1]}`

    // Find API key in database by prefix
    const dbApiKey = await db.apiKey.findFirst({
      where: {
        keyPrefix: prefix,
        isActive: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      }
    })

    if (!dbApiKey) {
      return { 
        authenticated: false, 
        error: 'Invalid or expired API key' 
      }
    }

    // Verify the key hash
    const isValid = await verifyApiKey(apiKey, dbApiKey.keyHash)
    
    if (!isValid) {
      return { 
        authenticated: false, 
        error: 'Invalid API key' 
      }
    }

    // Check scopes
    if (requiredScopes.length > 0 && !validateScopes(requiredScopes, dbApiKey.scopes)) {
      return { 
        authenticated: false, 
        error: 'Insufficient permissions' 
      }
    }

    // Update usage statistics
    await db.apiKey.update({
      where: { id: dbApiKey.id },
      data: {
        lastUsedAt: new Date(),
        usageCount: { increment: 1 }
      }
    })

    // Log API usage
    await db.apiKeyUsage.create({
      data: {
        apiKeyId: dbApiKey.id,
        endpoint: request.url,
        method: request.method,
        ipAddress: request.headers.get('x-forwarded-for') || 
                  request.headers.get('x-real-ip') || 
                  'unknown',
        userAgent: request.headers.get('user-agent'),
        success: true,
      }
    })

    return {
      authenticated: true,
      apiKeyId: dbApiKey.id,
      scopes: dbApiKey.scopes,
    }

  } catch (error) {
    console.error('API key authentication error:', error)
    return { 
      authenticated: false, 
      error: 'Authentication failed' 
    }
  }
}