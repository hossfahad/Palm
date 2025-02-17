'use client';

import { Group, Paper, Stack, Text } from '@mantine/core';
import { IconTrendingUp, IconTrendingDown } from '@tabler/icons-react';
import { formatCurrency } from '@/lib/utils/format';

interface StatsWidgetProps {
  data?: {
    totalDonations: number;
    donationGrowth: number;
    activeDAFs: number;
    pendingGrants: number;
  };
}

export function StatsWidget({ data }: StatsWidgetProps) {
  const mockData = {
    totalDonations: 1250000,
    donationGrowth: 12.5,
    activeDAFs: 45,
    pendingGrants: 8,
  };

  const stats = data || mockData;
  const isPositive = stats.donationGrowth > 0;
  const Icon = isPositive ? IconTrendingUp : IconTrendingDown;

  return (
    <Group grow>
      <Paper p="md" radius="md" withBorder>
        <Stack gap="xs">
          <Text size="sm" c="dimmed">Total Donations</Text>
          <Group justify="space-between" align="flex-end">
            <Text size="xl" fw={700}>{formatCurrency(stats.totalDonations)}</Text>
            <Group gap="xs" c={isPositive ? 'green' : 'red'}>
              <Icon size={20} stroke={1.5} />
              <Text size="sm" fw={500}>{Math.abs(stats.donationGrowth)}%</Text>
            </Group>
          </Group>
        </Stack>
      </Paper>

      <Paper p="md" radius="md" withBorder>
        <Stack gap="xs">
          <Text size="sm" c="dimmed">Active DAFs</Text>
          <Text size="xl" fw={700}>{stats.activeDAFs}</Text>
        </Stack>
      </Paper>

      <Paper p="md" radius="md" withBorder>
        <Stack gap="xs">
          <Text size="sm" c="dimmed">Pending Grants</Text>
          <Text size="xl" fw={700}>{stats.pendingGrants}</Text>
        </Stack>
      </Paper>
    </Group>
  );
} 