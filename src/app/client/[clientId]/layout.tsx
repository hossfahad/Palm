'use client';

import { RouteGuard } from '@/components/auth/route-guard';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { useParams } from 'next/navigation';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const clientId = params.clientId as string;

  return (
    <RouteGuard requiredRole="client" requiredUserId={clientId}>
      <DashboardShell>{children}</DashboardShell>
    </RouteGuard>
  );
} 