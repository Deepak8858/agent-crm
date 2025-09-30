'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useApiKeys } from '@/hooks/use-api'
import { toast } from 'sonner'
import { Loader2, Plus, Copy, Eye, EyeOff } from 'lucide-react'

interface ApiKeyModalProps {
  onApiKeyCreated?: () => void
  trigger?: React.ReactNode
}

const AVAILABLE_SCOPES = [
  { id: 'contacts:read', label: 'Read Contacts', description: 'View contact information' },
  { id: 'contacts:write', label: 'Write Contacts', description: 'Create and update contacts' },
  { id: 'companies:read', label: 'Read Companies', description: 'View company information' },
  { id: 'companies:write', label: 'Write Companies', description: 'Create and update companies' },
  { id: 'deals:read', label: 'Read Deals', description: 'View deal information' },
  { id: 'deals:write', label: 'Write Deals', description: 'Create and update deals' },
  { id: 'activities:read', label: 'Read Activities', description: 'View activity logs' },
  { id: 'activities:write', label: 'Write Activities', description: 'Create activity logs' },
  { id: 'tickets:read', label: 'Read Tickets', description: 'View support tickets' },
  { id: 'tickets:write', label: 'Write Tickets', description: 'Create and update tickets' },
]

export function ApiKeyModal({ onApiKeyCreated, trigger }: ApiKeyModalProps) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1) // 1: form, 2: show key
  const [formData, setFormData] = useState({
    name: '',
    scopes: [] as string[],
    expiresAt: '',
  })
  const [createdApiKey, setCreatedApiKey] = useState<any>(null)
  const [showKey, setShowKey] = useState(false)
  
  const { createApiKey, loading } = useApiKeys()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.scopes.length === 0) {
      toast.error('Please select at least one scope')
      return
    }
    
    try {
      const result = await createApiKey(formData)
      setCreatedApiKey(result)
      setStep(2)
      onApiKeyCreated?.()
      toast.success('API key created successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create API key')
    }
  }

  const handleClose = () => {
    setOpen(false)
    setTimeout(() => {
      setStep(1)
      setCreatedApiKey(null)
      setFormData({ name: '', scopes: [], expiresAt: '' })
      setShowKey(false)
    }, 200)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('API key copied to clipboard')
  }

  const toggleScope = (scopeId: string) => {
    setFormData(prev => ({
      ...prev,
      scopes: prev.scopes.includes(scopeId)
        ? prev.scopes.filter(s => s !== scopeId)
        : [...prev.scopes, scopeId]
    }))
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Generate New API Key
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        {step === 1 ? (
          <>
            <DialogHeader>
              <DialogTitle>Generate New API Key</DialogTitle>
              <DialogDescription>
                Create a new API key for Voice AI Agent integration or external access.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">API Key Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Voice Agent Production"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiresAt">Expires At (Optional)</Label>
                <Input
                  id="expiresAt"
                  type="datetime-local"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({...formData, expiresAt: e.target.value})}
                />
              </div>

              <div className="space-y-3">
                <Label>Permissions *</Label>
                <div className="space-y-3 max-h-64 overflow-y-auto border rounded-md p-3">
                  {AVAILABLE_SCOPES.map((scope) => (
                    <div key={scope.id} className="flex items-start space-x-3">
                      <Checkbox
                        id={scope.id}
                        checked={formData.scopes.includes(scope.id)}
                        onCheckedChange={() => toggleScope(scope.id)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor={scope.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {scope.label}
                        </label>
                        <p className="text-xs text-muted-foreground">
                          {scope.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Generate API Key
                </Button>
              </div>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>API Key Created Successfully</DialogTitle>
              <DialogDescription>
                Your API key has been created. Please copy it now as it won&apos;t be shown again.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>API Key</Label>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 relative">
                    <Input
                      type={showKey ? 'text' : 'password'}
                      value={createdApiKey.keyValue}
                      readOnly
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 h-7 w-7 p-0"
                      onClick={() => setShowKey(!showKey)}
                    >
                      {showKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => copyToClipboard(createdApiKey.keyValue)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> This is the only time you&apos;ll see this API key. 
                  Make sure to copy it and store it securely.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Key Details</Label>
                <div className="bg-gray-50 rounded-md p-3 space-y-1">
                  <p className="text-sm"><strong>Name:</strong> {createdApiKey.apiKey.name}</p>
                  <p className="text-sm"><strong>Prefix:</strong> {createdApiKey.apiKey.keyPrefix}...</p>
                  <p className="text-sm"><strong>Scopes:</strong> {createdApiKey.apiKey.scopes.join(', ')}</p>
                  {createdApiKey.apiKey.expiresAt && (
                    <p className="text-sm">
                      <strong>Expires:</strong> {new Date(createdApiKey.apiKey.expiresAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button onClick={handleClose}>Done</Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}