'use server';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email, firstName, lastName, role, familyId } = await request.json();

    // Create a new user with pending status
    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        role,
        familyId,
        status: 'PENDING',
      },
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

    if (accept) {
      const user = await prisma.user.update({
        where: { id: invitationId },
        data: { status: 'ACTIVE' },
      });

      return NextResponse.json(user);
    } else {
      const user = await prisma.user.update({
        where: { id: invitationId },
        data: { status: 'INACTIVE' },
      });

      return NextResponse.json(user);
    }
  } catch (error) {
    console.error('Error handling invitation:', error);
    return NextResponse.json(
      { error: 'Failed to handle invitation' },
      { status: 500 }
    );
  }
} 