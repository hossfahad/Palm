'use server';

import { NextResponse } from 'next/server';
import { createUser, updateUser } from '@/lib/services/user-service';
import type { UserRole } from '@/lib/services/user-service';

export async function POST(request: Request) {
  try {
    const { email, firstName, lastName, role, familyId } = await request.json();

    // Create a new user with pending status
    const user = await createUser({
      email,
      firstName,
      lastName,
      role: role as UserRole,
      familyId,
      isHeadOfFamily: false,
    });

    // TODO: Send invitation email

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error creating invitation:', error);
    return NextResponse.json(
      { error: 'Failed to create invitation' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { invitationId, accept } = await request.json();

    const user = await updateUser(invitationId, {
      status: accept ? 'ACTIVE' : 'INACTIVE',
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error handling invitation:', error);
    return NextResponse.json(
      { error: 'Failed to handle invitation' },
      { status: 500 }
    );
  }
} 