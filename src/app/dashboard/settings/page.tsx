import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { db } from '@/lib/db'

async function getApiKeys() {
  try {
    const apiKeys = await db.apiKey.findMany({
      select: {
        id: true,
        name: true,
        keyPrefix: true,
        scopes: true,
        isActive: true,
        lastUsedAt: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return apiKeys
  } catch (error) {
    console.error('Error fetching API keys:', error)
    return []
  }
}

function getScopeColor(scope: string) {
  const colors: Record<string, string> = {
    'contacts:read': 'bg-green-100 text-green-800',
    'contacts:write': 'bg-blue-100 text-blue-800',
    'deals:read': 'bg-purple-100 text-purple-800',
    'deals:write': 'bg-orange-100 text-orange-800',
    'activities:write': 'bg-yellow-100 text-yellow-800',
    'tickets:write': 'bg-red-100 text-red-800',
  }
  return colors[scope] || 'bg-gray-100 text-gray-800'
}

export default async function SettingsPage() {
  const apiKeys = await getApiKeys()

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
            <p className="text-gray-600 mt-2">Configure API keys, integrations, and system preferences</p>
          </div>
          
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        {/* API Key Management */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>API Key Management</CardTitle>
              <CardDescription>Manage API keys for Voice AI Agent integration and external access</CardDescription>
            </div>
            <Button>Generate New API Key</Button>
          </CardHeader>
          <CardContent>
            {apiKeys.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No API keys found</p>
                <Button>Create Your First API Key</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {apiKeys.map((apiKey: any) => (
                  <div key={apiKey.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-gray-900">{apiKey.name}</h3>
                        <div className={`h-3 w-3 rounded-full ${apiKey.isActive ? 'bg-green-400' : 'bg-red-400'}`}></div>
                        <span className={`text-sm ${apiKey.isActive ? 'text-green-600' : 'text-red-600'}`}>
                          {apiKey.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">View Usage</Button>
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">
                          {apiKey.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button variant="destructive" size="sm">Revoke</Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Key Prefix</p>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">{apiKey.keyPrefix}...</code>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Last Used</p>
                        <p className="text-sm text-gray-600">
                          {apiKey.lastUsedAt ? new Date(apiKey.lastUsedAt).toLocaleDateString() : 'Never'}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Created</p>
                        <p className="text-sm text-gray-600">
                          {new Date(apiKey.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">Permissions</p>
                      <div className="flex flex-wrap gap-2">
                        {apiKey.scopes.map((scope: any, index: number) => (
                          <span
                            key={index}
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getScopeColor(scope)}`}
                          >
                            {scope}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Voice AI Integration Settings */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Voice AI Agent Configuration</CardTitle>
            <CardDescription>Configure integration settings for your Voice AI Agent</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Webhook URL
                  </label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://your-voice-agent.com/webhook"
                    defaultValue="https://voice-agent.example.com/webhook"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Webhook Secret
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter webhook secret"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="callLogging">
                    Call Logging
                  </label>
                  <select id="callLogging" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="all">Log All Calls</option>
                    <option value="inbound">Inbound Only</option>
                    <option value="outbound">Outbound Only</option>
                    <option value="none">Disabled</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="autoTickets">
                    Auto-Create Tickets
                  </label>
                  <select id="autoTickets" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="enabled">Enabled</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button variant="outline">Test Connection</Button>
                <Button>Save Configuration</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription>Current system status and version information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">CRM Version</span>
                  <span className="text-sm font-medium">v1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Database Status</span>
                  <div className="flex items-center space-x-1">
                    <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm font-medium text-green-600">Connected</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">API Status</span>
                  <div className="flex items-center space-x-1">
                    <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm font-medium text-green-600">Healthy</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Voice Agent</span>
                  <div className="flex items-center space-x-1">
                    <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm font-medium text-green-600">Connected</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Last Backup</span>
                  <span className="text-sm font-medium">Today, 3:00 AM</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usage Statistics</CardTitle>
              <CardDescription>Current month usage metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">API Requests</span>
                  <span className="text-sm font-medium">12,847</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Voice Calls Logged</span>
                  <span className="text-sm font-medium">1,234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tickets Created</span>
                  <span className="text-sm font-medium">89</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Storage Used</span>
                  <span className="text-sm font-medium">2.4 GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Uptime</span>
                  <span className="text-sm font-medium text-green-600">99.97%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Support and Documentation */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Support & Documentation</CardTitle>
            <CardDescription>Resources and help for using the CRM system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-2">📚</div>
                <h3 className="font-semibold mb-2">API Documentation</h3>
                <p className="text-sm text-gray-600 mb-3">Complete API reference and integration guide</p>
                <Link href="/dashboard/api-docs">
                  <Button variant="outline" size="sm">View Docs</Button>
                </Link>
              </div>
              
              <div className="text-center">
                <div className="text-3xl mb-2">🎥</div>
                <h3 className="font-semibold mb-2">Video Tutorials</h3>
                <p className="text-sm text-gray-600 mb-3">Step-by-step setup and configuration guides</p>
                <Button variant="outline" size="sm">Watch Videos</Button>
              </div>
              
              <div className="text-center">
                <div className="text-3xl mb-2">💬</div>
                <h3 className="font-semibold mb-2">Support Chat</h3>
                <p className="text-sm text-gray-600 mb-3">Get help from our technical support team</p>
                <Button variant="outline" size="sm">Start Chat</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}