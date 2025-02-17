'use client';

import { Stack, Title, Grid, SegmentedControl, Group } from '@mantine/core';
import { useState } from 'react';
import { MetricsGrid } from '@/components/dashboard/metrics-grid';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { ChartsSection } from '@/components/dashboard/charts-section';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { Loading } from '@/components/loading';
import { ErrorBoundary } from '@/components/error-boundary';

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const { data, isLoading, error } = useDashboardData(timeRange);

  if (error) {
    return <ErrorBoundary error={error} reset={() => window.location.reload()} />;
  }

  if (isLoading || !data) {
    return <Loading message="Loading dashboard data..." />;
  }

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={2}>Dashboard Overview</Title>
        <SegmentedControl
          value={timeRange}
          onChange={(value) => setTimeRange(value as typeof timeRange)}
          data={[
            { label: 'Day', value: 'day' },
            { label: 'Week', value: 'week' },
            { label: 'Month', value: 'month' },
            { label: 'Year', value: 'year' },
          ]}
        />
      </Group>

      <MetricsGrid data={data} />

      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <ChartsSection data={data} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <ActivityFeed activities={data.recentActivity} />
        </Grid.Col>
      </Grid>
    </Stack>
  );
} 