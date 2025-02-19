import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Client {
  dafs: number;
  totalValue: number;
  lastActivity: string;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: 'ACTIVE' | 'PENDING' | 'INACTIVE' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
  preferredName?: string;
  preferredPronouns?: string;
  preferredContactMethod: 'email' | 'phone' | 'mail';
  timeZone?: string;
  advisorId: string;
  relationshipStartDate: string;
  causeAreas: string[];
}

export interface CreateClientInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  preferredName?: string;
  preferredPronouns?: string;
  preferredContactMethod: 'email' | 'phone' | 'mail';
  timeZone?: string;
  advisorId: string;
  causeAreas: string[];
}

async function fetchClients(): Promise<Client[]> {
  const response = await fetch('/api/clients');
  if (!response.ok) {
    throw new Error('Failed to fetch clients');
  }
  return response.json();
}

async function createClient(data: CreateClientInput): Promise<Client> {
  const response = await fetch('/api/clients', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create client');
  }

  return response.json();
}

async function updateClient({ id, data }: { id: string; data: Partial<Client> }): Promise<Client> {
  const response = await fetch(`/api/clients?id=${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update client');
  }

  return response.json();
}

async function deleteClient(id: string): Promise<void> {
  const response = await fetch(`/api/clients?id=${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete client');
  }
}

async function archiveClient(id: string): Promise<Client> {
  const response = await fetch(`/api/clients/archive?id=${id}`, {
    method: 'POST',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to archive client');
  }

  return response.json();
}

export function useClients() {
  const queryClient = useQueryClient();

  const { data: clients = [], isLoading, error, refetch } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients,
  });

  const createClientMutation = useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  const updateClientMutation = useMutation({
    mutationFn: updateClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  const deleteClientMutation = useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  const archiveClientMutation = useMutation({
    mutationFn: archiveClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  return {
    clients,
    isLoading,
    error,
    refetch,
    createClient: createClientMutation.mutate,
    isCreating: createClientMutation.isPending,
    updateClient: updateClientMutation.mutate,
    isUpdating: updateClientMutation.isPending,
    deleteClient: deleteClientMutation.mutate,
    isDeleting: deleteClientMutation.isPending,
    archiveClient: archiveClientMutation.mutate,
    isArchiving: archiveClientMutation.isPending,
  };
} 