import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { withAuth } from '@/middleware/auth';
import { db } from '@/lib/db';
import { auditLogger } from '@/lib/audit-logger';
import { UserRole } from '@/types/auth';

interface RouteParams {
  params: {
    userId: string;
  };
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const authResponse = await withAuth(request, ['canManageUsers']);
  if (authResponse.status !== 200) {
    return authResponse;
  }

  try {
    const { role } = await request.json();
    const validRoles = Object.values(UserRole);

    if (!role || !validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    const user = await db.user.update({
      where: { id: params.userId },
      data: { role },
    });

    await auditLogger.logUserEvent(
      'role_change',
      user.id,
      role as UserRole,
      request,
      { previousRole: user.role, newRole: role }
    );

    return NextResponse.json(user);
  } catch (error) {
    console.error('Failed to update user role:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 