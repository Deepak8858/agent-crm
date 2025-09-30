import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">API Documentation</h1>
            <p className="text-gray-600 mt-2">Voice AI Agent Integration Endpoints</p>
          </div>
          
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>

        {/* Authentication */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Authentication</CardTitle>
            <CardDescription>All API endpoints require authentication using API keys</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-4">
              <code>Authorization: Bearer va_your_api_key_here</code>
            </div>
            <p className="text-sm text-gray-600">
              API keys can be generated and managed in the dashboard settings. Each key has specific scopes that determine 
              which endpoints can be accessed.
            </p>
          </CardContent>
        </Card>

        {/* Base URL */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Base URL</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
              <code>https://your-domain.com/api/agent/</code>
            </div>
          </CardContent>
        </Card>

        {/* Endpoints */}
        <div className="grid gap-8">
          
          {/* Contact Lookup */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono">POST</span>
                <span>/lookup-contact</span>
              </CardTitle>
              <CardDescription>Find a contact by phone number or email address</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Required Scopes</h4>
                  <span className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">contacts:read</span>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Request Body</h4>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "phone": "+1234567890",     // Optional
  "email": "contact@example.com"  // Optional
}

// Note: Either phone or email must be provided`}</pre>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Response</h4>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "success": true,
  "contact": {
    "id": "contact_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "+1234567890",
    "status": "PROSPECT",
    "company": {
      "id": "company_id",
      "name": "Acme Corp"
    },
    "deals": [...],
    "activities": [...]
  },
  "found": true
}`}</pre>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Log Call */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono">POST</span>
                <span>/log-call</span>
              </CardTitle>
              <CardDescription>Log a voice agent call activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Required Scopes</h4>
                  <span className="bg-gray-100 px-2 py-1 rounded text-sm font-mono mr-2">activities:write</span>
                  <span className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">contacts:write</span>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Request Body</h4>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "contactId": "contact_id",
  "subject": "Discovery Call - Enterprise Requirements",
  "duration": 1800,           // Duration in seconds
  "summary": "Call summary...",
  "details": "Detailed notes...",
  "outcome": "qualified",
  "transcriptUrl": "https://...",  // Optional
  "recordingUrl": "https://...",   // Optional
  "aiSentiment": "positive",       // Optional
  "aiIntent": "purchase_intent",   // Optional
  "followUpRequired": true,        // Optional
  "followUpDate": "2024-10-01T10:00:00Z"  // Optional
}`}</pre>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Response</h4>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "success": true,
  "activity": {
    "id": "activity_id",
    "createdAt": "2024-09-28T10:30:00Z"
  }
}`}</pre>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Create Ticket */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono">POST</span>
                <span>/create-ticket</span>
              </CardTitle>
              <CardDescription>Create a support ticket from a voice interaction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Required Scopes</h4>
                  <span className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">tickets:write</span>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Request Body</h4>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "contactId": "contact_id",      // Optional
  "subject": "Technical Issue",
  "description": "Issue description...",
  "priority": "HIGH",             // LOW, MEDIUM, HIGH, URGENT
  "category": "Technical",        // Optional
  "voiceSummary": "Voice call summary...",
  "aiTags": ["sso", "integration", "urgent"]
}`}</pre>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Response</h4>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "success": true,
  "ticket": {
    "id": "ticket_id",
    "subject": "Technical Issue",
    "status": "OPEN",
    "priority": "HIGH",
    "createdAt": "2024-09-28T10:30:00Z"
  }
}`}</pre>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Health Check */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-mono">GET</span>
                <span>/health</span>
              </CardTitle>
              <CardDescription>Check API health status (no authentication required)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Response</h4>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "status": "healthy",
  "timestamp": "2024-09-28T10:30:00Z",
  "version": "1.0.0",
  "database": "connected",
  "services": {
    "api": "operational",
    "voice_agent": "operational"
  }
}`}</pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Responses */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Error Responses</CardTitle>
            <CardDescription>Standard error response format</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Authentication Error (401)</h4>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "success": false,
  "error": "Invalid or expired API key"
}`}</pre>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Validation Error (400)</h4>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "success": false,
  "error": "Invalid request data",
  "details": [
    {
      "field": "subject",
      "message": "Subject is required"
    }
  ]
}`}</pre>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Not Found Error (404)</h4>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "success": false,
  "error": "Contact not found"
}`}</pre>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rate Limiting */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Rate Limiting</CardTitle>
            <CardDescription>API usage limits and best practices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Limits</h4>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>1000 requests per hour per API key</li>
                  <li>100 requests per minute per API key</li>
                  <li>Rate limits are enforced per endpoint</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Headers</h4>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200`}</pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}