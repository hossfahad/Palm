'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

interface CreateClientData {
  firstName: string;
  lastName: string;
  email: string;
  status: 'ACTIVE' | 'PENDING' | 'INACTIVE' | 'ARCHIVED';
  advisorId: string;
}

function createAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      cookies: {
        get(name: string) {
          return cookies().get(name)?.value;
        },
      },
    }
  );
}

function createAuthClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookies().get(name)?.value;
        },
      },
    }
  );
}

export const clientService = {
  async getClients() {
    const supabase = createAuthClient();

    // Get the current user's profile
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get the advisor's profile
    const { data: advisorProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!advisorProfile || advisorProfile.role !== 'advisor') {
      throw new Error('Not authorized');
    }

    // Get all clients for this advisor
    const { data: profiles, error } = await supabase
      .from('user_profiles')
      .select(`
        *,
        user:users(*)
      `)
      .eq('role', 'client')
      .eq('advisor_id', advisorProfile.id);

    if (error) throw error;
    return profiles;
  },

  async getClientById(id: string) {
    const supabase = createAuthClient();

    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select(`
        *,
        user:users(*),
        daf_accounts(*)
      `)
      .eq('id', id)
      .eq('role', 'client')
      .single();

    if (error) throw error;
    return profile;
  },

  async createClient(data: CreateClientData) {
    const authClient = createAuthClient();
    const adminClient = createAdminClient();

    // Get the current user's profile to verify they are an advisor
    const { data: { user } } = await authClient.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: advisorProfile } = await authClient
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!advisorProfile || advisorProfile.role !== 'advisor') {
      throw new Error('Not authorized');
    }

    // Create the client user with admin client
    const { data: userData, error: userError } = await adminClient.auth.admin.createUser({
      email: data.email,
      password: Math.random().toString(36).slice(-8), // Generate random password
      email_confirm: true,
      user_metadata: {
        firstName: data.firstName,
        lastName: data.lastName,
      }
    });

    if (userError) throw userError;

    // Create the client profile with admin client
    const { data: profile, error: profileError } = await adminClient
      .from('user_profiles')
      .insert({
        id: userData.user.id,
        role: 'client',
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        advisor_id: data.advisorId,
        status: data.status,
      })
      .select()
      .single();

    if (profileError) throw profileError;
    return profile;
  },

  async updateClient(id: string, data: Partial<CreateClientData>) {
    const supabase = createAuthClient();

    const updateData = {
      ...(data.firstName && { first_name: data.firstName }),
      ...(data.lastName && { last_name: data.lastName }),
      ...(data.email && { email: data.email }),
      ...(data.status && { status: data.status }),
      ...(data.advisorId && { advisor_id: data.advisorId }),
    };

    const { data: profile, error } = await supabase
      .from('user_profiles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return profile;
  },

  async deleteClient(id: string) {
    const authClient = createAuthClient();
    const adminClient = createAdminClient();

    // Get the user ID first
    const { data: profile, error: profileError } = await authClient
      .from('user_profiles')
      .select('userId')
      .eq('id', id)
      .single();

    if (profileError) throw profileError;

    // Delete the profile
    const { error: deleteProfileError } = await authClient
      .from('user_profiles')
      .delete()
      .eq('id', id);

    if (deleteProfileError) throw deleteProfileError;

    // Delete the user with admin client
    const { error: deleteUserError } = await adminClient.auth.admin.deleteUser(
      profile.userId
    );

    if (deleteUserError) throw deleteUserError;
  },
}; 