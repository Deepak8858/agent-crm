'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ActivityFormModal } from '@/components/activities/activity-form-modal'
import { useActivities, useContacts, useDeals } from '@/hooks/use-api'
import { toast } from 'sonner'
import { 
  Loader2, 
  Plus, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  Calendar, 
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  Building
} from 'lucide-react'

function getActivityIcon(type: string) {
  switch (type) {
    case 'CALL': return <Phone className="h-4 w-4" />
    case 'EMAIL': return <Mail className="h-4 w-4" />
    case 'MEETING': return <Calendar className="h-4 w-4" />
    case 'NOTE': return <MessageSquare className="h-4 w-4" />
    default: return <AlertCircle className="h-4 w-4" />
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'SCHEDULED': return 'bg-blue-100 text-blue-800'
    case 'COMPLETED': return 'bg-green-100 text-green-800'
    case 'CANCELLED': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'SCHEDULED': return <Clock className="h-4 w-4" />
    case 'COMPLETED': return <CheckCircle2 className="h-4 w-4" />
    case 'CANCELLED': return <AlertCircle className="h-4 w-4" />
    default: return <Clock className="h-4 w-4" />
  }
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<any[]>([])
  const [contacts, setContacts] = useState<any[]>([])
  const [deals, setDeals] = useState<any[]>([])
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    dateFrom: '',
    dateTo: '',
  })
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  })

  const { getActivities, updateActivity, deleteActivity, loading } = useActivities()
  const { searchContacts } = useContacts()
  const { getDeals } = useDeals()

  const loadActivities = async () => {
    try {
      const response = await getActivities({ 
        ...filters, 
        page: pagination.page,
        limit: 20 
      })
      setActivities(response.activities || [])
      setPagination(response.pagination || { page: 1, totalPages: 1, total: 0 })
    } catch (error) {
      toast.error('Failed to load activities')
      console.error('Error loading activities:', error)
    }
  }

  const loadContacts = async () => {
    try {
      const response = await searchContacts({ limit: 100 })
      setContacts(response.contacts || [])
    } catch (error) {
      console.error('Error loading contacts:', error)
    }
  }

  const loadDeals = async () => {
    try {
      const response = await getDeals({ limit: 100 })
      setDeals(response.deals || [])
    } catch (error) {
      console.error('Error loading deals:', error)
    }
  }

  useEffect(() => {
    loadActivities()
    loadContacts()
    loadDeals()
  }, [])

  useEffect(() => {
    loadActivities()
  }, [pagination.page])

  const handleFilter = () => {
    setPagination({ ...pagination, page: 1 })
    loadActivities()
  }

  const handleUpdateStatus = async (activityId: string, newStatus: string) => {
    try {
      await updateActivity(activityId, { status: newStatus })
      toast.success('Activity status updated successfully')
      loadActivities()
    } catch (error) {
      toast.error('Failed to update activity status')
    }
  }

  const handleDeleteActivity = async (activityId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete activity "${title}"?`)) return
    
    try {
      await deleteActivity(activityId)
      toast.success('Activity deleted successfully')
      loadActivities()
    } catch (error) {
      toast.error('Failed to delete activity')
    }
  }

  const handlePagination = (newPage: number) => {
    setPagination({ ...pagination, page: newPage })
  }

  // Calculate stats
  const todayActivities = activities.filter(a => {
    const activityDate = new Date(a.dueDate || a.createdAt)
    const today = new Date()
    return activityDate.toDateString() === today.toDateString()
  }).length

  const upcomingActivities = activities.filter(a => {
    const activityDate = new Date(a.dueDate || a.createdAt)
    const today = new Date()
    return activityDate > today && a.status === 'SCHEDULED'
  }).length

  const completedActivities = activities.filter(a => a.status === 'COMPLETED').length
  const overdue = activities.filter(a => {
    const activityDate = new Date(a.dueDate || a.createdAt)
    const today = new Date()
    return activityDate < today && a.status === 'SCHEDULED'
  }).length

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Activities</h1>
            <p className="text-gray-600 mt-2">Track interactions and follow-ups with contacts</p>
          </div>
          
          <div className="flex space-x-4">
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
            <ActivityFormModal 
              contacts={contacts}
              deals={deals}
              onActivityCreated={loadActivities}
              trigger={
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Log New Activity
                </Button>
              }
            />
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{todayActivities}</div>
              <p className="text-xs text-muted-foreground">Activities scheduled</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{upcomingActivities}</div>
              <p className="text-xs text-muted-foreground">Scheduled activities</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedActivities}</div>
              <p className="text-xs text-muted-foreground">This period</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{overdue}</div>
              <p className="text-xs text-muted-foreground">Need attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter Bar */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filter Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <select 
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
                aria-label="Filter by activity type"
              >
                <option value="">All Types</option>
                <option value="CALL">Call</option>
                <option value="EMAIL">Email</option>
                <option value="MEETING">Meeting</option>
                <option value="NOTE">Note</option>
              </select>
              <select 
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                aria-label="Filter by status"
              >
                <option value="">All Statuses</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              <input
                type="date"
                placeholder="From Date"
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.dateFrom}
                onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
              />
              <input
                type="date"
                placeholder="To Date"
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.dateTo}
                onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
              />
              <Button onClick={handleFilter} disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Activity List */}
        <div className="space-y-4">
          {loading && activities.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p>Loading activities...</p>
              </CardContent>
            </Card>
          ) : activities.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500 mb-4">No activities found</p>
                <ActivityFormModal 
                  contacts={contacts}
                  deals={deals}
                  onActivityCreated={loadActivities}
                  trigger={
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Log Your First Activity
                    </Button>
                  }
                />
              </CardContent>
            </Card>
          ) : (
            activities.map((activity: any) => (
              <Card key={activity.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full">
                          {getActivityIcon(activity.type)}
                          <span className="text-sm font-medium">{activity.type}</span>
                        </div>
                        <div className={`flex items-center space-x-1 ${getStatusColor(activity.status)} px-2 py-1 rounded-full text-xs font-medium`}>
                          {getStatusIcon(activity.status)}
                          <span>{activity.status}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {activity.title}
                      </h3>
                      
                      {activity.description && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                          {activity.description}
                        </p>
                      )}

                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        {activity.contact && (
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>{activity.contact.firstName} {activity.contact.lastName}</span>
                          </div>
                        )}
                        {activity.deal && (
                          <div className="flex items-center space-x-1">
                            <Building className="h-4 w-4" />
                            <span>{activity.deal.title}</span>
                          </div>
                        )}
                        {activity.dueDate && (
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Due: {new Date(activity.dueDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      {activity.outcome && (
                        <div className="bg-green-50 border border-green-200 rounded-md p-3 mt-3">
                          <p className="text-sm text-green-800">
                            <strong>Outcome:</strong> {activity.outcome}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2">
                      <div className="flex space-x-2">
                        <ActivityFormModal 
                          activity={activity}
                          contacts={contacts}
                          deals={deals}
                          onActivityUpdated={loadActivities}
                          trigger={
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          }
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteActivity(activity.id, activity.title)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {/* Quick Status Update */}
                      <select
                        className="text-xs px-2 py-1 border border-gray-300 rounded"
                        value={activity.status}
                        onChange={(e) => handleUpdateStatus(activity.id, e.target.value)}
                        aria-label="Update activity status"
                      >
                        <option value="SCHEDULED">Scheduled</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-3 border-t text-xs text-gray-500">
                    <span>
                      Created: {new Date(activity.createdAt).toLocaleDateString()}
                    </span>
                    <span>
                      Updated: {new Date(activity.updatedAt).toLocaleDateString()}
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
              Showing {((pagination.page - 1) * 20) + 1} to {Math.min(pagination.page * 20, pagination.total)} of {pagination.total} activities
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