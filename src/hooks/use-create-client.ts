import { useState } from 'react';
import { CreateClientInput } from '@/lib/validations/client';

interface UseCreateClientReturn {
  isLoading: boolean;
  error: string | null;
  createClient: (data: CreateClientInput) => Promise<void>;
}

export function useCreateClient(): UseCreateClientReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createClient = async (data: CreateClientInput) => {
    setIsLoading(true);
    setError(null);

    try {
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

      await response.json();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    createClient,
  };
} 