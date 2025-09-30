import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Agent CRM
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Comprehensive CRM system with Voice AI Agent integration. 
          Manage contacts, companies, deals, and support tickets with 
          powerful automation and analytics.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold mb-2">Contact Management</h3>
            <p className="text-gray-600">Full CRUD operations with advanced search and filtering</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold mb-2">Voice AI Integration</h3>
            <p className="text-gray-600">Secure API endpoints for voice agent call logging</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
            <p className="text-gray-600">Real-time metrics and performance tracking</p>
          </div>
        </div>

        <div className="space-x-4">
          <Link href="/sign-in">
            <Button size="lg">
              Sign In
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button variant="outline" size="lg">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}