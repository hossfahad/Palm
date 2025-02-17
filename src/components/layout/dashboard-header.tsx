'use client';

import { Group } from '@mantine/core';
import { ClientSelector } from '@/components/client/client-selector';
import { ClientSummary } from '@/types/client';

interface DashboardHeaderProps {
  clients: ClientSummary[];
  selectedClientId: string | null;
  onClientChange: (clientId: string) => void;
  onAddClient: (name: string, email: string) => Promise<void>;
}

export function DashboardHeader({
  clients,
  selectedClientId,
  onClientChange,
  onAddClient,
}: DashboardHeaderProps) {
  return (
    <Group justify="flex-end" p="md">
      <ClientSelector
        clients={clients}
        selectedClientId={selectedClientId}
        onClientChange={onClientChange}
        onAddClient={onAddClient}
      />
    </Group>
  );
} 