import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'

export function generateApiKey(): { key: string; prefix: string } {
  const prefix = 'va_' + randomBytes(4).toString('hex')
  const secret = randomBytes(32).toString('hex')
  const key = prefix + '_' + secret
  
  return { key, prefix }
}

export async function hashApiKey(key: string): Promise<string> {
  return bcrypt.hash(key, 12)
}

export async function verifyApiKey(key: string, hash: string): Promise<boolean> {
  return bcrypt.compare(key, hash)
}

export function validateScopes(required: string[], available: string[]): boolean {
  return required.every(scope => available.includes(scope))
}

export const API_SCOPES = {
  // Contact operations
  'contacts:read': 'Read contact information',
  'contacts:write': 'Create and update contacts',
  'contacts:delete': 'Delete contacts',
  
  // Activity operations
  'activities:read': 'Read activity logs',
  'activities:write': 'Create activity logs',
  
  // Deal operations
  'deals:read': 'Read deal information',
  'deals:write': 'Update deal stages and information',
  
  // Ticket operations
  'tickets:read': 'Read support tickets',
  'tickets:write': 'Create and update support tickets',
  
  // Company operations
  'companies:read': 'Read company information',
  'companies:write': 'Update company information',
  
  // Admin operations
  'admin:read': 'Read administrative data',
  'admin:write': 'Perform administrative actions',
} as const

export type ApiScope = keyof typeof API_SCOPES