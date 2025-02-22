'use client';

import { Paper, Title, Text, Group, Progress, Stack, Button } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { formatCurrency } from '@/lib/utils';

interface AssetAllocationData {
  cash: { amount: number; percentage: number };
  publicEquity: { amount: number; percentage: number };
  fixedIncome: { amount: number; percentage: number };
  alternative: { amount: number; percentage: number };
}

const assetColors = {
  cash: 'blue',
  publicEquity: 'green',
  fixedIncome: 'yellow',
  alternative: 'grape',
} as const;

export default function AssetAllocation() {
  const supabase = createClientComponentClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['assetAllocation'],
    queryFn: async (): Promise<AssetAllocationData> => {
      const { data: holdings, error: holdingsError } = await supabase
        .from('holdings')
        .select('asset_type, amount');

      if (holdingsError) throw holdingsError;

      const totals = {
        cash: 0,
        publicEquity: 0,
        fixedIncome: 0,
        alternative: 0,
      };

      holdings.forEach((holding) => {
        totals[holding.asset_type as keyof typeof totals] += Number(holding.amount);
      });

      const total = Object.values(totals).reduce((sum, amount) => sum + amount, 0);

      return {
        cash: {
          amount: totals.cash,
          percentage: (totals.cash / total) * 100,
        },
        publicEquity: {
          amount: totals.publicEquity,
          percentage: (totals.publicEquity / total) * 100,
        },
        fixedIncome: {
          amount: totals.fixedIncome,
          percentage: (totals.fixedIncome / total) * 100,
        },
        alternative: {
          amount: totals.alternative,
          percentage: (totals.alternative / total) * 100,
        },
      };
    },
  });

  const handleExport = () => {
    if (!data) return;

    const csvContent = `Asset Type,Amount,Percentage
Cash,${data.cash.amount},${data.cash.percentage.toFixed(2)}%
Public Equity,${data.publicEquity.amount},${data.publicEquity.percentage.toFixed(2)}%
Fixed Income,${data.fixedIncome.amount},${data.fixedIncome.percentage.toFixed(2)}%
Alternative,${data.alternative.amount},${data.alternative.percentage.toFixed(2)}%`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'asset_allocation.csv';
    link.click();
  };

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
        <Text c="red">Error loading asset allocation</Text>
      </Paper>
    );
  }

  return (
    <Paper shadow="xs" p="xl" radius="md">
      <Group justify="space-between" mb="lg">
        <Title order={3}>Asset Allocation</Title>
        <Button
          variant="light"
          size="xs"
          leftSection={<IconDownload size={16} />}
          onClick={handleExport}
        >
          Export
        </Button>
      </Group>

      <Stack gap="md">
        {data && Object.entries(data).map(([type, { amount, percentage }]) => (
          <div key={type}>
            <Group justify="space-between" mb="xs">
              <Text size="sm" fw={500}>
                {type.replace(/([A-Z])/g, ' $1').trim()}
              </Text>
              <Group gap="xs">
                <Text size="sm" c="dimmed">
                  {formatCurrency(amount)}
                </Text>
                <Text size="sm" fw={500}>
                  {percentage.toFixed(1)}%
                </Text>
              </Group>
            </Group>
            <Progress
              value={percentage}
              color={assetColors[type as keyof typeof assetColors]}
              size="sm"
              radius="xl"
            />
          </div>
        ))}
      </Stack>
    </Paper>
  );
} 