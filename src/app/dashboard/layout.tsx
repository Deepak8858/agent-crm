import { DashboardNav } from '@/components/dashboard-nav';
import { Toaster } from 'sonner';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <main>{children}</main>
      <Toaster position="top-right" />
    </div>
  );
}