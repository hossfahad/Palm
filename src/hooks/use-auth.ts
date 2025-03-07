import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

export type UserRole = 'advisor' | 'client';

interface UseAuthReturn {
  user: any | null;
  role: UserRole;
  userId: string | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<any | null>(null);
  const [role, setRole] = useState<UserRole>('client');
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          // Get user role and ID from profiles
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('role, id')
            .eq('user_id', user.id)
            .single();
          
          setRole(profile?.role as UserRole || 'client');
          setUserId(profile?.id || null);
        }
      } catch (error) {
        console.error('Error getting user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('role, id')
            .eq('user_id', session.user.id)
            .single();
          
          setRole(profile?.role as UserRole || 'client');
          setUserId(profile?.id || null);
        } else {
          setUser(null);
          setRole('client');
          setUserId(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  return {
    user,
    role,
    userId,
    isLoading,
    signOut,
  };
} 