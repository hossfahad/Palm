'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole } from '@/hooks/use-auth';
import { LoadingScreen } from '@/components/loading-screen';

interface RouteGuardProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export function RouteGuard({ children, requiredRole }: RouteGuardProps) {
  const { user, role, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/auth/login');
      } else if (requiredRole && role !== requiredRole) {
        router.push('/dashboard');
      }
    }
  }, [user, role, isLoading, router, requiredRole]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user || (requiredRole && role !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
} 