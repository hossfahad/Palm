import { NextResponse } from 'next/server';
import { clientService } from '@/lib/services/client-service';

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Client ID is required' },
        { status: 400 }
      );
    }

    const client = await clientService.archiveClient(id);
    return NextResponse.json(client);
  } catch (error) {
    console.error('Error archiving client:', error);

    if (error instanceof Error && error.message === 'Client not found') {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to archive client' },
      { status: 500 }
    );
  }
} 