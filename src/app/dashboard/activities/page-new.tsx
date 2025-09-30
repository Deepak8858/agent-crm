import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { db } from '@/lib/db'

async function getActivities() {
  try {
    const activities = await db.activity.findMany({
      include: {
        contact: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        deal: {
          select: {
            name: true,
            amount: true,
            stage: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    
    return activities
  } catch (error) {
    console.error('Error fetching activities:', error)
    return []
  }
}

function formatDateTime(date: Date) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getTypeColor(type: string) {
  const colors: Record<string, string> = {
    VOICE_AGENT_CALL: 'bg-purple-100 text-purple-800',
    CALL: 'bg-green-100 text-green-800',
    EMAIL: 'bg-blue-100 text-blue-800',
    MEETING: 'bg-yellow-100 text-yellow-800',
    NOTE: 'bg-gray-100 text-gray-800',
    TASK: 'bg-red-100 text-red-800',
    FOLLOW_UP: 'bg-indigo-100 text-indigo-800',
  }
  return colors[type] || 'bg-gray-100 text-gray-800'
}

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    COMPLETED: 'bg-green-100 text-green-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
    CANCELLED: 'bg-red-100 text-red-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export default async function ActivitiesPage() {
  const activities = await getActivities()

  const completedActivities = activities.filter((a: any) => a.completedAt !== null).length
  const pendingActivities = activities.filter((a: any) => a.completedAt === null).length
  const voiceAgentActivities = activities.filter((a: any) => a.type === 'VOICE_AGENT_CALL').length

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Activities</h1>
            <p className="text-gray-600 mt-2">Track all customer interactions and voice agent calls</p>
          </div>
          
          <div className="flex gap-4">
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{activities.length}</p>
              <p className="text-sm text-green-600 mt-1">All interactions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{completedActivities}</p>
              <p className="text-sm text-gray-500">{activities.length > 0 ? Math.round((completedActivities / activities.length) * 100) : 0}% completion rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-600">{pendingActivities}</p>
              <p className="text-sm text-gray-500">Awaiting completion</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Voice AI Calls</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-600">{voiceAgentActivities}</p>
              <p className="text-sm text-gray-500">Automated interactions</p>
            </CardContent>
          </Card>
        </div>

        {/* Activities List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>All customer interactions and voice agent calls</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {activities.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">No activities found</p>
                  <p className="text-sm text-gray-400">Activities will appear here as they are logged by the voice AI agent or manual entry</p>
                </div>
              ) : (
                activities.map((activity: any) => (
                  <div key={activity.id} className="border-l-4 border-blue-200 pl-6 pb-6 relative">
                    <div className="absolute -left-2 w-4 h-4 bg-blue-500 rounded-full"></div>
                    
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{activity.subject}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(activity.type)}`}>
                            {activity.type.replace('_', ' ')}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.completedAt ? 'COMPLETED' : 'PENDING')}`}>
                            {activity.completedAt ? 'COMPLETED' : 'PENDING'}
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Created:</span> {formatDateTime(new Date(activity.createdAt))}
                          {activity.completedAt && (
                            <>
                              {' • '}
                              <span className="font-medium">Completed:</span> {formatDateTime(new Date(activity.completedAt))}
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {activity.summary && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-700">{activity.summary}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Contact</p>
                        {activity.contact ? (
                          <div>
                            <p className="text-sm font-medium">{activity.contact.firstName} {activity.contact.lastName}</p>
                            <p className="text-sm text-gray-500">{activity.contact.email}</p>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-400">No contact associated</p>
                        )}
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Deal</p>
                        {activity.deal ? (
                          <div>
                            <p className="text-sm font-medium">{activity.deal.name}</p>
                            <span className="text-gray-500">
                              ${activity.deal.amount?.toLocaleString() || '0'} • {activity.deal.stage}
                            </span>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-400">No deal associated</p>
                        )}
                      </div>
                    </div>

                    {/* Voice AI Insights */}
                    {activity.type === 'VOICE_AGENT_CALL' && (
                      <div className="mt-4 pt-3 border-t">
                        <p className="text-sm font-medium text-blue-700 mb-2">Voice AI Analysis</p>
                        <div className="bg-blue-50 rounded p-3 space-y-2">
                          {activity.aiSentiment && (
                            <div>
                              <span className="text-xs font-medium text-blue-600">Sentiment:</span>
                              <span className="text-sm ml-2">{activity.aiSentiment}</span>
                            </div>
                          )}
                          {activity.aiIntent && (
                            <div>
                              <span className="text-xs font-medium text-blue-600">Intent:</span>
                              <span className="text-sm ml-2">{activity.aiIntent}</span>
                            </div>
                          )}
                          {activity.outcome && (
                            <div>
                              <span className="text-xs font-medium text-blue-600">Outcome:</span>
                              <span className="text-sm ml-2">{activity.outcome}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}