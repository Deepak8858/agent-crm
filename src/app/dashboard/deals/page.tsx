import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { db } from '@/lib/db'

async function getDeals() {
  try {
    const deals = await db.deal.findMany({
      include: {
        contact: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        company: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return deals
  } catch (error) {
    console.error('Error fetching deals:', error)
    return []
  }
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

function getStageColor(stage: string) {
  const colors: Record<string, string> = {
    PROSPECTING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    QUALIFIED: 'bg-blue-100 text-blue-800 border-blue-200',
    PROPOSAL: 'bg-purple-100 text-purple-800 border-purple-200',
    NEGOTIATION: 'bg-orange-100 text-orange-800 border-orange-200',
    CLOSED_WON: 'bg-green-100 text-green-800 border-green-200',
    CLOSED_LOST: 'bg-red-100 text-red-800 border-red-200',
  }
  return colors[stage] || 'bg-gray-100 text-gray-800 border-gray-200'
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

export default async function DealsPage() {
  const deals = await getDeals()

  const totalValue = deals.reduce((sum: number, deal: any) => sum + (deal.amount ? Number(deal.amount) : 0), 0)
  const wonDeals = deals.filter((deal: any) => deal.stage === 'CLOSED_WON')
  const activeDeals = deals.filter((deal: any) => !['CLOSED_WON', 'CLOSED_LOST'].includes(deal.stage))

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Deal Management</h1>
            <p className="text-gray-600 mt-2">Track and manage your sales pipeline</p>
          </div>
          
          <div className="flex space-x-4">
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
            <Button>Add New Deal</Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalValue)}</div>
              <p className="text-sm text-gray-500">{deals.length} total deals</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Deals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{activeDeals.length}</div>
              <p className="text-sm text-gray-500">{formatCurrency(activeDeals.reduce((sum: number, deal: any) => sum + (deal.amount ? Number(deal.amount) : 0), 0))}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Deals Won</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{wonDeals.length}</div>
              <p className="text-sm text-gray-500">{formatCurrency(wonDeals.reduce((sum: number, deal: any) => sum + (deal.amount ? Number(deal.amount) : 0), 0))}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Win Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {deals.length > 0 ? Math.round((wonDeals.length / deals.length) * 100) : 0}%
              </div>
              <p className="text-sm text-gray-500">Conversion rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Deals Pipeline */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Pipeline</CardTitle>
            <CardDescription>All deals organized by stage</CardDescription>
          </CardHeader>
          <CardContent>
            {deals.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No deals found</p>
                <Button>Create Your First Deal</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {deals.map((deal: any) => (
                  <div key={deal.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-gray-900">{deal.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStageColor(deal.stage)}`}>
                          {deal.stage.replace('_', ' ')}
                        </span>
                        <span className={`text-sm font-medium ${getPriorityColor(deal.priority)}`}>
                          {deal.priority} Priority
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">{formatCurrency(deal.amount)}</p>
                        <p className="text-sm text-gray-500">
                          Close: {new Date(deal.closeDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Contact</p>
                        <p className="text-sm text-gray-600">
                          {deal.contact ? (
                            <>
                              {deal.contact.firstName} {deal.contact.lastName}
                              <br />
                              <span className="text-gray-500">{deal.contact.email}</span>
                            </>
                          ) : (
                            'No contact assigned'
                          )}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Company</p>
                        <p className="text-sm text-gray-600">
                          {deal.company?.name || 'No company assigned'}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Description</p>
                        <p className="text-sm text-gray-600">
                          {deal.nextAction || 'No description provided'}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-4 pt-3 border-t">
                      <p className="text-xs text-gray-500">
                        Created: {new Date(deal.createdAt).toLocaleDateString()} • 
                        Updated: {new Date(deal.updatedAt).toLocaleDateString()}
                      </p>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">View Details</Button>
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">Move Stage</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Voice Agent Integration Info */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">Voice AI Integration</CardTitle>
            <CardDescription className="text-blue-600">Deals can be automatically updated via voice agent calls</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">Automated Actions</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Deal stage progression tracking</li>
                  <li>• Automatic follow-up scheduling</li>
                  <li>• Customer interaction logging</li>
                  <li>• Proposal delivery confirmation</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">API Endpoints</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• POST /api/agent/update-deal-stage</li>
                  <li>• POST /api/agent/log-deal-activity</li>
                  <li>• GET /api/agent/deal-status</li>
                  <li>• POST /api/agent/schedule-follow-up</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}