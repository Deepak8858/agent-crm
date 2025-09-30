'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ContactFormModal } from '@/components/contacts/contact-form-modal'
import { useContacts, useCompanies } from '@/hooks/use-api'
import { toast } from 'sonner'
import { Loader2, Search, Plus, Edit, Trash2, Phone, Mail, Building2 } from 'lucide-react'

export default function ContactsPage() {
  const { searchContacts, deleteContact, loading: contactsLoading } = useContacts()
  const { searchCompanies, loading: companiesLoading } = useCompanies()
  const [contacts, setContacts] = useState<any[]>([])
  const [companies, setCompanies] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [companyFilter, setCompanyFilter] = useState('')

  const fetchContactsData = async () => {
    try {
      const response = await searchContacts()
      // Extract the contacts array from the response
      const contactsArray = response.data || response.contacts || response || []
      setContacts(Array.isArray(contactsArray) ? contactsArray : [])
    } catch (error) {
      toast.error('Failed to fetch contacts')
      setContacts([]) // Ensure it's always an array
    }
  }

  const fetchCompaniesData = async () => {
    try {
      const response = await searchCompanies()
      // Extract the companies array from the response
      const companiesArray = response.data || response.companies || response || []
      setCompanies(Array.isArray(companiesArray) ? companiesArray : [])
    } catch (error) {
      toast.error('Failed to fetch companies')
      setCompanies([]) // Ensure it's always an array
    }
  }

  useEffect(() => {
    fetchContactsData()
    fetchCompaniesData()
  }, [])

  const handleDeleteContact = async (id: string) => {
    try {
      await deleteContact(id)
      toast.success('Contact deleted successfully')
      fetchContactsData() // Refresh the list
    } catch (error) {
      toast.error('Failed to delete contact')
    }
  }

  // Ensure contacts is always an array before filtering
  const contactsArray = Array.isArray(contacts) ? contacts : []
  const filteredContacts = contactsArray.filter((contact: any) => {
    const searchMatch = !searchTerm || 
      `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phoneNumber?.includes(searchTerm)
    
    const statusMatch = !statusFilter || contact.status === statusFilter
    const companyMatch = !companyFilter || contact.companyId === companyFilter

    return searchMatch && statusMatch && companyMatch
  })

  if (contactsLoading || companiesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CUSTOMER':
        return 'bg-green-100 text-green-800'
      case 'PROSPECT':
        return 'bg-blue-100 text-blue-800'
      case 'LEAD':
        return 'bg-yellow-100 text-yellow-800'
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800'
      case 'DO_NOT_CONTACT':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
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
              onContactCreated={() => fetchContactsData()}
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select 
                title="Filter by status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="LEAD">Lead</option>
                <option value="PROSPECT">Prospect</option>
                <option value="CUSTOMER">Customer</option>
                <option value="INACTIVE">Inactive</option>
              </select>
              <select 
                title="Filter by company"
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Companies</option>
                {companies.map((company: any) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
              <Button onClick={() => {
                setSearchTerm('')
                setStatusFilter('')
                setCompanyFilter('')
              }}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contact List */}
        <div className="grid gap-4">
          {filteredContacts.map((contact: any) => (
            <Card key={contact.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {contact.firstName} {contact.lastName}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(contact.status)}`}>
                        {contact.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <p className="font-medium">Email</p>
                        <p>{contact.email}</p>
                      </div>
                      <div>
                        <p className="font-medium">Phone</p>
                        <p>{contact.phoneNumber}</p>
                      </div>
                      <div>
                        <p className="font-medium">Company</p>
                        <p>{contact.company?.name || 'N/A'}</p>
                      </div>
                    </div>
                    
                    {contact.lastInteractionDate && (
                      <p className="text-xs text-gray-500 mt-2">
                        Last interaction: {new Date(contact.lastInteractionDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    {contact.email && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={`mailto:${contact.email}`} title={`Email ${contact.firstName} ${contact.lastName}`}>
                          <Mail className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {contact.phoneNumber && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={`tel:${contact.phoneNumber}`} title={`Call ${contact.firstName} ${contact.lastName}`}>
                          <Phone className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    <ContactFormModal
                      contact={contact}
                      companies={companies}
                      onContactUpdated={() => fetchContactsData()}
                      trigger={
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      }
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteContact(contact.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-8">
          <p className="text-sm text-gray-700">
            Showing {filteredContacts.length} of {contactsArray.length} contacts
          </p>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}