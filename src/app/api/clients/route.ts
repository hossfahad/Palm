import { NextResponse } from 'next/server';
import { clientService } from '@/lib/services/client-service';
import { z } from 'zod';

// Validation schema for creating/updating clients
const clientSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  dateOfBirth: z.string().datetime().optional().transform(val => val ? new Date(val) : undefined),
  preferredName: z.string().optional(),
  preferredPronouns: z.string().optional(),
  advisorId: z.string().uuid('Invalid advisor ID'),
  relationshipStartDate: z.string().datetime().transform(val => new Date(val)),
  firmClientId: z.string().optional(),
  secondaryAdvisors: z.array(z.string()),
  relationshipManager: z.string().optional(),
  causeAreas: z.array(z.string()),
  status: z.enum(['ACTIVE', 'PENDING', 'INACTIVE', 'ARCHIVED'])
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const client = await clientService.getClientById(id);
      if (!client) {
        return NextResponse.json(
          { error: 'Client not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(client);
    }

    const clients = await clientService.getClients();
    return NextResponse.json(clients);
  } catch (error) {
    console.error('Failed to fetch clients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate and transform request body
    const validatedData = clientSchema.parse(body);
    
    const client = await clientService.createClient(validatedData);
    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Failed to create client:', error);
    return NextResponse.json(
      { error: 'Failed to create client' },
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

    const body = await request.json();
    const validatedData = clientSchema.partial().parse(body);
    
    const client = await clientService.updateClient(id, validatedData);
    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(client);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Failed to update client:', error);
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

    const client = await clientService.deleteClient(id);
    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error('Failed to delete client:', error);
    return NextResponse.json(
      { error: 'Failed to delete client' },
      { status: 500 }
    );
  }
} 