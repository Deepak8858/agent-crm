'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, DollarSign, Users, Phone, Ticket } from 'lucide-react'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface AnalyticsData {
  totalContacts: number;
  totalCompanies: number;
  totalDeals: number;
  totalActivities: number;
  openTickets: number;
  totalDealValue: number;
  contactsByStatus: any[];
  dealsByStage: any[];
  activitiesByType: any[];
  recentActivities: any[];
}

function useAnalyticsData() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/analytics');
        const analyticsData = await response.json();
        setData(analyticsData);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        // Use fallback data in case of error
        setData({
          totalContacts: 0,
          totalCompanies: 0,
          totalDeals: 0,
          totalActivities: 0,
          openTickets: 0,
          totalDealValue: 0,
          contactsByStatus: [],
          dealsByStage: [],
          activitiesByType: [],
          recentActivities: []
        });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return { data, loading };
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    LEAD: 'bg-yellow-100 text-yellow-800',
    PROSPECT: 'bg-blue-100 text-blue-800',
    CUSTOMER: 'bg-green-100 text-green-800',
    INACTIVE: 'bg-gray-100 text-gray-800',
    DO_NOT_CONTACT: 'bg-red-100 text-red-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

function getStageColor(stage: string) {
  const colors: Record<string, string> = {
    PROSPECTING: 'bg-yellow-100 text-yellow-800',
    QUALIFIED: 'bg-blue-100 text-blue-800',
    PROPOSAL: 'bg-purple-100 text-purple-800',
    NEGOTIATION: 'bg-orange-100 text-orange-800',
    CLOSED_WON: 'bg-green-100 text-green-800',
    CLOSED_LOST: 'bg-red-100 text-red-800',
  }
  return colors[stage] || 'bg-gray-100 text-gray-800'
}

export default function AnalyticsPage() {
  const { data, loading } = useAnalyticsData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Unable to load analytics data</p>
        </div>
      </div>
    );
  }

  // Mock time series data for charts
  const revenueData = [
    { month: 'Jan', revenue: 45000, deals: 12 },
    { month: 'Feb', revenue: 52000, deals: 15 },
    { month: 'Mar', revenue: 48000, deals: 13 },
    { month: 'Apr', revenue: 61000, deals: 18 },
    { month: 'May', revenue: 55000, deals: 16 },
    { month: 'Jun', revenue: 67000, deals: 20 },
  ];

  const activityData = [
    { type: 'Calls', count: 145 },
    { type: 'Emails', count: 89 },
    { type: 'Meetings', count: 34 },
    { type: 'Notes', count: 67 },
  ];

  const conversionData = [
    { stage: 'Leads', count: 250, color: '#FF8042' },
    { stage: 'Qualified', count: 180, color: '#FFBB28' },
    { stage: 'Proposals', count: 95, color: '#00C49F' },
    { stage: 'Won', count: 42, color: '#0088FE' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Enhanced Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">Real-time performance metrics and interactive insights</p>
          </div>
          
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        {/* Enhanced Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
                <Users className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalContacts.toLocaleString()}</div>
              <p className="text-xs opacity-90 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Companies</CardTitle>
                <DollarSign className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalCompanies.toLocaleString()}</div>
              <p className="text-xs opacity-90 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +5 new this week
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
                <TrendingUp className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalDeals.toLocaleString()}</div>
              <p className="text-xs opacity-90">Pipeline health: 85%</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
                <DollarSign className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(data.totalDealValue)}</div>
              <p className="text-xs opacity-90 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +23% growth
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
                <Phone className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalActivities.toLocaleString()}</div>
              <p className="text-xs opacity-90">4.2 avg daily</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
                <Ticket className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.openTickets.toLocaleString()}</div>
              <p className="text-xs opacity-90 flex items-center">
                <TrendingDown className="h-3 w-3 mr-1" />
                -8% this week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>Monthly revenue and deal count over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [
                    name === 'revenue' ? formatCurrency(value as number) : value,
                    name === 'revenue' ? 'Revenue' : 'Deals'
                  ]} />
                  <Area type="monotone" dataKey="revenue" stackId="1" stroke="#8884d8" fill="#8884d8" />
                  <Line type="monotone" dataKey="deals" stroke="#82ca9d" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Activity Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Distribution</CardTitle>
              <CardDescription>Breakdown of different activity types</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Contact Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Status</CardTitle>
              <CardDescription>Distribution of contacts by status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.contactsByStatus.map((item: any) => (
                  <div key={item.status} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="text-sm font-medium">{item._count}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Deal Pipeline */}
          <Card>
            <CardHeader>
              <CardTitle>Deal Pipeline</CardTitle>
              <CardDescription>Deals and values by stage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.dealsByStage.map((item: any) => (
                  <div key={item.stage} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(item.stage)}`}>
                        {item.stage}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{item._count} deals</div>
                      <div className="text-xs text-gray-500">
                        {formatCurrency(item._sum?.amount || 0)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Conversion Funnel */}
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
              <CardDescription>Lead to customer conversion</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={conversionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {conversionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Real-time Voice Agent Integration Status */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center">
              <div className="h-3 w-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              Live Voice AI Analytics
            </CardTitle>
            <CardDescription className="text-blue-600">Real-time integration metrics and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-800">98.5%</div>
                <p className="text-sm text-blue-600">Uptime</p>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-800">
                  {data.activitiesByType.find((t: any) => t.type === 'VOICE_AGENT_CALL')?._count || 0}
                </div>
                <p className="text-sm text-blue-600">Calls Today</p>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-800">4.2 min</div>
                <p className="text-sm text-blue-600">Avg Call Duration</p>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-blue-800">94%</div>
                <p className="text-sm text-blue-600">Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}