import { NextResponse } from 'next/server';
import { ClientService } from '@/lib/services/client-service';
import { MinimumClientCreation } from '@/types/client';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const client = await ClientService.createClient(data as MinimumClientCreation);
    return NextResponse.json(client);
  } catch (error) {
    console.error('Error in POST /api/clients:', error);
    return NextResponse.json(
      { error: 'Failed to create client' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const client = await ClientService.getClient(id);
      if (!client) {
        return NextResponse.json(
          { error: 'Client not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(client);
    }

    const clients = await ClientService.getAllClients();
    return NextResponse.json(clients);
  } catch (error) {
    console.error('Error in GET /api/clients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Client ID is required' },
        { status: 400 }
      );
    }

    const data = await request.json();
    const client = await ClientService.updateClient(id, data);
    return NextResponse.json(client);
  } catch (error) {
    console.error('Error in PUT /api/clients:', error);
    return NextResponse.json(
      { error: 'Failed to update client' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Client ID is required' },
        { status: 400 }
      );
    }

    await ClientService.deleteClient(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/clients:', error);
    return NextResponse.json(
      { error: 'Failed to delete client' },
      { status: 500 }
    );
  }
} 