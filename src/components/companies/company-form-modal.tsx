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
import { Textarea } from '@/components/ui/textarea'
import { useCompanies } from '@/hooks/use-api'
import { toast } from 'sonner'
import { Loader2, Plus } from 'lucide-react'

interface CompanyFormModalProps {
  company?: any
  onCompanyCreated?: () => void
  onCompanyUpdated?: () => void
  trigger?: React.ReactNode
}

export function CompanyFormModal({
  company,
  onCompanyCreated,
  onCompanyUpdated,
  trigger,
}: CompanyFormModalProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: company?.name || '',
    industry: company?.industry || '',
    website: company?.website || '',
    phoneNumber: company?.phoneNumber || '',
    address: company?.address || '',
    healthScore: company?.healthScore || 50,
  })

  const { createCompany, updateCompany, loading } = useCompanies()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (company) {
        await updateCompany(company.id, formData)
        toast.success('Company updated successfully')
        onCompanyUpdated?.()
      } else {
        await createCompany(formData)
        toast.success('Company created successfully')
        onCompanyCreated?.()
      }
      setOpen(false)
      if (!company) {
        setFormData({
          name: '',
          industry: '',
          website: '',
          phoneNumber: '',
          address: '',
          healthScore: 50,
        })
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save company')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Company
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{company ? 'Edit Company' : 'Add New Company'}</DialogTitle>
          <DialogDescription>
            {company ? 'Update company information.' : 'Create a new company in your CRM.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Company Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                value={formData.industry}
                onChange={(e) => setFormData({...formData, industry: e.target.value})}
                placeholder="e.g., Technology, Healthcare"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({...formData, website: e.target.value})}
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="healthScore">Health Score (0-100)</Label>
              <Input
                id="healthScore"
                type="number"
                min="0"
                max="100"
                value={formData.healthScore}
                onChange={(e) => setFormData({...formData, healthScore: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              rows={3}
              placeholder="Company address"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {company ? 'Update Company' : 'Create Company'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}