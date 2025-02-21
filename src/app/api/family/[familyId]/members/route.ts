'use server';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface RouteParams {
  params: {
    familyId: string;
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const members = await prisma.user.findMany({
      where: {
        familyId: params.familyId,
      },
      orderBy: [
        { isHeadOfFamily: 'desc' },
        { firstName: 'asc' },
      ],
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error('Error fetching family members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch family members' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { memberId, role } = await request.json();

    const member = await prisma.user.update({
      where: { id: memberId },
      data: { role },
    });

    return NextResponse.json(member);
  } catch (error) {
    console.error('Error updating member role:', error);
    return NextResponse.json(
      { error: 'Failed to update member role' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { memberId } = await request.json();

    const member = await prisma.user.update({
      where: { id: memberId },
      data: { status: 'INACTIVE' },
    });

    return NextResponse.json(member);
  } catch (error) {
    console.error('Error removing member:', error);
    return NextResponse.json(
      { error: 'Failed to remove member' },
      { status: 500 }
    );
  }
} 