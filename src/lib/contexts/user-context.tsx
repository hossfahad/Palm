'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from './auth-context';
import { createClient } from '../supabase/client';

export type UserRole = 'advisor' | 'client';

export interface UserContextType {
  role: UserRole;
  clientId: string | null;
  clientName: string | null;
  enterClientView: (clientId: string, clientName: string) => Promise<void>;
  exitClientView: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { profile } = useAuth();
  const [clientId, setClientId] = useState<string | null>(null);
  const [clientName, setClientName] = useState<string | null>(null);
  const supabase = createClient();

  const enterClientView = async (id: string, name: string) => {
    if (profile?.role !== 'advisor') {
      throw new Error('Only advisors can enter client view');
    }

    // Verify that this advisor has access to this client
    const { data: client } = await supabase
      .from('user_profiles')
      .select('id, first_name, last_name')
      .eq('id', id)
      .eq('advisor_id', profile.id)
      .single();

    if (!client) {
      throw new Error('Client not found or access denied');
    }

    setClientId(id);
    setClientName(name);
  };

  const exitClientView = async () => {
    setClientId(null);
    setClientName(null);
  };

  return (
    <UserContext.Provider
      value={{
        role: clientId ? 'client' : (profile?.role || 'advisor'),
        clientId,
        clientName,
        enterClientView,
        exitClientView,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 