'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useDeals } from '@/hooks/use-api'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface DealFormModalProps {
  deal?: any
  contacts: any[]
  companies: any[]
  onDealCreated?: () => void
  onDealUpdated?: () => void
  trigger: React.ReactNode
}

export function DealFormModal({ 
  deal, 
  contacts, 
  companies,
  onDealCreated, 
  onDealUpdated, 
  trigger 
}: DealFormModalProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: deal?.title || '',
    description: deal?.description || '',
    value: deal?.value || '',
    stage: deal?.stage || 'LEAD',
    contactId: deal?.contactId || '',
    companyId: deal?.companyId || '',
    closeDate: deal?.closeDate ? new Date(deal.closeDate).toISOString().slice(0, 10) : '',
  })

  const { createDeal, updateDeal, loading } = useDeals()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error('Title is required')
      return
    }

    try {
      const data = {
        ...formData,
        value: formData.value ? parseFloat(formData.value) : 0,
        closeDate: formData.closeDate ? new Date(formData.closeDate).toISOString() : null,
        contactId: formData.contactId || null,
        companyId: formData.companyId || null,
      }

      if (deal) {
        await updateDeal(deal.id, data)
        toast.success('Deal updated successfully')
        onDealUpdated?.()
      } else {
        await createDeal(data)
        toast.success('Deal created successfully')
        onDealCreated?.()
      }
      
      setOpen(false)
      setFormData({
        title: '',
        description: '',
        value: '',
        stage: 'LEAD',
        contactId: '',
        companyId: '',
        closeDate: '',
      })
    } catch (error) {
      toast.error(deal ? 'Failed to update deal' : 'Failed to create deal')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{deal ? 'Edit Deal' : 'Create New Deal'}</DialogTitle>
          <DialogDescription>
            {deal ? 'Update the deal details below.' : 'Fill in the details to create a new deal.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Deal Title</Label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Deal title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Deal description"
              className="min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="value">Deal Value</Label>
              <input
                id="value"
                type="number"
                step="0.01"
                min="0"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stage">Stage</Label>
              <Select
                value={formData.stage}
                onValueChange={(value) => setFormData({ ...formData, stage: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LEAD">Lead</SelectItem>
                  <SelectItem value="QUALIFIED">Qualified</SelectItem>
                  <SelectItem value="PROPOSAL">Proposal</SelectItem>
                  <SelectItem value="NEGOTIATION">Negotiation</SelectItem>
                  <SelectItem value="CLOSED_WON">Closed Won</SelectItem>
                  <SelectItem value="CLOSED_LOST">Closed Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactId">Contact</Label>
            <Select
              value={formData.contactId}
              onValueChange={(value) => setFormData({ ...formData, contactId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select contact (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No contact</SelectItem>
                {contacts.map((contact) => (
                  <SelectItem key={contact.id} value={contact.id}>
                    {contact.firstName} {contact.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyId">Company</Label>
            <Select
              value={formData.companyId}
              onValueChange={(value) => setFormData({ ...formData, companyId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select company (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No company</SelectItem>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="closeDate">Expected Close Date</Label>
            <input
              id="closeDate"
              type="date"
              value={formData.closeDate}
              onChange={(e) => setFormData({ ...formData, closeDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Expected close date"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {deal ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                deal ? 'Update Deal' : 'Create Deal'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}