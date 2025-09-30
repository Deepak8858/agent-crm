import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your CRM and monitor Voice AI Agent performance</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">+10% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">56</div>
              <p className="text-xs text-muted-foreground">$234k in pipeline</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Voice Calls Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">4.2 avg minutes</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">3 high priority</p>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <Link href="/dashboard/contacts">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">Contacts</CardTitle>
                <CardDescription>Manage customer contacts and relationships</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">Full CRUD operations with advanced search</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/companies">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">Companies</CardTitle>
                <CardDescription>Manage company accounts and hierarchies</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">Track health scores and activities</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/deals">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">Deals</CardTitle>
                <CardDescription>Track sales pipeline and opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">Drag-and-drop pipeline interface</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/activities">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">Activities</CardTitle>
                <CardDescription>View activity timeline and call logs</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">Voice agent integration logs</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/tickets">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">Support Tickets</CardTitle>
                <CardDescription>Manage customer support requests</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">Priority-based queue management</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/analytics">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">Analytics</CardTitle>
                <CardDescription>Performance metrics and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">Real-time KPI dashboard</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/settings">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">Settings</CardTitle>
                <CardDescription>Configure system and API keys</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">API key management</p>
              </CardContent>
            </Card>
          </Link>

          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg text-blue-800">Voice AI Agent</CardTitle>
              <CardDescription className="text-blue-600">Integration Status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 bg-green-400 rounded-full"></div>
                <p className="text-sm text-blue-700">Connected & Active</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}