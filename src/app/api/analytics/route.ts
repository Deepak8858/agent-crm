import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Fetch basic counts
    const [
      totalContacts,
      totalCompanies,
      totalDeals,
      totalActivities,
      openTickets
    ] = await Promise.all([
      db.contact.count(),
      db.company.count(),
      db.deal.count(),
      db.activity.count(),
      db.ticket.count({ where: { status: 'OPEN' } })
    ]);

    // Calculate total deal value
    const dealValues = await db.deal.aggregate({
      _sum: {
        amount: true,
      },
    });

    // Get contact status distribution
    const contactsByStatus = await db.contact.groupBy({
      by: ['status'],
      _count: true,
    });

    // Get deals by stage with amounts
    const dealsByStage = await db.deal.groupBy({
      by: ['stage'],
      _count: true,
      _sum: {
        amount: true,
      },
    });

    // Get activities by type
    const activitiesByType = await db.activity.groupBy({
      by: ['type'],
      _count: true,
    });

    // Get recent activities for timeline
    const recentActivities = await db.activity.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        contact: {
          select: { firstName: true, lastName: true }
        },
        deal: {
          select: { name: true }
        }
      }
    });

    const analyticsData = {
      totalContacts,
      totalCompanies,
      totalDeals,
      totalActivities,
      openTickets,
      totalDealValue: dealValues._sum.amount || 0,
      contactsByStatus,
      dealsByStage,
      activitiesByType,
      recentActivities
    };

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}