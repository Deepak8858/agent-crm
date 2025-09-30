'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useActivities } from '@/hooks/use-api'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface ActivityFormModalProps {
  activity?: any
  contacts: any[]
  deals?: any[]
  onActivityCreated?: () => void
  onActivityUpdated?: () => void
  trigger: React.ReactNode
}

export function ActivityFormModal({ 
  activity, 
  contacts, 
  deals = [],
  onActivityCreated, 
  onActivityUpdated, 
  trigger 
}: ActivityFormModalProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: activity?.title || '',
    description: activity?.description || '',
    type: activity?.type || 'CALL',
    status: activity?.status || 'SCHEDULED',
    contactId: activity?.contactId || '',
    dealId: activity?.dealId || '',
    dueDate: activity?.dueDate ? new Date(activity.dueDate).toISOString().slice(0, 16) : '',
    outcome: activity?.outcome || '',
  })

  const { createActivity, updateActivity, loading } = useActivities()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error('Title is required')
      return
    }

    try {
      const data = {
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
        contactId: formData.contactId || null,
        dealId: formData.dealId || null,
      }

      if (activity) {
        await updateActivity(activity.id, data)
        toast.success('Activity updated successfully')
        onActivityUpdated?.()
      } else {
        await createActivity(data)
        toast.success('Activity created successfully')
        onActivityCreated?.()
      }
      
      setOpen(false)
      setFormData({
        title: '',
        description: '',
        type: 'CALL',
        status: 'SCHEDULED',
        contactId: '',
        dealId: '',
        dueDate: '',
        outcome: '',
      })
    } catch (error) {
      toast.error(activity ? 'Failed to update activity' : 'Failed to create activity')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{activity ? 'Edit Activity' : 'Create New Activity'}</DialogTitle>
          <DialogDescription>
            {activity ? 'Update the activity details below.' : 'Fill in the details to create a new activity.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Activity title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Activity description"
              className="min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CALL">Call</SelectItem>
                  <SelectItem value="EMAIL">Email</SelectItem>
                  <SelectItem value="MEETING">Meeting</SelectItem>
                  <SelectItem value="NOTE">Note</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
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

          {deals.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="dealId">Deal</Label>
              <Select
                value={formData.dealId}
                onValueChange={(value) => setFormData({ ...formData, dealId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select deal (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No deal</SelectItem>
                  {deals.map((deal) => (
                    <SelectItem key={deal.id} value={deal.id}>
                      {deal.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <input
              id="dueDate"
              type="datetime-local"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Due date and time"
            />
          </div>

          {formData.status === 'COMPLETED' && (
            <div className="space-y-2">
              <Label htmlFor="outcome">Outcome</Label>
              <Textarea
                id="outcome"
                value={formData.outcome}
                onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
                placeholder="Activity outcome or results"
                className="min-h-[60px]"
              />
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {activity ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                activity ? 'Update Activity' : 'Create Activity'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}