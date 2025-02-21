import { createFamilyInvitation, acceptFamilyInvitation } from '@/lib/services/user-service';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const input = await request.json();
    const invitation = await createFamilyInvitation({
      ...input,
      invitedBy: session.user.id,
    });

    // TODO: Send invitation email

    return NextResponse.json(invitation);
  } catch (error: any) {
    console.error('Error creating invitation:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { invitationId } = await request.json();
    const invitation = await acceptFamilyInvitation(
      invitationId,
      session.user.id
    );

    return NextResponse.json(invitation);
  } catch (error: any) {
    console.error('Error accepting invitation:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
} 