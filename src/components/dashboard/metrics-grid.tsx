'use client';

import { Grid, Paper, Text, Group, Stack, ThemeIcon } from '@mantine/core';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react';
import { formatCurrency } from '@/lib/utils/format';

interface MetricsGridProps {
  data: {
    totalDonations: number;
    activeDAFs: number;
    pendingGrants: number;
    metrics: {
      donationGrowth: number;
      averageGrant: number;
      totalImpact: number;
    };
  };
  loading: boolean;
}

export function MetricsGrid({ data, loading }: MetricsGridProps) {
  const metrics = [
    {
      title: 'Total Donations',
      value: formatCurrency(data.totalDonations),
      change: data.metrics.donationGrowth,
      changeLabel: 'from last month',
    },
    {
      title: 'Active DAFs',
      value: data.activeDAFs,
      suffix: 'accounts',
    },
    {
      title: 'Pending Grants',
      value: data.pendingGrants,
      suffix: 'requests',
    },
    {
      title: 'Average Grant',
      value: formatCurrency(data.metrics.averageGrant),
    },
  ];

  return (
    <Grid gutter="xl">
      {metrics.map((metric, index) => (
        <Grid.Col key={index} span={{ base: 12, xs: 6, md: 3 }}>
          <Paper withBorder p="lg" radius="md" h="100%">
            <Stack gap="md" justify="space-between" h="100%">
              <Text size="sm" c="dimmed" tt="uppercase" fw={500}>
                {metric.title}
              </Text>
              
              <Stack gap="xs">
                <Group justify="space-between" align="flex-end" wrap="nowrap">
                  <Text size="xl" fw={700} style={{ lineHeight: 1 }}>
                    {metric.value}
                  </Text>
                  {metric.suffix && (
                    <Text size="sm" c="dimmed">
                      {metric.suffix}
                    </Text>
                  )}
                </Group>

                {metric.change && (
                  <Group gap="xs" wrap="nowrap">
                    <ThemeIcon
                      color={metric.change > 0 ? 'teal' : 'red'}
                      variant="light"
                      size="sm"
                      radius="sm"
                    >
                      {metric.change > 0 ? (
                        <IconArrowUpRight size={16} stroke={1.5} />
                      ) : (
                        <IconArrowDownRight size={16} stroke={1.5} />
                      )}
                    </ThemeIcon>
                    <Text size="sm" c={metric.change > 0 ? 'teal' : 'red'}>
                      {Math.abs(metric.change)}%
                    </Text>
                    {metric.changeLabel && (
                      <Text size="sm" c="dimmed" truncate>
                        {metric.changeLabel}
                      </Text>
                    )}
                  </Group>
                )}
              </Stack>
            </Stack>
          </Paper>
        </Grid.Col>
      ))}
    </Grid>
  );
} 