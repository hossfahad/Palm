'use client';

import { Grid } from '@mantine/core';
import { TrendChart } from '@/components/charts/trend-chart';
import { DistributionChart } from '@/components/charts/distribution-chart';
import { BarChart } from '@/components/charts/bar-chart';
import { DashboardData } from '@/types/dashboard';

interface ChartsSectionProps {
  data: DashboardData;
}

export function ChartsSection({ data }: ChartsSectionProps) {
  return (
    <Grid>
      {/* Giving Trends */}
      <Grid.Col span={{ base: 12, md: 8 }}>
        <TrendChart
          title="Giving Trends"
          data={data.trendData.donations}
          categories={['donations', 'grants', 'impact']}
        />
      </Grid.Col>

      {/* Cause Distribution */}
      <Grid.Col span={{ base: 12, md: 4 }}>
        <DistributionChart
          title="Cause Distribution"
          data={data.causeDistribution.map(({ cause, amount, percentage }) => ({
            name: cause,
            value: amount,
            percentage,
          }))}
        />
      </Grid.Col>

      {/* Grant Allocation */}
      <Grid.Col span={12}>
        <BarChart
          title="Grant Allocation by Category"
          data={data.causeDistribution.map(({ cause, amount }) => ({
            name: cause,
            value: amount,
          }))}
          vertical
          height={400}
        />
      </Grid.Col>
    </Grid>
  );
} 