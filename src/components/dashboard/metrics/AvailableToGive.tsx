'use client';

import { Paper, Title, Text, Tooltip, Group } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { formatCurrency } from '@/lib/utils';

interface AvailableBalanceData {
  totalBalance: number;
  pendingGrants: number;
  availableToGive: number;
}

export default function AvailableToGive() {
  const supabase = createClientComponentClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['availableBalance'],
    queryFn: async (): Promise<AvailableBalanceData> => {
      // Get total balance from DAF accounts
      const { data: accounts, error: accountsError } = await supabase
        .from('daf_accounts')
        .select('current_balance');

      if (accountsError) throw accountsError;

      const totalBalance = accounts.reduce(
        (sum, account) => sum + Number(account.current_balance),
        0
      );

      // Get pending grants
      const { data: pendingGrants, error: grantsError } = await supabase
        .from('grants')
        .select('amount')
        .eq('status', 'pending');

      if (grantsError) throw grantsError;

      const pendingGrantsTotal = pendingGrants.reduce(
        (sum, grant) => sum + Number(grant.amount),
        0
      );

      const availableToGive = totalBalance - pendingGrantsTotal;

      return {
        totalBalance,
        pendingGrants: pendingGrantsTotal,
        availableToGive,
      };
    },
  });

  if (isLoading) {
    return (
      <Paper shadow="xs" p="xl" radius="md">
        <Text>Loading...</Text>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper shadow="xs" p="xl" radius="md">
        <Text c="red">Error loading available balance</Text>
      </Paper>
    );
  }

  const isLowBalance = data && data.availableToGive < data.totalBalance * 0.1;

  return (
    <Paper shadow="xs" p="xl" radius="md">
      <Group justify="space-between" mb="xs">
        <Title order={3}>Available to Give</Title>
        <Tooltip
          label="Total balance minus pending grants"
          position="top-end"
          multiline
          w={200}
        >
          <IconInfoCircle size={20} style={{ cursor: 'pointer' }} />
        </Tooltip>
      </Group>

      <Text
        size="xl"
        fw={700}
        c={isLowBalance ? 'red' : 'blue'}
      >
        {formatCurrency(data?.availableToGive || 0)}
      </Text>

      <Group gap="xs" mt="md">
        <Text size="sm" c="dimmed">
          Total Balance:
        </Text>
        <Text size="sm" fw={500}>
          {formatCurrency(data?.totalBalance || 0)}
        </Text>
      </Group>

      <Group gap="xs" mt="xs">
        <Text size="sm" c="dimmed">
          Pending Grants:
        </Text>
        <Text size="sm" fw={500}>
          {formatCurrency(data?.pendingGrants || 0)}
        </Text>
      </Group>
    </Paper>
  );
} 