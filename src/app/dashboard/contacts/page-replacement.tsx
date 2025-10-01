'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ContactFormModal } from '@/components/contacts/contact-form-modal'
import { useContacts, useCompanies } from '@/hooks/use-api'
import { toast } from 'sonner'
import { Loader2, Search, Plus, Edit, Trash2, Phone, Mail, Building2 } from 'lucide-react'

function getStatusColor(status: string) {
  switch (status) {
    case 'LEAD': return 'bg-blue-100 text-blue-800'
    case 'PROSPECT': return 'bg-yellow-100 text-yellow-800'
    case 'CUSTOMER': return 'bg-green-100 text-green-800'
    case 'INACTIVE': return 'bg-gray-100 text-gray-800'
    case 'DO_NOT_CONTACT': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([])
  const [companies, setCompanies] = useState<any[]>([])
  const [filters, setFilters] = useState({
    q: '',
    status: '',
    companyId: '',
  })
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  })

  const { searchContacts, deleteContact, loading } = useContacts()
  const { searchCompanies } = useCompanies()

  const loadContacts = useCallback(async () => {
    try {
      const response = await searchContacts({ 
        ...filters, 
        page: pagination.page,
        limit: 20 
      })
      setContacts(response.contacts || [])
      setPagination(response.pagination || { page: 1, totalPages: 1, total: 0 })
    } catch (error) {
      toast.error('Failed to load contacts')
      console.error('Error loading contacts:', error)
    }
  }, [searchContacts, filters, pagination.page])

  const loadCompanies = useCallback(async () => {
    try {
      const response = await searchCompanies({ limit: 100 })
      setCompanies(response.companies || [])
    } catch (error) {
      console.error('Error loading companies:', error)
    }
  }, [searchCompanies])

  useEffect(() => {
    loadContacts()
    loadCompanies()
  }, [loadContacts, loadCompanies])

  useEffect(() => {
    loadContacts()
  }, [loadContacts])

  const handleSearch = () => {
    setPagination({ ...pagination, page: 1 })
    loadContacts()
  }

  const handleDeleteContact = async (contactId: string, contactName: string) => {
    if (!confirm(`Are you sure you want to delete ${contactName}?`)) return
    
    try {
      await deleteContact(contactId)
      toast.success('Contact deleted successfully')
      loadContacts()
    } catch (error) {
      toast.error('Failed to delete contact')
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
            <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
            <p className="text-gray-600 mt-2">Manage your customer relationships</p>
          </div>
          
          <div className="space-x-3">
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
            <ContactFormModal 
              companies={companies}
              onContactCreated={loadContacts}
              trigger={
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Contact
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Search contacts..."
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.q}
                onChange={(e) => setFilters({...filters, q: e.target.value})}
              />
              <select 
                title="Filter by status"
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <option value="">All Statuses</option>
                <option value="LEAD">Lead</option>
                <option value="PROSPECT">Prospect</option>
                <option value="CUSTOMER">Customer</option>
                <option value="INACTIVE">Inactive</option>
                <option value="DO_NOT_CONTACT">Do Not Contact</option>
              </select>
              <select 
                title="Filter by company"
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.companyId}
                onChange={(e) => setFilters({...filters, companyId: e.target.value})}
              >
                <option value="">All Companies</option>
                {companies.map((company: any) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
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

        {/* Contact List */}
        <div className="space-y-4">
          {loading && contacts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p>Loading contacts...</p>
              </CardContent>
            </Card>
          ) : contacts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500 mb-4">No contacts found</p>
                <ContactFormModal 
                  companies={companies}
                  onContactCreated={loadContacts}
                  trigger={
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Contact
                    </Button>
                  }
                />
              </CardContent>
            </Card>
          ) : (
            contacts.map((contact: any) => (
              <Card key={contact.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {contact.firstName} {contact.lastName}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                          {contact.status.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        {contact.email && (
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4" />
                            <span>{contact.email}</span>
                          </div>
                        )}
                        {contact.phoneNumber && (
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4" />
                            <span>{contact.phoneNumber}</span>
                          </div>
                        )}
                        {contact.company && (
                          <div className="flex items-center space-x-2">
                            <Building2 className="h-4 w-4" />
                            <span>{contact.company.name}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <ContactFormModal 
                        contact={contact}
                        companies={companies}
                        onContactUpdated={loadContacts}
                        trigger={
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteContact(contact.id, `${contact.firstName} ${contact.lastName}`)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-3 border-t text-xs text-gray-500">
                    <span>
                      Created: {new Date(contact.createdAt).toLocaleDateString()}
                    </span>
                    {contact.lastInteractionDate && (
                      <span>
                        Last interaction: {new Date(contact.lastInteractionDate).toLocaleDateString()}
                      </span>
                    )}
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
              Showing {((pagination.page - 1) * 20) + 1} to {Math.min(pagination.page * 20, pagination.total)} of {pagination.total} contacts
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