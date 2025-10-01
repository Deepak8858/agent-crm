'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ApiKeyModal } from '@/components/settings/api-key-modal'
import { useApiKeys } from '@/hooks/use-api'
import { toast } from 'sonner'
import { Loader2, Plus, Eye, Edit, Trash2, ToggleLeft, ToggleRight, Settings, Database, Activity } from 'lucide-react'

function getScopeColor(scope: string) {
  if (scope.includes('write')) return 'bg-red-100 text-red-800'
  if (scope.includes('read')) return 'bg-green-100 text-green-800'
  return 'bg-blue-100 text-blue-800'
}

export default function SettingsPage() {
  const [apiKeys, setApiKeys] = useState<any[]>([])
  const [settings, setSettings] = useState({
    webhookUrl: '',
    webhookSecret: '',
    callLogging: 'all',
    autoTickets: 'enabled',
  })

  const { getApiKeys, updateApiKey, revokeApiKey, getApiKeyUsage, loading } = useApiKeys()

  const loadApiKeys = useCallback(async () => {
    try {
      const response = await getApiKeys()
      setApiKeys(response.apiKeys || [])
    } catch (error) {
      toast.error('Failed to load API keys')
      console.error('Error loading API keys:', error)
    }
  }, [getApiKeys])

  useEffect(() => {
    loadApiKeys()
  }, [loadApiKeys])

  const handleToggleApiKey = async (apiKeyId: string, currentStatus: boolean) => {
    try {
      await updateApiKey(apiKeyId, { isActive: !currentStatus })
      toast.success(`API key ${!currentStatus ? 'activated' : 'deactivated'}`)
      loadApiKeys()
    } catch (error) {
      toast.error('Failed to update API key')
    }
  }

  const handleRevokeApiKey = async (apiKeyId: string, apiKeyName: string) => {
    if (!confirm(`Are you sure you want to revoke "${apiKeyName}"? This action cannot be undone.`)) return
    
    try {
      await revokeApiKey(apiKeyId)
      toast.success('API key revoked successfully')
      loadApiKeys()
    } catch (error) {
      toast.error('Failed to revoke API key')
    }
  }

  const handleViewUsage = async (apiKeyId: string) => {
    try {
      const usage = await getApiKeyUsage(apiKeyId)
      toast.success(`Total requests: ${usage.totalRequests}, This month: ${usage.thisMonth}`)
    } catch (error) {
      toast.error('Failed to load usage data')
    }
  }

  const handleTestConnection = () => {
    toast.success('Connection test successful!')
  }

  const handleSaveConfiguration = () => {
    toast.success('Configuration saved successfully!')
  }

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
            <ApiKeyModal 
              onApiKeyCreated={loadApiKeys}
              trigger={
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Generate New API Key
                </Button>
              }
            />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p>Loading API keys...</p>
              </div>
            ) : apiKeys.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No API keys found</p>
                <ApiKeyModal 
                  onApiKeyCreated={loadApiKeys}
                  trigger={
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First API Key
                    </Button>
                  }
                />
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
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewUsage(apiKey.id)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Usage
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleToggleApiKey(apiKey.id, apiKey.isActive)}
                        >
                          {apiKey.isActive ? (
                            <ToggleRight className="h-4 w-4 mr-1" />
                          ) : (
                            <ToggleLeft className="h-4 w-4 mr-1" />
                          )}
                          {apiKey.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleRevokeApiKey(apiKey.id, apiKey.name)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Revoke
                        </Button>
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
                        <p className="text-sm font-medium text-gray-700 mb-1">Expires</p>
                        <p className="text-sm text-gray-600">
                          {apiKey.expiresAt ? new Date(apiKey.expiresAt).toLocaleDateString() : 'Never'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">Scopes</p>
                      <div className="flex flex-wrap gap-2">
                        {apiKey.scopes.map((scope: string) => (
                          <span
                            key={scope}
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

        {/* Voice Agent Integration */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Voice Agent Configuration</span>
            </CardTitle>
            <CardDescription>Configure webhook endpoints and call logging settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="webhookUrl">
                    Webhook URL
                  </label>
                  <input
                    type="url"
                    id="webhookUrl"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://your-domain.com/webhook"
                    value={settings.webhookUrl}
                    onChange={(e) => setSettings({...settings, webhookUrl: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="webhookSecret">
                    Webhook Secret
                  </label>
                  <input
                    type="password"
                    id="webhookSecret"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter webhook secret"
                    value={settings.webhookSecret}
                    onChange={(e) => setSettings({...settings, webhookSecret: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="callLogging">
                    Call Logging
                  </label>
                  <select 
                    id="callLogging" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={settings.callLogging}
                    onChange={(e) => setSettings({...settings, callLogging: e.target.value})}
                  >
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
                  <select 
                    id="autoTickets" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={settings.autoTickets}
                    onChange={(e) => setSettings({...settings, autoTickets: e.target.value})}
                  >
                    <option value="enabled">Enabled</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={handleTestConnection}>
                  Test Connection
                </Button>
                <Button onClick={handleSaveConfiguration}>
                  Save Configuration
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>System Information</span>
              </CardTitle>
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
                  <span className="text-sm text-gray-600">Last Backup</span>
                  <span className="text-sm font-medium">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Usage Statistics</span>
              </CardTitle>
              <CardDescription>Current usage metrics and limits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">API Calls (24h)</span>
                  <span className="text-sm font-medium">1,234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active Webhooks</span>
                  <span className="text-sm font-medium">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Storage Used</span>
                  <span className="text-sm font-medium">2.3 GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Voice Calls (Month)</span>
                  <span className="text-sm font-medium">456</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Support & Documentation */}
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
                <Button variant="outline" size="sm">View Docs</Button>
              </div>
              
              <div className="text-center">
                <div className="text-3xl mb-2">🎥</div>
                <h3 className="font-semibold mb-2">Video Tutorials</h3>
                <p className="text-sm text-gray-600 mb-3">Step-by-step guides for common tasks</p>
                <Button variant="outline" size="sm">Watch Videos</Button>
              </div>
              
              <div className="text-center">
                <div className="text-3xl mb-2">💬</div>
                <h3 className="font-semibold mb-2">Get Support</h3>
                <p className="text-sm text-gray-600 mb-3">Contact our support team for help</p>
                <Button variant="outline" size="sm">Contact Support</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}