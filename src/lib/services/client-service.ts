'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { User, UserProfile } from '../db/schema';

interface CreateClientData extends Partial<UserProfile> {
  email: string;
}

export const clientService = {
  async getClients() {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const { data: profiles, error } = await supabase
      .from('user_profiles')
      .select(`
        *,
        user:users(*)
      `)
      .eq('role', 'client');

    if (error) throw error;
    return profiles;
  },

  async getClientById(id: string) {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

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
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // First create the user
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email: data.email,
      password: Math.random().toString(36).slice(-8), // Generate random password
      email_confirm: true,
    });

    if (userError) throw userError;

    // Then create the profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        ...data,
        userId: userData.user.id,
        role: 'client',
      })
      .select()
      .single();

    if (profileError) throw profileError;
    return profile;
  },

  async updateClient(id: string, data: Partial<UserProfile>) {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const { data: profile, error } = await supabase
      .from('user_profiles')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return profile;
  },

  async deleteClient(id: string) {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // Get the user ID first
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('userId')
      .eq('id', id)
      .single();

    if (profileError) throw profileError;

    // Delete the profile
    const { error: deleteProfileError } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', id);

    if (deleteProfileError) throw deleteProfileError;

    // Delete the user
    const { error: deleteUserError } = await supabase.auth.admin.deleteUser(
      profile.userId
    );

    if (deleteUserError) throw deleteUserError;
  },
}; 