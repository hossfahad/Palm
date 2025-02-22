'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { User, UserProfile } from '../db/schema';
import { v4 as uuidv4 } from 'uuid';

interface CreateAdvisorData extends Partial<UserProfile> {
  email: string;
  firstName: string;
  lastName: string;
}

export const advisorService = {
  async getAdvisors() {
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
        user:users(*),
        clients:user_profiles!advisor_id(id, firstName, lastName)
      `)
      .eq('role', 'advisor');

    if (error) throw error;
    return profiles;
  },

  async getAdvisorById(id: string) {
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
        clients:user_profiles!advisor_id(
          id,
          firstName,
          lastName,
          daf_accounts(*)
        )
      `)
      .eq('id', id)
      .eq('role', 'advisor')
      .single();

    if (error) throw error;
    return profile;
  },

  async createAdvisor(data: CreateAdvisorData) {
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

    // Generate a UUID for the profile
    const profileId = uuidv4();

    // Then create the profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: profileId,
        userId: userData.user.id,
        role: 'advisor',
        firstName: data.firstName,
        lastName: data.lastName,
      })
      .select()
      .single();

    if (profileError) throw profileError;
    return profile;
  },

  async updateAdvisor(id: string, data: Partial<UserProfile>) {
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

  async deleteAdvisor(id: string) {
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