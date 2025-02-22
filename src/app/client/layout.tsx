import { RouteGuard } from '@/components/auth/route-guard';
import { DashboardShell } from '@/components/layout/dashboard-shell';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard requiredRole="client">
      <DashboardShell>{children}</DashboardShell>
    </RouteGuard>
  );
} 