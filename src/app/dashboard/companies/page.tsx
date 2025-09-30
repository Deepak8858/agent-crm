'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CompanyFormModal } from '@/components/companies/company-form-modal'
import { useCompanies } from '@/hooks/use-api'
import { toast } from 'sonner'
import { Loader2, Search, Plus, Edit, Trash2, Globe, Phone, MapPin, Users, TrendingUp } from 'lucide-react'

function getHealthScoreColor(score: number) {
  if (score >= 80) return 'text-green-600'
  if (score >= 60) return 'text-yellow-600'
  if (score >= 40) return 'text-orange-600'
  return 'text-red-600'
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([])
  const [filters, setFilters] = useState({
    q: '',
    industry: '',
  })
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  })

  const { searchCompanies, deleteCompany, loading } = useCompanies()

  const loadCompanies = async () => {
    try {
      const response = await searchCompanies({ 
        ...filters, 
        page: pagination.page,
        limit: 20 
      })
      setCompanies(response.companies || [])
      setPagination(response.pagination || { page: 1, totalPages: 1, total: 0 })
    } catch (error) {
      toast.error('Failed to load companies')
      console.error('Error loading companies:', error)
    }
  }

  useEffect(() => {
    loadCompanies()
  }, [])

  useEffect(() => {
    loadCompanies()
  }, [pagination.page])

  const handleSearch = () => {
    setPagination({ ...pagination, page: 1 })
    loadCompanies()
  }

  const handleDeleteCompany = async (companyId: string, companyName: string) => {
    if (!confirm(`Are you sure you want to delete ${companyName}?`)) return
    
    try {
      await deleteCompany(companyId)
      toast.success('Company deleted successfully')
      loadCompanies()
    } catch (error) {
      toast.error('Failed to delete company')
    }
  }

  const handlePagination = (newPage: number) => {
    setPagination({ ...pagination, page: newPage })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Companies</h1>
            <p className="text-gray-600 mt-2">Manage your business accounts and relationships</p>
          </div>
          
          <div className="space-x-3">
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
            <CompanyFormModal 
              onCompanyCreated={loadCompanies}
              trigger={
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Company
                </Button>
              }
            />
          </div>
        </div>

        {/* Search and Filter Bar */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Search & Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Search companies..."
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.q}
                onChange={(e) => setFilters({...filters, q: e.target.value})}
              />
              <input
                type="text"
                placeholder="Filter by industry..."
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.industry}
                onChange={(e) => setFilters({...filters, industry: e.target.value})}
              />
              <Button onClick={handleSearch} disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Company List */}
        <div className="space-y-4">
          {loading && companies.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p>Loading companies...</p>
              </CardContent>
            </Card>
          ) : companies.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500 mb-4">No companies found</p>
                <CompanyFormModal 
                  onCompanyCreated={loadCompanies}
                  trigger={
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Company
                    </Button>
                  }
                />
              </CardContent>
            </Card>
          ) : (
            companies.map((company: any) => (
              <Card key={company.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {company.name}
                        </h3>
                        {company.healthScore !== null && (
                          <div className="flex items-center space-x-1">
                            <TrendingUp className={`h-4 w-4 ${getHealthScoreColor(company.healthScore)}`} />
                            <span className={`text-sm font-medium ${getHealthScoreColor(company.healthScore)}`}>
                              {company.healthScore}%
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                        {company.industry && (
                          <div>
                            <strong>Industry:</strong> {company.industry}
                          </div>
                        )}
                        {company.website && (
                          <div className="flex items-center space-x-1">
                            <Globe className="h-4 w-4" />
                            <a 
                              href={company.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Website
                            </a>
                          </div>
                        )}
                        {company.phoneNumber && (
                          <div className="flex items-center space-x-1">
                            <Phone className="h-4 w-4" />
                            <span>{company.phoneNumber}</span>
                          </div>
                        )}
                        {company.address && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span className="truncate">{company.address}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{company._count?.contacts || 0} contacts</span>
                        </div>
                        <div>
                          <span>{company._count?.deals || 0} deals</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <CompanyFormModal 
                        company={company}
                        onCompanyUpdated={loadCompanies}
                        trigger={
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteCompany(company.id, company.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-3 border-t text-xs text-gray-500">
                    <span>
                      Created: {new Date(company.createdAt).toLocaleDateString()}
                    </span>
                    <span>
                      Updated: {new Date(company.updatedAt).toLocaleDateString()}
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
              Showing {((pagination.page - 1) * 20) + 1} to {Math.min(pagination.page * 20, pagination.total)} of {pagination.total} companies
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