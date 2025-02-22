'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole } from '@/hooks/use-auth';
import { LoadingScreen } from '@/components/loading-screen';

interface RouteGuardProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requiredUserId?: string;
}

export function RouteGuard({ children, requiredRole, requiredUserId }: RouteGuardProps) {
  const { user, role, userId, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/auth/login');
      } else if (requiredRole && role !== requiredRole) {
        router.push('/dashboard');
      } else if (requiredUserId && userId !== requiredUserId) {
        router.push(`/${role}/${userId}/dashboard`);
      }
    }
  }, [user, role, userId, isLoading, router, requiredRole, requiredUserId]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user || (requiredRole && role !== requiredRole) || (requiredUserId && userId !== requiredUserId)) {
    return null;
  }

  return <>{children}</>;
} 