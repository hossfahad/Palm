'use client';

import { RouteGuard } from '@/components/auth/route-guard';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { useParams } from 'next/navigation';

export default function AdvisorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const advisorId = params.advisorId as string;

  return (
    <RouteGuard requiredRole="advisor" requiredUserId={advisorId}>
      <DashboardShell>{children}</DashboardShell>
    </RouteGuard>
  );
} 