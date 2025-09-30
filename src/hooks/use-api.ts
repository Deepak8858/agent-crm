'use client'

import { useState } from 'react'

export function useApi<T>() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const request = async (
    url: string,
    options?: RequestInit
  ): Promise<T> => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Something went wrong')
      }

      const data = await response.json()
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const get = (url: string) => request(url)
  
  const post = (url: string, data: any) => 
    request(url, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  
  const put = (url: string, data: any) => 
    request(url, {
      method: 'PUT',  
      body: JSON.stringify(data),
    })
  
  const del = (url: string) => 
    request(url, { method: 'DELETE' })

  return {
    loading,
    error,
    get,
    post,
    put,
    del,
  }
}

export function useContacts() {
  const { get, post, put, del, loading, error } = useApi<any>()

  return {
    loading,
    error,
    searchContacts: (params?: Record<string, any>) => {
      const searchParams = new URLSearchParams(params).toString()
      return get(`/api/contacts?${searchParams}`)
    },
    createContact: (data: any) => post('/api/contacts', data),
    updateContact: (id: string, data: any) => put(`/api/contacts/${id}`, data),
    deleteContact: (id: string) => del(`/api/contacts/${id}`),
    getContact: (id: string) => get(`/api/contacts/${id}`),
  }
}

export function useCompanies() {
  const { get, post, put, del, loading, error } = useApi<any>()

  return {
    loading,
    error,
    searchCompanies: (params?: Record<string, any>) => {
      const searchParams = new URLSearchParams(params).toString()
      return get(`/api/companies?${searchParams}`)
    },
    createCompany: (data: any) => post('/api/companies', data),
    updateCompany: (id: string, data: any) => put(`/api/companies/${id}`, data),
    deleteCompany: (id: string) => del(`/api/companies/${id}`),
    getCompany: (id: string) => get(`/api/companies/${id}`),
  }
}

export function useDeals() {
  const { get, post, put, del, loading, error } = useApi<any>()

  return {
    loading,
    error,
    getDeals: (params?: Record<string, any>) => {
      const searchParams = new URLSearchParams(params).toString()
      return get(`/api/deals?${searchParams}`)
    },
    createDeal: (data: any) => post('/api/deals', data),
    updateDeal: (id: string, data: any) => put(`/api/deals/${id}`, data),
    deleteDeal: (id: string) => del(`/api/deals/${id}`),
    getDeal: (id: string) => get(`/api/deals/${id}`),
  }
}

export function useTickets() {
  const { get, post, put, del, loading, error } = useApi<any>()

  return {
    loading,
    error,
    getTickets: (params?: Record<string, any>) => {
      const searchParams = new URLSearchParams(params).toString()
      return get(`/api/tickets?${searchParams}`)
    },
    createTicket: (data: any) => post('/api/tickets', data),
    updateTicket: (id: string, data: any) => put(`/api/tickets/${id}`, data),
    deleteTicket: (id: string) => del(`/api/tickets/${id}`),
    getTicket: (id: string) => get(`/api/tickets/${id}`),
  }
}

export function useActivities() {
  const { get, post, put, del, loading, error } = useApi<any>()

  return {
    loading,
    error,
    getActivities: (params?: Record<string, any>) => {
      const searchParams = new URLSearchParams(params).toString()
      return get(`/api/activities?${searchParams}`)
    },
    createActivity: (data: any) => post('/api/activities', data),
    updateActivity: (id: string, data: any) => put(`/api/activities/${id}`, data),
    deleteActivity: (id: string) => del(`/api/activities/${id}`),
    getActivity: (id: string) => get(`/api/activities/${id}`),
  }
}

export function useApiKeys() {
  const { get, post, put, del, loading, error } = useApi<any>()

  return {
    loading,
    error,
    getApiKeys: () => get('/api/api-keys'),
    createApiKey: (data: any) => post('/api/api-keys', data),
    updateApiKey: (id: string, data: any) => put(`/api/api-keys/${id}`, data),
    revokeApiKey: (id: string) => del(`/api/api-keys/${id}`),
    getApiKeyUsage: (id: string) => get(`/api/api-keys/${id}/usage`),
  }
}