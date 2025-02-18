import { NextResponse } from 'next/server';
import { clientService } from '@/lib/services/client-service';
import { z } from 'zod';
import { createClientSchema } from '@/lib/validations/client';
import { ZodError } from 'zod';

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

// Validation schema for updating clients
const updateClientSchema = createClientSchema.partial();

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
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = createClientSchema.parse(body);

    // Transform date strings to Date objects
    const clientData = {
      ...validatedData,
      dateOfBirth: validatedData.dateOfBirth ? new Date(validatedData.dateOfBirth) : undefined,
      relationshipStartDate: new Date(validatedData.relationshipStartDate),
    };

    const client = await clientService.createClient(clientData);
    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error('Error creating client:', error);
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

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
    const validatedData = updateClientSchema.parse(body);

    // Transform date strings to Date objects if they exist
    const updateData = {
      ...validatedData,
      dateOfBirth: validatedData.dateOfBirth ? new Date(validatedData.dateOfBirth) : undefined,
      relationshipStartDate: validatedData.relationshipStartDate ? new Date(validatedData.relationshipStartDate) : undefined,
    };

    const updatedClient = await clientService.updateClient(id, updateData);
    return NextResponse.json(updatedClient);
  } catch (error) {
    console.error('Error updating client:', error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message === 'Client not found') {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

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

    await clientService.deleteClient(id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting client:', error);

    if (error instanceof Error && error.message === 'Client not found') {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete client' },
      { status: 500 }
    );
  }
} 