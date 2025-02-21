import { NextResponse } from 'next/server';
import { UserService, CreateUserInput, UpdateUserInput } from '@/lib/services/user-service';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const session = await supabase.auth.getSession();

    // Check if user is authenticated and has admin/advisor role
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const input = await request.json() as CreateUserInput;
    const user = await UserService.createUser(input);

    return NextResponse.json(user);
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}

export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const familyId = searchParams.get('familyId');

    let users;
    if (email) {
      users = await UserService.getUserByEmail(email);
    } else if (familyId) {
      users = await UserService.getFamilyMembers(familyId);
    } else {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    return NextResponse.json(users);
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
} 