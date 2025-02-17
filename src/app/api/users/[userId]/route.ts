import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { withAuth } from '@/middleware/auth';
import { db } from '@/lib/db';
import { auditLogger } from '@/lib/audit-logger';

interface RouteParams {
  params: {
    userId: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const authResponse = await withAuth(request, ['canManageUsers']);
  if (authResponse.status !== 200) {
    return authResponse;
  }

  try {
    const user = await db.user.findUnique({
      where: { id: params.userId },
      select: {
        id: true,
        email: true,
        role: true,
        has2FAEnabled: true,
        failedLoginAttempts: true,
        sessionExpiry: true,
        requiresPasswordReset: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const authResponse = await withAuth(request, ['canManageUsers']);
  if (authResponse.status !== 200) {
    return authResponse;
  }

  try {
    const updates = await request.json();
    const user = await db.user.update({
      where: { id: params.userId },
      data: updates,
    });

    await auditLogger.logUserEvent(
      'user_updated',
      user.id,
      user.role,
      request,
      updates
    );

    return NextResponse.json(user);
  } catch (error) {
    console.error('Failed to update user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const authResponse = await withAuth(request, ['canManageUsers']);
  if (authResponse.status !== 200) {
    return authResponse;
  }

  try {
    const user = await db.user.delete({
      where: { id: params.userId },
    });

    await auditLogger.logUserEvent(
      'user_deleted',
      user.id,
      user.role,
      request,
      { email: user.email }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 