import { getUserById, updateUser } from '@/lib/services/user-service';
import type { UpdateUserInput } from '@/lib/services/user-service';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const session = await supabase.auth.getSession();

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await getUserById(params.id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error: any) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const session = await supabase.auth.getSession();

    // Check if user is authenticated and has permission
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const input = await request.json() as UpdateUserInput;
    const user = await updateUser(params.id, input);

    return NextResponse.json(user);
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const session = await supabase.auth.getSession();

    // Check if user is authenticated and has admin role
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Instead of actually deleting, we'll mark the user as inactive
    const user = await updateUser(params.id, {
      status: 'INACTIVE',
    });

    return NextResponse.json(user);
  } catch (error: any) {
    console.error('Error deactivating user:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
} 