import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Client } from '@/lib/services/client-service';

const API_URL = '/api/clients';

export function useClients() {
  const queryClient = useQueryClient();

  const { data: clients, isLoading, error } = useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data } = await axios.get(API_URL);
      return data;
    }
  });

  const createClient = useMutation({
    mutationFn: async (newClient: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
      const { data } = await axios.post(API_URL, newClient);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    }
  });

  const updateClient = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Omit<Client, 'id' | 'createdAt' | 'updatedAt'>> }) => {
      const { data: updatedClient } = await axios.put(`${API_URL}?id=${id}`, data);
      return updatedClient;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    }
  });

  const deleteClient = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.delete(`${API_URL}?id=${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    }
  });

  return {
    clients,
    isLoading,
    error,
    createClient,
    updateClient,
    deleteClient
  };
} 