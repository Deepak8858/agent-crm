'use client';

import { UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function DashboardNav() {
  const { user } = useUser();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-xl font-bold text-gray-900">
              Agent CRM
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <span className="text-sm text-gray-600">
                Welcome, {user.firstName || user.emailAddresses[0].emailAddress}
              </span>
            )}
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    </nav>
  );
}