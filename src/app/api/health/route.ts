import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    database: 'connected', // TODO: Add actual database health check
    services: {
      api: 'operational',
      voice_agent: 'operational',
    },
  })
}