'use client';

import { Grid, Paper, Stack, Text, Group } from '@mantine/core';
import { IconTrendingUp, IconTrendingDown } from '@tabler/icons-react';
import { formatCurrency } from '@/lib/utils/format';
import { DashboardMetrics } from '@/types/dashboard';

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: number;
  loading?: boolean;
}

function MetricCard({ label, value, change, loading }: MetricCardProps) {
  const isPositive = change && change > 0;
  const changeColor = isPositive ? 'green' : 'red';
  const Icon = isPositive ? IconTrendingUp : IconTrendingDown;

  return (
    <Paper p="md" radius="md" withBorder>
      <Stack gap="xs">
        <Text size="sm" c="dimmed">
          {label}
        </Text>
        <Group justify="space-between" align="flex-end">
          <Text size="xl" fw={700}>
            {value}
          </Text>
          {change && (
            <Group gap="xs" c={changeColor}>
              <Icon size={20} stroke={1.5} />
              <Text size="sm" fw={500}>
                {Math.abs(change)}%
              </Text>
            </Group>
          )}
        </Group>
      </Stack>
    </Paper>
  );
}

interface MetricsGridProps {
  data: DashboardMetrics;
  loading?: boolean;
}

export function MetricsGrid({ data, loading }: MetricsGridProps) {
  return (
    <Grid>
      <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
        <MetricCard
          label="Total Donations"
          value={formatCurrency(data.totalDonations)}
          change={data.metrics.donationGrowth}
          loading={loading}
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
        <MetricCard
          label="Active DAFs"
          value={data.activeDAFs}
          loading={loading}
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
        <MetricCard
          label="Pending Grants"
          value={data.pendingGrants}
          loading={loading}
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
        <MetricCard
          label="Average Grant"
          value={formatCurrency(data.metrics.averageGrant)}
          loading={loading}
        />
      </Grid.Col>
    </Grid>
  );
} 