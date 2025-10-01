'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { DealFormModal } from '@/components/deals/deal-form-modal'
import { useDeals, useContacts, useCompanies } from '@/hooks/use-api'
import { toast } from 'sonner'
import { Loader2, Plus, Edit, Trash2, DollarSign, TrendingUp, Users, Building } from 'lucide-react'

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

function getStageColor(stage: string) {
  switch (stage) {
    case 'LEAD': return 'bg-gray-100 text-gray-800'
    case 'QUALIFIED': return 'bg-blue-100 text-blue-800'
    case 'PROPOSAL': return 'bg-yellow-100 text-yellow-800'
    case 'NEGOTIATION': return 'bg-orange-100 text-orange-800'
    case 'CLOSED_WON': return 'bg-green-100 text-green-800'
    case 'CLOSED_LOST': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

function getStageProgress(stage: string) {
  switch (stage) {
    case 'LEAD': return 10
    case 'QUALIFIED': return 25
    case 'PROPOSAL': return 50
    case 'NEGOTIATION': return 75
    case 'CLOSED_WON': return 100
    case 'CLOSED_LOST': return 100
    default: return 0
  }
}

export default function DealsPage() {
  const [deals, setDeals] = useState<any[]>([])
  const [contacts, setContacts] = useState<any[]>([])
  const [companies, setCompanies] = useState<any[]>([])
  const [filters, setFilters] = useState({
    stage: '',
    minValue: '',
    maxValue: '',
  })
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  })

  const { getDeals, updateDeal, deleteDeal, loading } = useDeals()
  const { searchContacts } = useContacts()
  const { searchCompanies } = useCompanies()

  const loadDeals = useCallback(async () => {
    try {
      const response = await getDeals({ 
        ...filters, 
        page: pagination.page,
        limit: 20 
      })
      setDeals(response.deals || [])
      setPagination(response.pagination || { page: 1, totalPages: 1, total: 0 })
    } catch (error) {
      toast.error('Failed to load deals')
      console.error('Error loading deals:', error)
    }
  }, [getDeals, filters, pagination.page])

  const loadContacts = useCallback(async () => {
    try {
      const response = await searchContacts({ limit: 100 })
      setContacts(response.contacts || [])
    } catch (error) {
      console.error('Error loading contacts:', error)
    }
  }, [searchContacts])

  const loadCompanies = useCallback(async () => {
    try {
      const response = await searchCompanies({ limit: 100 })
      setCompanies(response.companies || [])
    } catch (error) {
      console.error('Error loading companies:', error)
    }
  }, [searchCompanies])

  useEffect(() => {
    loadDeals()
    loadContacts()
    loadCompanies()
  }, [loadDeals, loadContacts, loadCompanies])

  useEffect(() => {
    loadDeals()
  }, [loadDeals])

  const handleFilter = () => {
    setPagination({ ...pagination, page: 1 })
    loadDeals()
  }

  const handleUpdateStage = async (dealId: string, newStage: string) => {
    try {
      await updateDeal(dealId, { stage: newStage })
      toast.success('Deal stage updated successfully')
      loadDeals()
    } catch (error) {
      toast.error('Failed to update deal stage')
    }
  }

  const handleDeleteDeal = async (dealId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete deal "${title}"?`)) return
    
    try {
      await deleteDeal(dealId)
      toast.success('Deal deleted successfully')
      loadDeals()
    } catch (error) {
      toast.error('Failed to delete deal')
    }
  }

  const handlePagination = (newPage: number) => {
    setPagination({ ...pagination, page: newPage })
  }

  // Calculate stats
  const totalValue = deals.reduce((sum, deal) => sum + (deal.value || 0), 0)
  const wonDeals = deals.filter(d => d.stage === 'CLOSED_WON')
  const activeDeals = deals.filter(d => !['CLOSED_WON', 'CLOSED_LOST'].includes(d.stage))
  const wonValue = wonDeals.reduce((sum, deal) => sum + (deal.value || 0), 0)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sales Pipeline</h1>
            <p className="text-gray-600 mt-2">Track deals and manage your sales process</p>
          </div>
          
          <div className="flex space-x-4">
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
            <DealFormModal 
              contacts={contacts}
              companies={companies}
              onDealCreated={loadDeals}
              trigger={
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Deal
                </Button>
              }
            />
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(totalValue)}
              </div>
              <p className="text-xs text-muted-foreground">Total deals value</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Won Deals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(wonValue)}
              </div>
              <p className="text-xs text-muted-foreground">{wonDeals.length} deals closed</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{activeDeals.length}</div>
              <p className="text-xs text-muted-foreground">In progress</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {deals.length > 0 ? Math.round((wonDeals.length / deals.length) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">Closed deals</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter Bar */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filter Deals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select 
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.stage}
                onChange={(e) => setFilters({...filters, stage: e.target.value})}
                aria-label="Filter by deal stage"
              >
                <option value="">All Stages</option>
                <option value="LEAD">Lead</option>
                <option value="QUALIFIED">Qualified</option>
                <option value="PROPOSAL">Proposal</option>
                <option value="NEGOTIATION">Negotiation</option>
                <option value="CLOSED_WON">Closed Won</option>
                <option value="CLOSED_LOST">Closed Lost</option>
              </select>
              <input
                type="number"
                placeholder="Min Value"
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.minValue}
                onChange={(e) => setFilters({...filters, minValue: e.target.value})}
              />
              <input
                type="number"
                placeholder="Max Value"
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.maxValue}
                onChange={(e) => setFilters({...filters, maxValue: e.target.value})}
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

        {/* Deal List */}
        <div className="space-y-4">
          {loading && deals.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p>Loading deals...</p>
              </CardContent>
            </Card>
          ) : deals.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500 mb-4">No deals found</p>
                <DealFormModal 
                  contacts={contacts}
                  companies={companies}
                  onDealCreated={loadDeals}
                  trigger={
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Deal
                    </Button>
                  }
                />
              </CardContent>
            </Card>
          ) : (
            deals.map((deal: any) => (
              <Card key={deal.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(deal.stage)}`}>
                          {deal.stage.replace('_', ' ')}
                        </span>
                        <span className="text-lg font-bold text-green-600">
                          {formatCurrency(deal.value || 0)}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {deal.title}
                      </h3>
                      
                      {deal.description && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {deal.description}
                        </p>
                      )}

                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="text-gray-600">{getStageProgress(deal.stage)}%</span>
                        </div>
                        <Progress value={getStageProgress(deal.stage)} className="h-2" />
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        {deal.contact && (
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{deal.contact.firstName} {deal.contact.lastName}</span>
                          </div>
                        )}
                        {deal.company && (
                          <div className="flex items-center space-x-1">
                            <Building className="h-4 w-4" />
                            <span>{deal.company.name}</span>
                          </div>
                        )}
                        {deal.closeDate && (
                          <span>
                            Close: {new Date(deal.closeDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <div className="flex space-x-2">
                        <DealFormModal 
                          deal={deal}
                          contacts={contacts}
                          companies={companies}
                          onDealUpdated={loadDeals}
                          trigger={
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          }
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteDeal(deal.id, deal.title)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {/* Quick Stage Update */}
                      {!['CLOSED_WON', 'CLOSED_LOST'].includes(deal.stage) && (
                        <select
                          className="text-xs px-2 py-1 border border-gray-300 rounded"
                          value={deal.stage}
                          onChange={(e) => handleUpdateStage(deal.id, e.target.value)}
                          aria-label="Update deal stage"
                        >
                          <option value="LEAD">Lead</option>
                          <option value="QUALIFIED">Qualified</option>
                          <option value="PROPOSAL">Proposal</option>
                          <option value="NEGOTIATION">Negotiation</option>
                          <option value="CLOSED_WON">Closed Won</option>
                          <option value="CLOSED_LOST">Closed Lost</option>
                        </select>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-3 border-t text-xs text-gray-500">
                    <span>
                      Created: {new Date(deal.createdAt).toLocaleDateString()}
                    </span>
                    <span>
                      Updated: {new Date(deal.updatedAt).toLocaleDateString()}
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
              Showing {((pagination.page - 1) * 20) + 1} to {Math.min(pagination.page * 20, pagination.total)} of {pagination.total} deals
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