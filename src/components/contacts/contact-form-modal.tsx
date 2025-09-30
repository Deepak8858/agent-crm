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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useContacts } from '@/hooks/use-api'
import { toast } from 'sonner'
import { Loader2, Plus } from 'lucide-react'

interface Contact {
  id: string
  firstName: string
  lastName: string
  email?: string
  phoneNumber?: string
  alternatePhone?: string
  status: string
  companyId?: string
  communicationConsent: boolean
  recordingConsent: boolean
}

interface Company {
  id: string
  name: string
}

interface ContactFormModalProps {
  contact?: Contact
  companies?: Company[]
  onContactCreated?: () => void
  onContactUpdated?: () => void
  trigger?: React.ReactNode
}

export function ContactFormModal({
  contact,
  companies = [],
  onContactCreated,
  onContactUpdated,
  trigger,
}: ContactFormModalProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    firstName: contact?.firstName || '',
    lastName: contact?.lastName || '',
    email: contact?.email || '',
    phoneNumber: contact?.phoneNumber || '',
    alternatePhone: contact?.alternatePhone || '',
    status: contact?.status || 'LEAD',
    companyId: contact?.companyId || 'none',
    communicationConsent: contact?.communicationConsent ?? true,
    recordingConsent: contact?.recordingConsent ?? false,
  })

  const { createContact, updateContact, loading } = useContacts()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Convert 'none' back to empty string for API
      const submitData = {
        ...formData,
        companyId: formData.companyId === 'none' ? '' : formData.companyId
      }
      
      if (contact) {
        await updateContact(contact.id, submitData)
        toast.success('Contact updated successfully')
        onContactUpdated?.()
      } else {
        await createContact(submitData)
        toast.success('Contact created successfully')
        onContactCreated?.()
      }
      setOpen(false)
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        alternatePhone: '',
        status: 'LEAD',
        companyId: 'none',
        communicationConsent: true,
        recordingConsent: false,
      })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save contact')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{contact ? 'Edit Contact' : 'Add New Contact'}</DialogTitle>
          <DialogDescription>
            {contact ? 'Update contact information.' : 'Create a new contact in your CRM.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="alternatePhone">Alternate Phone</Label>
            <Input
              id="alternatePhone"
              value={formData.alternatePhone}
              onChange={(e) => setFormData({...formData, alternatePhone: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({...formData, status: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LEAD">Lead</SelectItem>
                  <SelectItem value="PROSPECT">Prospect</SelectItem>
                  <SelectItem value="CUSTOMER">Customer</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="DO_NOT_CONTACT">Do Not Contact</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Select
                value={formData.companyId}
                onValueChange={(value) => setFormData({...formData, companyId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Company</SelectItem>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="communicationConsent"
                checked={formData.communicationConsent}
                onCheckedChange={(checked) => setFormData({...formData, communicationConsent: !!checked})}
              />
              <Label htmlFor="communicationConsent">Communication consent</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="recordingConsent"
                checked={formData.recordingConsent}
                onCheckedChange={(checked) => setFormData({...formData, recordingConsent: !!checked})}
              />
              <Label htmlFor="recordingConsent">Recording consent</Label>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {contact ? 'Update Contact' : 'Create Contact'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}