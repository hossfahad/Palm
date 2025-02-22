import { RouteGuard } from '@/components/auth/route-guard';
import { DashboardShell } from '@/components/layout/dashboard-shell';

export default function AdvisorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard requiredRole="advisor">
      <DashboardShell>{children}</DashboardShell>
    </RouteGuard>
  );
} 