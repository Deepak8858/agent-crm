'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TicketFormModal } from '@/components/tickets/ticket-form-modal'
import { useTickets, useContacts } from '@/hooks/use-api'
import { toast } from 'sonner'
import { Loader2, Plus, Edit, Trash2, AlertCircle, Clock, CheckCircle2, XCircle } from 'lucide-react'

function getStatusColor(status: string) {
  switch (status) {
    case 'OPEN': return 'bg-blue-100 text-blue-800'
    case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800'
    case 'RESOLVED': return 'bg-green-100 text-green-800'
    case 'CLOSED': return 'bg-gray-100 text-gray-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'LOW': return 'text-green-600'
    case 'MEDIUM': return 'text-yellow-600'
    case 'HIGH': return 'text-orange-600'
    case 'URGENT': return 'text-red-600'
    default: return 'text-gray-600'
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'OPEN': return <AlertCircle className="h-4 w-4" />
    case 'IN_PROGRESS': return <Clock className="h-4 w-4" />
    case 'RESOLVED': return <CheckCircle2 className="h-4 w-4" />
    case 'CLOSED': return <XCircle className="h-4 w-4" />
    default: return <AlertCircle className="h-4 w-4" />
  }
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<any[]>([])
  const [contacts, setContacts] = useState<any[]>([])
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
  })
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  })

  const { getTickets, updateTicket, deleteTicket, loading } = useTickets()
  const { searchContacts } = useContacts()

  const loadTickets = useCallback(async () => {
    try {
      const response = await getTickets({ 
        ...filters, 
        page: pagination.page,
        limit: 20 
      })
      setTickets(response.tickets || [])
      setPagination(response.pagination || { page: 1, totalPages: 1, total: 0 })
    } catch (error) {
      toast.error('Failed to load tickets')
      console.error('Error loading tickets:', error)
    }
  }, [getTickets, filters, pagination.page])

  const loadContacts = useCallback(async () => {
    try {
      const response = await searchContacts({ limit: 100 })
      setContacts(response.contacts || [])
    } catch (error) {
      console.error('Error loading contacts:', error)
    }
  }, [searchContacts])

  useEffect(() => {
    loadTickets()
    loadContacts()
  }, [loadTickets, loadContacts])

  useEffect(() => {
    loadTickets()
  }, [loadTickets])

  const handleFilter = () => {
    setPagination({ ...pagination, page: 1 })
    loadTickets()
  }

  const handleUpdateStatus = async (ticketId: string, newStatus: string) => {
    try {
      await updateTicket(ticketId, { status: newStatus })
      toast.success('Ticket status updated successfully')
      loadTickets()
    } catch (error) {
      toast.error('Failed to update ticket status')
    }
  }

  const handleDeleteTicket = async (ticketId: string, subject: string) => {
    if (!confirm(`Are you sure you want to delete ticket "${subject}"?`)) return
    
    try {
      await deleteTicket(ticketId)
      toast.success('Ticket deleted successfully')
      loadTickets()
    } catch (error) {
      toast.error('Failed to delete ticket')
    }
  }

  const handlePagination = (newPage: number) => {
    setPagination({ ...pagination, page: newPage })
  }

  // Calculate stats
  const openTickets = tickets.filter(t => ['OPEN', 'IN_PROGRESS'].includes(t.status)).length
  const resolvedTickets = tickets.filter(t => t.status === 'RESOLVED').length
  const urgentTickets = tickets.filter(t => t.priority === 'URGENT').length

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
            <p className="text-gray-600 mt-2">Manage customer support requests and issues</p>
          </div>
          
          <div className="flex space-x-4">
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
            <TicketFormModal 
              contacts={contacts}
              onTicketCreated={loadTickets}
              trigger={
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Ticket
                </Button>
              }
            />
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{openTickets}</div>
              <p className="text-xs text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{resolvedTickets}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Urgent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{urgentTickets}</div>
              <p className="text-xs text-muted-foreground">High priority</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pagination.total}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter Bar */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filter Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select 
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <option value="">All Statuses</option>
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>
              <select 
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.priority}
                onChange={(e) => setFilters({...filters, priority: e.target.value})}
              >
                <option value="">All Priorities</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
              <Button onClick={handleFilter} disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Ticket List */}
        <div className="space-y-4">
          {loading && tickets.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p>Loading tickets...</p>
              </CardContent>
            </Card>
          ) : tickets.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500 mb-4">No tickets found</p>
                <TicketFormModal 
                  contacts={contacts}
                  onTicketCreated={loadTickets}
                  trigger={
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Ticket
                    </Button>
                  }
                />
              </CardContent>
            </Card>
          ) : (
            tickets.map((ticket: any) => (
              <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`flex items-center space-x-1 ${getStatusColor(ticket.status)} px-2 py-1 rounded-full text-xs font-medium`}>
                          {getStatusIcon(ticket.status)}
                          <span>{ticket.status.replace('_', ' ')}</span>
                        </div>
                        <span className={`text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority} PRIORITY
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {ticket.subject}
                      </h3>
                      
                      {ticket.description && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {ticket.description}
                        </p>
                      )}

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        {ticket.contact && (
                          <span>
                            Contact: {ticket.contact.firstName} {ticket.contact.lastName}
                          </span>
                        )}
                        {ticket.category && (
                          <span>Category: {ticket.category}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <div className="flex space-x-2">
                        <TicketFormModal 
                          ticket={ticket}
                          contacts={contacts}
                          onTicketUpdated={loadTickets}
                          trigger={
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          }
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteTicket(ticket.id, ticket.subject)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {/* Quick Status Update */}
                      {ticket.status !== 'CLOSED' && (
                        <select
                          className="text-xs px-2 py-1 border border-gray-300 rounded"
                          value={ticket.status}
                          onChange={(e) => handleUpdateStatus(ticket.id, e.target.value)}
                        >
                          <option value="OPEN">Open</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="RESOLVED">Resolved</option>
                          <option value="CLOSED">Closed</option>
                        </select>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-3 border-t text-xs text-gray-500">
                    <span>
                      Created: {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                    <span>
                      Updated: {new Date(ticket.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-between items-center mt-8">
            <p className="text-sm text-gray-700">
              Showing {((pagination.page - 1) * 20) + 1} to {Math.min(pagination.page * 20, pagination.total)} of {pagination.total} tickets
            </p>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={pagination.page <= 1}
                onClick={() => handlePagination(pagination.page - 1)}
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => handlePagination(pagination.page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}