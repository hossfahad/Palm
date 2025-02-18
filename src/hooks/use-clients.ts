import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateClientInput } from '@/lib/validations/client';

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: 'ACTIVE' | 'PENDING' | 'INACTIVE' | 'ARCHIVED';
  preferredName?: string;
  advisorId: string;
  relationshipStartDate: string;
  dafs: number;
  totalValue: number;
  lastActivity: string;
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
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create client');
  }

  return response.json();
}

async function deleteClient(id: string): Promise<void> {
  const response = await fetch(`/api/clients?id=${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete client');
  }
}

export function useClients() {
  const queryClient = useQueryClient();

  const { data: clients = [], isLoading, error } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients,
  });

  const { mutate: addClient, isPending: isCreating } = useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  const { mutate: removeClient, isPending: isDeleting } = useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  return {
    clients,
    isLoading,
    error,
    addClient,
    isCreating,
    deleteClient: removeClient,
    isDeleting,
  };
} 