import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { withAuth } from '@/middleware/auth';
import { db } from '@/lib/db';
import { auditLogger } from '@/lib/audit-logger';

export async function GET(request: NextRequest) {
  // Check if user has permission to view users
  const authResponse = await withAuth(request, ['canManageUsers']);
  if (authResponse.status !== 200) {
    return authResponse;
  }

  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        has2FAEnabled: true,
      },
      orderBy: {
        email: 'asc',
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Check if user has permission to create users
  const authResponse = await withAuth(request, ['canManageUsers']);
  if (authResponse.status !== 200) {
    return authResponse;
  }

  try {
    const { clerkId, email, role } = await request.json();

    if (!clerkId || !email || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const user = await db.user.create({
      data: {
        clerkId,
        email,
        role,
      },
    });

    // Log the user creation
    await auditLogger.logUserEvent(
      'user_created',
      user.id,
      role,
      request,
      { email }
    );

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Failed to create user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 