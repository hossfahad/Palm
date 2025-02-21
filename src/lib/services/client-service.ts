'use server';

import { prisma } from '@/lib/db';
import type { Client } from '@prisma/client';

export type CreateClientInput = {
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  advisorId: string;
  preferredContactMethod: string;
  relationshipStartDate: string;
  secondaryAdvisors: string[];
  causeAreas: string[];
};

export async function getClients() {
  try {
    return await prisma.client.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
    throw new Error('Failed to fetch clients');
  }
}

export async function getClientById(id: string) {
  try {
    const client = await prisma.client.findUnique({
      where: { id },
    });

    if (!client) {
      throw new Error('Client not found');
    }

    return client;
  } catch (error) {
    console.error('Error fetching client:', error);
    throw error;
  }
}

export async function createClient(data: CreateClientInput): Promise<Client> {
  try {
    return await prisma.client.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        status: data.status,
        advisorId: data.advisorId,
        preferredContactMethod: data.preferredContactMethod,
        relationshipStartDate: new Date(data.relationshipStartDate),
        secondaryAdvisors: data.secondaryAdvisors,
        causeAreas: data.causeAreas,
      },
    });
  } catch (error) {
    console.error('Error creating client:', error);
    throw error;
  }
}

export async function updateClient(id: string, data: Partial<CreateClientInput>): Promise<Client> {
  try {
    return await prisma.client.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.error('Error updating client:', error);
    throw error;
  }
}

export async function deleteClient(id: string): Promise<Client> {
  try {
    return await prisma.client.delete({
      where: { id },
    });
  } catch (error) {
    console.error('Error deleting client:', error);
    throw error;
  }
} 