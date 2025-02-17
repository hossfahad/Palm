import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { rolePermissions, type UserPermissions, type AuthUser } from '@/types/auth';

const MAX_FAILED_ATTEMPTS = 5;
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export async function withAuth(
  request: NextRequest,
  requiredPermissions: (keyof UserPermissions)[] = []
) {
  try {
    const { userId, sessionId } = getAuth(request);
    
    if (!userId || !sessionId) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    // Get user data from your database using userId
    const response = await fetch(`/api/users/${userId}`);
    const user = (await response.json()) as AuthUser;

    // Check session expiry
    if (Date.now() > user.sessionExpiry) {
      return NextResponse.redirect(new URL('/sign-in?expired=true', request.url));
    }

    // Check failed login attempts
    if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
      return NextResponse.redirect(new URL('/account-locked', request.url));
    }

    // Check if password reset is required
    if (user.requiresPasswordReset) {
      return NextResponse.redirect(new URL('/reset-password', request.url));
    }

    // Check 2FA requirement for sensitive operations
    const requires2FA = requiredPermissions.some(permission => 
      ['canManageUsers', 'canManageRoles', 'canApproveGrants'].includes(permission)
    );

    if (requires2FA && !user.has2FAEnabled) {
      return NextResponse.redirect(new URL('/setup-2fa', request.url));
    }

    // Check role-based permissions
    const userPermissions = rolePermissions[user.role];
    const hasRequiredPermissions = requiredPermissions.every(
      permission => userPermissions[permission]
    );

    if (!hasRequiredPermissions) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Update session expiry
    await fetch(`/api/users/${userId}/session`, {
      method: 'PATCH',
      body: JSON.stringify({ 
        sessionExpiry: Date.now() + SESSION_TIMEOUT 
      }),
    });

    return NextResponse.next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return NextResponse.redirect(new URL('/error', request.url));
  }
}

// Middleware configuration
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/:path*',
  ],
}; 