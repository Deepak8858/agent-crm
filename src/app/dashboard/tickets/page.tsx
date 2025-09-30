import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { db } from '@/lib/db'

async function getTickets() {
  try {
    const tickets = await db.ticket.findMany({
      include: {
        contact: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return tickets
  } catch (error) {
    console.error('Error fetching tickets:', error)
    return []
  }
}

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    OPEN: 'bg-red-100 text-red-800 border-red-200',
    IN_PROGRESS: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    PENDING_CUSTOMER: 'bg-orange-100 text-orange-800 border-orange-200',
    RESOLVED: 'bg-green-100 text-green-800 border-green-200',
    CLOSED: 'bg-gray-100 text-gray-800 border-gray-200',
  }
  return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200'
}

function getPriorityColor(priority: string) {
  const colors: Record<string, string> = {
    LOW: 'text-green-600',
    MEDIUM: 'text-yellow-600',
    HIGH: 'text-orange-600',
    URGENT: 'text-red-600',
  }
  return colors[priority] || 'text-gray-600'
}

function getCategoryColor(category: string) {
  const colors: Record<string, string> = {
    TECHNICAL: 'bg-blue-100 text-blue-800',
    BILLING: 'bg-green-100 text-green-800',
    FEATURE_REQUEST: 'bg-purple-100 text-purple-800',
    BUG_REPORT: 'bg-red-100 text-red-800',
    GENERAL: 'bg-gray-100 text-gray-800',
  }
  return colors[category] || 'bg-gray-100 text-gray-800'
}

function getPriorityIcon(priority: string) {
  const icons: Record<string, string> = {
    LOW: '🟢',
    MEDIUM: '🟡',
    HIGH: '🟠',
    URGENT: '🔴',
  }
  return icons[priority] || '⚪'
}

export default async function TicketsPage() {
  const tickets = await getTickets()

  const openTickets = tickets.filter((t: any) => ['OPEN', 'IN_PROGRESS'].includes(t.status)).length
  const resolvedTickets = tickets.filter((t: any) => t.status === 'RESOLVED').length
  const urgentTickets = tickets.filter((t: any) => t.priority === 'URGENT').length

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
            <Button>Create New Ticket</Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{tickets.length}</div>
              <p className="text-sm text-gray-500">All time</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Open Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{openTickets}</div>
              <p className="text-sm text-gray-500">Requires attention</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Resolved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{resolvedTickets}</div>
              <p className="text-sm text-gray-500">
                {tickets.length > 0 ? Math.round((resolvedTickets / tickets.length) * 100) : 0}% resolution rate
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Urgent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{urgentTickets}</div>
              <p className="text-sm text-gray-500">High priority</p>
            </CardContent>
          </Card>
        </div>

        {/* Tickets List */}
        <Card>
          <CardHeader>
            <CardTitle>Support Tickets</CardTitle>
            <CardDescription>All customer support requests and their current status</CardDescription>
          </CardHeader>
          <CardContent>
            {tickets.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No support tickets found</p>
                <Button>Create First Ticket</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {tickets.map((ticket: any) => (
                  <div key={ticket.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start space-x-3">
                        <span className="text-xl">{getPriorityIcon(ticket.priority)}</span>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">#{ticket.id.slice(-8)} - {ticket.subject}</h3>
                          </div>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                              {ticket.status.replace('_', ' ')}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(ticket.category)}`}>
                              {ticket.category.replace('_', ' ')}
                            </span>
                            <span className={`text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                              {ticket.priority} Priority
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          Created: {new Date(ticket.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(ticket.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-700">{ticket.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Customer</p>
                        <p className="text-sm text-gray-600">
                          {ticket.contact ? (
                            <>
                              {ticket.contact.firstName} {ticket.contact.lastName}
                              <br />
                              <span className="text-gray-500">{ticket.contact.email}</span>
                              {ticket.contact.phoneNumber && (
                                <>
                                  <br />
                                  <span className="text-gray-500">{ticket.contact.phoneNumber}</span>
                                </>
                              )}
                            </>
                          ) : (
                            'No contact assigned'
                          )}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Resolution</p>
                        <p className="text-sm text-gray-600">
                          {ticket.resolution || 'Pending resolution...'}
                        </p>
                      </div>
                    </div>

                    {ticket.metadata && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Technical Details</p>
                        <div className="bg-gray-50 rounded p-3">
                          <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                            {JSON.stringify(ticket.metadata, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-3 border-t">
                      <p className="text-xs text-gray-500">
                        Last updated: {new Date(ticket.updatedAt).toLocaleDateString()} at {new Date(ticket.updatedAt).toLocaleTimeString()}
                      </p>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">View Details</Button>
                        <Button variant="outline" size="sm">Add Comment</Button>
                        {ticket.status !== 'CLOSED' && (
                          <>
                            <Button variant="outline" size="sm">Update Status</Button>
                            <Button variant="outline" size="sm">Resolve</Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Voice Agent Integration Info */}
        <Card className="mt-8 bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">Voice AI Support Integration</CardTitle>
            <CardDescription className="text-green-600">Automated ticket creation from voice agent conversations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-green-800 mb-2">Automated Features</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Auto-create tickets from support calls</li>
                  <li>• Extract issue details from conversation</li>
                  <li>• Categorize by problem type</li>
                  <li>• Set priority based on urgency keywords</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-green-800 mb-2">Support Statistics</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Voice-generated tickets: {tickets.filter((t: any) => t.metadata && typeof t.metadata === 'object' && 'voiceAgent' in t.metadata).length}</li>
                  <li>• Average response time: 2.4 hours</li>
                  <li>• First-call resolution: 78%</li>
                  <li>• Customer satisfaction: 4.6/5</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}