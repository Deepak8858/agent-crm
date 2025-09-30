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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTickets } from '@/hooks/use-api'
import { toast } from 'sonner'
import { Loader2, Plus } from 'lucide-react'

interface TicketFormModalProps {
  ticket?: any
  contacts?: any[]
  onTicketCreated?: () => void
  onTicketUpdated?: () => void
  trigger?: React.ReactNode
}

export function TicketFormModal({
  ticket,
  contacts = [],
  onTicketCreated,
  onTicketUpdated,
  trigger,
}: TicketFormModalProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    subject: ticket?.subject || '',
    description: ticket?.description || '',
    priority: ticket?.priority || 'MEDIUM',
    category: ticket?.category || '',
    contactId: ticket?.contactId || '',
    status: ticket?.status || 'OPEN',
    assignedTo: ticket?.assignedTo || '',
  })

  const { createTicket, updateTicket, loading } = useTickets()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (ticket) {
        await updateTicket(ticket.id, formData)
        toast.success('Ticket updated successfully')
        onTicketUpdated?.()
      } else {
        await createTicket(formData)
        toast.success('Ticket created successfully')
        onTicketCreated?.()
      }
      setOpen(false)
      if (!ticket) {
        setFormData({
          subject: '',
          description: '',
          priority: 'MEDIUM',
          category: '',
          contactId: '',
          status: 'OPEN',
          assignedTo: '',
        })
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save ticket')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create New Ticket
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{ticket ? 'Edit Ticket' : 'Create New Ticket'}</DialogTitle>
          <DialogDescription>
            {ticket ? 'Update ticket information.' : 'Create a new support ticket.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              required
              placeholder="Brief description of the issue"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={4}
              placeholder="Detailed description of the issue"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({...formData, priority: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                placeholder="e.g., Technical Issue, Billing"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact">Contact</Label>
              <Select
                value={formData.contactId}
                onValueChange={(value) => setFormData({...formData, contactId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select contact" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No Contact</SelectItem>
                  {contacts.map((contact) => (
                    <SelectItem key={contact.id} value={contact.id}>
                      {contact.firstName} {contact.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {ticket && (
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
                    <SelectItem value="OPEN">Open</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {ticket ? 'Update Ticket' : 'Create Ticket'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}