'use server';

import { db } from '@/lib/db';
import { clients, userStatuses } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import type { UserStatus } from './user-service';

export type CreateClientInput = {
  firstName: string;
  lastName: string;
  email: string;
  status: UserStatus;
  advisorId: string;
  preferredContactMethod: string;
  relationshipStartDate: string;
  secondaryAdvisors: string[];
  causeAreas: string[];
};

export type UpdateClientInput = Omit<Partial<CreateClientInput>, 'relationshipStartDate'> & {
  relationshipStartDate?: string;
};

export async function getClients() {
  try {
    return await db.select().from(clients).orderBy(clients.createdAt);
  } catch (error) {
    console.error('Error fetching clients:', error);
    throw new Error('Failed to fetch clients');
  }
}

export async function getClientById(id: string) {
  try {
    const [client] = await db
      .select()
      .from(clients)
      .where(eq(clients.id, id))
      .limit(1);

    if (!client) {
      throw new Error('Client not found');
    }

    return client;
  } catch (error) {
    console.error('Error fetching client:', error);
    throw error;
  }
}

export async function createClient(data: CreateClientInput) {
  try {
    const [client] = await db
      .insert(clients)
      .values({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        status: data.status,
        advisorId: data.advisorId,
        preferredContactMethod: data.preferredContactMethod,
        relationshipStartDate: new Date(data.relationshipStartDate),
        secondaryAdvisors: data.secondaryAdvisors,
        causeAreas: data.causeAreas,
      })
      .returning();

    return client;
  } catch (error) {
    console.error('Error creating client:', error);
    throw error;
  }
}

export async function updateClient(id: string, data: UpdateClientInput) {
  try {
    const { relationshipStartDate, ...rest } = data;
    
    const [client] = await db
      .update(clients)
      .set({
        ...rest,
        ...(relationshipStartDate && {
          relationshipStartDate: new Date(relationshipStartDate),
        }),
        updatedAt: new Date(),
      })
      .where(eq(clients.id, id))
      .returning();

    return client;
  } catch (error) {
    console.error('Error updating client:', error);
    throw error;
  }
}

export async function deleteClient(id: string) {
  try {
    const [client] = await db
      .delete(clients)
      .where(eq(clients.id, id))
      .returning();

    return client;
  } catch (error) {
    console.error('Error deleting client:', error);
    throw error;
  }
} 